---
title: Building a Highly Performant Weather App
pubDate: 2024-01-03T18:17:17.476Z
snippet: "Last year I rebuilt a weather app that I've used over the past few years. I wanted to share how I built it and some things I learned a long the way. The solution I have provides the forecast quickly, and offloads the work into an asynchronous process. Where I've found many other weather apps"
heroImage: /images/GW_SNOWFLAKES.jpeg
tags: [weather, aws, react, javascript]
---

Last year I rebuilt a weather app that I've used over the past few years. I wanted to share how I built it and some things I learned a long the way. The solution I have provides the forecast quickly, and offloads the work into an asynchronous process. Where I've found many other weather apps lag (or even crash), my application offloads that process and the frontend only has to retrieve the results.

This post will highlight some of the features of the app. If you'd like to see the weather app running in realtime, check out [gooseweather.com](https://gooseweather.com). The app was named after my wife (my nickname for her is "Goose") and is in honor of her original dream of being a meteorologist. If you'd like to learn more about the original application, I wrote a post on it a few years ago and [you can find it on medium](https://medium.com/angular-in-depth/how-to-start-flying-with-angular-and-ngrx-b18e84d444aa).

## What I built and How it Works

![goose weather v2 cards](/images/GW_4.jpg)

The backend of the app is a set of AWS Lambda functions that retrieve the weather in regular half hour intervals and save the results in a JSON file in an S3 bucket. There is an additional Lambda that is behind API Gateway that the frontend calls with a GET call when you first go to [gooseweather.com](https://gooseweather.com).

![goose weather V2 backend](/images/GW_BACKEND.jpg)

I also found in the Lambda visualizations in the AWS console that you can graph runs of the app. This is a line chart showing invocations of the course of one day:

![goose weather V2 visualized](/images/GW_VISUALIZED.jpg)

The frontend of the app is a static React app stored in an S3 bucket and served over a CDN. It is designed to be held with an iPhone so is mobile first with the styles. It creates a set of cards that show weather information and a forecast. It also has a link to the local radar. The weather is specific to Richmond, Va (where I am based).

![goose weather V2 collage](/images/GW_COLLAGE.jpg)

To get the weather I used the [National Weather Service APIs](https://www.weather.gov/documentation/services-web-api) for the hourly and daily forecast. To get the current conditions, I use the [OpenWeatherMapAPI](https://openweathermap.org/api).

As I stated in the intro, what makes the app performant is that the actual work of retrieving the weather is done asynchronously. So the Frontend just has to read a JSON file that was created by the lambda that runs every half hour.

## Some Highlights

For the hosting part of the project, I followed the same pattern I outlined in my post [Deploy a React App with the AWS CDK](https://andrewevans.dev/blog/2023-02-21-deploy-a-react-app-with-the-aws-cdk/).

Within the lambda that retrieves the weather, I created wrapper methods for common actions like writing to S3:

```js
import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { FileBody } from '../../../src/models/Weather';

export const writeS3 = async (
    fileName: string,
    fileBody: FileBody,
    fileBucketName: string
) => {
    const s3 = new S3();

    const params: PutObjectRequest = {
        Bucket: fileBucketName,
        Key: fileName,
        ContentType: 'application/json',
        Body: JSON.stringify(fileBody),
    };

    await s3.putObject(params).promise();
};
```

I also created custom types for the output so that the values aligned:

```js
export type WeatherReport = {
    startTime: string;
    temperature: number;
    wind: string;
    icon: string;
    shortForecast?: string;
    detailedForecast?: string;
    name?: string;
};

export interface OWMConditionsResponse {
    pressure: string;
    windSpeed: string;
    windDirection: string;
    OWMConditionsStatus: string;
    temperature: string;
    humidity: string;
}

export interface FileBody {
    body: WeatherReport[] | OWMConditionsResponse;
    retrieved: string;
    status: 'success' | 'error';
    errorMessage?: string;
}

export interface WeatherResponse {
    conditions: FileBody;
    daily: FileBody;
    hourly: FileBody;
}
```

I do not get to use [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) very much, but had the opportunity with the functions that call the NWS APIs.

```js
export const callNWSDailyForecastApi = async () => {
    // NWS APIs periodically have issues so using a helper function to retry when failing
    const response = await ApiRetry(5, dailyForecast);
    if (response === null) {
        throw new Error('error when calling NWS Daily Forecast Api');
    }

    const weatherPeriods: WeatherPeriod[] = response.data.properties.periods;

    const weatherForecast: WeatherReport[] = weatherPeriods.reduce(
        (combinedPeriods: any[], period: WeatherPeriod) =>
            period !== undefined
                ? combinedPeriods.concat({
                      name: period.name,
                      startTime: period.startTime,
                      temperature: period.temperature,
                      wind: `${period.windSpeed} ${period.windDirection}`,
                      shortForecast: period.shortForecast,
                      detailedForecast: period.detailedForecast,
                  })
                : combinedPeriods,
        []
    );

    return weatherForecast;
```

If you note in the above snippet, I mention having to do retry calls. I had a few experiences with the NWS APIs where I temporarily would get 500s. To resolve this, I just built a small retry function that calls and waits if it hits a failure.

```js
import axios, { AxiosResponse } from 'axios';

const callSleep = (ms: number): Promise<NodeJS.Timeout> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const ApiRetry = async (
    numberAttempts: number,
    ApiAddress: string
): Promise<AxiosResponse | null> => {
    let response: AxiosResponse | null = null;

    for (let i = 0; i < numberAttempts; i++) {
        try {
            response = await axios.get(ApiAddress);
            break;
        } catch (error) {
            console.log(
                `error occured calling ${ApiAddress} with message ${error} and attempt ${i.toString()}`
            );
            response = null;
            await callSleep(1000);
        }
    }

    return response;
};

export { callSleep, ApiRetry };
```

Finally, I also wanted to make sure I only had the latest successful call from the weather APIs. To ensure this, I added a custom function to handle writing errors:

```js
const writeError = async (fileName: string, retrieved: string, error: any) => {
    // when error occurs retrieve the existing value and update the date pulled
    const oldEntry: GetObjectOutput = await readS3(fileName);

    const fileBody: FileBody = {
        body: oldEntry.Body
            ? JSON.parse(oldEntry.Body.toString('utf8')).body
            : '',
        retrieved,
        status: 'error',
        errorMessage: error,
    };
    await writeS3(fileName, fileBody, fileBucketName);
};
```

With the async calls setup, the frontend can do just one API call and then set the values from the JSON file accordingly:

```js
const HomePage = () => {
    const [weather, setWeather] = useState<WeatherResponse>();

    useEffect(() => {
        axios.get(GET_ENDPOINT).then((response: AxiosResponse) => {
            setWeather({
                conditions: JSON.parse(response.data.conditions),
                daily: JSON.parse(response.data.daily),
                hourly: JSON.parse(response.data.hourly),
            });
        });
    }, []);

    // I left out some of the view JSX just to make this snippet smaller
    <HomeSection>
        {weather && weather.conditions ? (
            <CurrentConditions
                conditions={weather.conditions}
                image={(weather.hourly.body as WeatherReport[])[0].icon}
                shortForecast={
                    (weather.hourly.body as WeatherReport[])[0]
                        .shortForecast!
                }
            />
        ) : (
            <Spinner />
        )}
    </HomeSection>}
```

## Wrapping Up

I know this post was necessarily brief, but I thought it created a cool pattern that made for a very fast weather forecast. I've had mixed experiences with other weather apps where they crash or were slow. Having my own streamlined version is fast and reliable. It was a pretty useful side project and have had good results. Thanks for reading my post!
