---
title: Getting Started with Azure Functions
pubDate: 2021-05-18T02:09:57.867Z
snippet: "I've recently been working with Azure Functions and wanted to write a
  post on some cool things I learned. In this post I'm going to introduce Azure
  Functions and also talk about some fun things you can do with them. I'm going
  to be focused on how you use Azure Functions with Web Development
  specifically. So I'm looking at them "
heroImage: /images/thunderstorms.jpg
tags: ["azure"]
---

I've recently been working with Azure Functions and wanted to write a post on some cool things I learned. In this post I'm going to introduce [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) and also talk about some fun things you can do with them. I'm going to be focused on how you use Azure Functions with Web Development specifically. So I'm looking at them from how I can use them in my Frontend applications. Azure Functions are super versatile and can be used for backend systems as well.

If you'd like to see the source code from the examples I'll be discussing, [check out my GitHub repo](https://www.github.com/andrewevans0102/getting-started-with-azure-functions).

## What are Azure Functions?

Azure Functions are a variation of "serverless" technologies that allow you to write code, and only use it when you need. Traditionally, the idea of a "server" was that your code would be hosted somewhere. You would have to setup a web hosting framework like Apache or Nginx, and then you'd deploy your running code there.

Serverless is really great because you basically write your code, and then you let the cloud provider (in this case Microsoft Azure) handle the hosting part. It also helps with costs, as you only pay for when the code is executed.

Serverless technologies like Azure Functions are present in all of the major cloud providers. Azure has done a great job of both documenting and making it easy for folks to get started. The examples I'm going to walkthrough started with the [Azure Functions VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). I also recommend checking out the [Azure Quickstart](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node).

Azure Functions come in several flavors. I'm specifically going to be talking about the [HTTP Trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook). There are also other ways you can invoke Functions from inside Azure services. It really is pretty amazing how expansive the options are. Check out the official [Microsoft Docs](https://docs.microsoft.com/en-us/azure/azure-functions/) for more.

## Writing an Azure Function

If you follow the VSCode tutorials, you leverage the Azure Extension to deploy and run your functions locally. This makes the workflow pretty straightforward (and can be a lot of fun).

You can write Azure Functions in several different languages. For the purposes of this post, I'm going to focus on the JavaScript implementation. I do this because (1) I'm a big fan of JavaScript and (2) it shows how folks familiar with Frontend work can also do backend projects with functions.

Once you have your function code, you should have a handler that looks something like this:

```js
module.exports = async (context, req) => {
```

You leverage the `context` object to pass back a response, and the `req` object to get things like a body or query parameters.

At the end of your function, you typically return a context object with a response like this:

```js
      context.res = {
        status: 200,
        body: <response>
      };
```

From there, it's just a matter of passing in what you would normally with any traditional API system. You can even create helper functions and most of the same features you have with a full hosted system.

## My Example

So for the purposes of this post, I'm going to take a small weather app that I have built and move the "backend" functionality into an Azure Function.

![Weather App](/images/screen-shot-2021-05-18-at-8.42.30-am.png)

The app uses the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) to get your lattitude and longitude, and then calls NOAA and the [openweathermapAPI](https://openweathermap.org/api) to get your local conditions.

The original app can be found [at my GitHub repo](https://github.com/andrewevans0102/weather-app).

The modified version (including the use of Azure Functions) can be found at my [new GitHub repo](https://www.github.com/andrewevans0102/getting-started-with-azure-functions).

If you look in the modified version (that includes the Azure Functions), you can see the function code in the `functions` folder.

Hooking it all up locally, you'll need to put in the value of the hosted function endpoint in the Angular environment file at `src/environments`:

```js
export const environment = {
  production: false,
  openWeatherMapAPIKey: "OPEN_WEATHER_MAP_API_KEY",
  weatherAzure: "HOSTED_AZURE_FUNCTION_ENDPOINT",
};
```

## Connecting the App to Azure Functions

So basically to move my function to Azure, I just replaced the [original Angular service that I had written](https://github.com/andrewevans0102/weather-app/blob/master/src/app/services/weather.service.ts). I moved all of the API calls into an Azure function, deployed it, and then replaced the call to the service to be a straight HTTP call to my function.

```js
// before
  savePosition(position) {
    this.lat = position.coords.latitude.toFixed(4).toString();
    this.long = position.coords.longitude.toFixed(4).toString();

      this.weatherService.getWeather(this.lat, this.long)
      .then(
        function(success) {
          this.weatherDisplay = success;
          if (this.weatherDisplay.errorMessage !== undefined) {
            alert(this.weatherDisplay.errorMessage);
          }
        }.bind(this),
        function(error) {
          alert(error);
          this.weatherDisplay = new WeatherDisplay();
        }.bind(this)
      );
  }
```

```js
// after
  async savePosition(position: any) {
    try {
      this.lat = position.coords.latitude.toFixed(4).toString();
      this.long = position.coords.longitude.toFixed(4).toString();

      const weatherResponse = await axios.get(
        `${environment.weatherAzure}?lat=${this.lat}&long=${this.long}&output=show`
      );
      this.weatherDisplay = weatherResponse.data;
    } catch (error: any) {
      alert(error);
    }
  }
```

## The Function

The actual Function basically just takes in the latitude and longitude and then calls the APIs to create a weather response.

```js
const lat = req.query.lat;
const long = req.query.long;
const metadataURL = `https://api.weather.gov/points/${lat},${long}`;

const metadata = await axios.get(metadataURL);
console.log("metadata was called successfully");

const weatherDisplay = {
  latitude: "",
  longitude: "",
  currentTemperature: "",
  currentLocation: "",
  icon: "",
  forecastURL: "",
  forecast: {},
  currentCondition: "",
  sunrise: "",
  sunset: "",
  errorMessage: "",
};

weatherDisplay.latitude = lat;
weatherDisplay.longitude = long;
const city = metadata.data.properties.relativeLocation.properties.city;
const state = metadata.data.properties.relativeLocation.properties.state;
weatherDisplay.currentLocation = city + ", " + state;
weatherDisplay.forecastURL = metadata.data.properties.forecast;
const units = "imperial";
const openWeatherMapAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=${units}&appid=${process.env["openWeatherMapAPIKey"]}`;

const currentWeather = await axios.get(openWeatherMapAPIURL);
console.log("openWeatherMapAPI was called successfully");

console.log(JSON.stringify(currentWeather.data));

weatherDisplay.currentTemperature = String(
  Math.ceil(currentWeather.data.main.temp),
);
weatherDisplay.currentCondition = currentWeather.data.weather[0].description;
weatherDisplay.sunrise = formatSunrise(currentWeather.data.sys.sunrise);
weatherDisplay.sunset = formatSunset(currentWeather.data.sys.sunset);

const detailedForecast = await axios.get(weatherDisplay.forecastURL);
console.log("detailed forecast was called successfully");

weatherDisplay.forecast = detailedForecast.data.properties.periods;
```

The app just makes that HTTP call and its all good. This made my frontend application much simpler because all of my logic was now in this function.

The API Key for the Open Weather Map API is also in an environment variable. Azure has lots of ways to handle storing values like this.

## Taking it a step farther

I had also recently done some work with file downloads, and thought it'd be fun to showcase how to do that with Azure Functions.

I followed a [post on medium that did this](https://medium.com/@hosarsiph.valle/download-files-with-azure-functions-node-js-35d4f8d08cb8).

You basically just create a blob file object and then pass it back in the response:

```js
let fileBuffer = Buffer.from(JSON.stringify(weatherDisplay, null, 4));
const fileName = "output.json";
context.res = {
  status: 202,
  body: fileBuffer,
  headers: {
    "Content-Disposition": `attachment; filename=${fileName}`,
  },
};
context.done();
```

When it comes to the frontend, you just open a tab with the address of your HTTP function and the browser will recognize the return payload and ask you to save the file:

```js
  saveFile() {
    try {
      const url = `${environment.weatherAzure}?lat=${this.lat}&long=${this.long}&output=file`;
      window.open(url, '_blank');
    } catch (error: any) {
      alert(error);
    }
  }
```

![File Download](/images/screen-shot-2021-05-18-at-8.43.34-am.png)

This is very powerful because now your application doesn't have to go through all the mess of setting up a download and passing control to it. The function does all the work for you.

## Closing Thoughts

So after doing all of this, I had a few key takeaways.

First, this greatly simplified the flow in my frontend application because now all the "backend" work was done with my function. This made my project much cleaner and easy to maintain.

Second, things like API keys or secrets can all be stored with the Function and not in my frontend code. I didn't mention it, but the [open weather map API](https://openweathermap.org/api) requires a free license key to use. Similarly, you can imagine other secrets that you might not want to have sitting in your frontend project.

Additionally, the process of deploying and monitoring the app in Azure was really straightforward. The GUI in the Azure Console is well documented, and with just a few clicks you can get just about anything you need.

Finally, this whole process was basically free. As I mentioned in the intro, the model that "serverless" computing runs on is based on usage. These functions only run for a few seconds at most, and so the runtime is very cheap. This is great because now we don't have to pay for a hosted instance and all the maintenance that comes with.
