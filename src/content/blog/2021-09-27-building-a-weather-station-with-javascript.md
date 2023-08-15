---
title: Building a Weather Station with JavaScript
pubDate: 2021-09-27T18:10:22.663Z
snippet: "If you've followed my writing over the past year, you'll have seen
  that I've built several weather applications in the past. I love working with
  weather applications and the outdoors.  A few weeks ago, I rebuilt my weather
  station at my house and "
heroImage: /images/thunderstorm-3440450_1920.jpg
tags: ["firebase", "iot", "javascript"]
---

If you've followed my writing, you'll have seen that I've built several weather applications. I love working with weather applications and the outdoors. Last year I built a weather station, you can follow what I did by reading my post
[Building a Weather Station with a Raspberry Pi and Firebase](https://rhythmandbinary.com/post/2020-07-20-building-a-weather-station-with-a-raspberry-pi-and-firebase).

A few weeks ago the DHT22 sensor I was using went bad. I took this as an opportunity to improve my original project, and rebuilt my weather station. In the process of doing this, I had the chance to use some pretty cool technologies. In this post, I'm going to walk through what I did and share some things I learned a long the way. I have an open source version of my project available in my GitHub repo [evans-weather2](https://github.com/andrewevans0102/evans-weather2). I'll be referencing that in this post.

## My Project

So to start with, I want to define what I mean by a "weather station." My "weather station" is basically a central place that I can get the following information:

- temperature
- humidity
- wind direction and speed
- Barometric Pressure
- Detailed forecast for today and tomorrow
- Radar
- Hourly project temperature for the next 12 hours

The end product is that I put this all into an application that can run on an old computer I have at home. To build this all I needed was:

- [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/)
- [DHT 22 Sensor (you can get these on Amazon)](https://www.amazon.com/HiLetgo-Temperature-Humidity-Electronic-Practice/dp/B0795F19W6/ref=sr_1_4?dchild=1&keywords=DHT22+Sensor&qid=1632775043&sr=8-4)
- [Jumper wires](https://www.amazon.com/dp/B01EV70C78?ref=nb_sb_ss_w_as-ypp-rep_ypp_rep_k0_1_12&crid=34UWSDSNQJS5K&sprefix=jumper+wires)
- [A Firebase Account](https://firebase.google.com/)
- [VSCode](https://code.visualstudio.com/)

The way it works is that I have a Raspberry Pi hooked up with a DHT22 sensor and that gives me temperature and humidity:

![Raspberry Pi with DHT22 Sensor](/images/2021-09-27_14-27-26.png)

If you see in the picture, I have 3D Printed housing for the sensor that I was able to use to attach to the window.

Once I have the temperature and humidity, then I just add a cron job on the Raspberry Pi that runs every 5 minutes to get the temp and humidity, and then do a POST to a [Firebase Function](https://firebase.google.com/docs/functions) API that I have built that saves the information to [Firestore](https://firebase.google.com/docs/firestore).

When the POST happens, it then triggers calls to [NOAA APIs](https://www.weather.gov/) for projected forecast and hourly temperatures, and then the [OpenWeatherMapAPI](https://openweathermap.org/api) to get the barometric pressure and wind information.

All of this information is stored in Firestore and the process basically looks like this:

![Process flow](/images/weather_flow.png)

While all this is happening, I then have an Electron App (originally a React web project) that is running on an older computer. This app polls the Firestore instance and retrieves the weather information every 5 minutes. The screen ended up looking like this:

![Screenshot of weather client running](/images/2021-09-27_14-47-39.png)

Alongside it, I have the NOAA radar which auto updates. So the end result is that my weather information is updated every 5 minutes, and then my radar is continually updated as well. Thus creating a fully functional (and automated) weather station.

![Computer with weather station on it](/images/2021-09-27_16-26-59.png)

## Application Architecture

So to build this project, I had three big components:

- The weather sensor

  - Raspberry Pi
  - DHT22 Sensor

- The weather server

  - Firebase Functions API that
  - POST to gather the data and store it in Firebase
  - GET to retrieve the data for display

- The weather client (Electron App)

  - Originally a React project (built with create-react-app)
  - Packaged as an electron app so it could run as a program on an old computer

Putting all of these together took time, and I basically just iterated over each one individually.

## Weather Sensor

The weather sensor was pretty straightforward. If you've seen my previous posts, I've used DHT22 sensors several times. They're great and easy to work with, especially with a Raspberry Pi. Other than the physical wiring of the sensor, the code for this is basically just (1) GET data and then (2) make an HTTP post.

```py
try:
	temperature = round(dhtDevice.temperature * (9 / 5) + 32)
	humidity = dhtDevice.humidity
	weather_body = {
		'temp': str(temperature),
		'humid': str(humidity),
		'status': 'success'
		}
	logging.info('reading successful with temp: ' + str(temperature) + ' and humidity ' + str(humidity))
	sentRequest = requests.post(url = sensor_endpoint, headers = headers, data = json.dumps(weather_body))
	logging.info("sensor was sent with status code of " + str(sentRequest.status_code))
	time.sleep(10)
except RuntimeError as error:
	# Errors happen fairly often, DHT's are hard to read, just keep going
	logging.error('Runtime Error')
	logging.error(error.args[0])
	weather_body = {
		'temp': '',
		'humid': '',
		'status': error.args[0]
	}
	sentRequest = requests.post(url = sensor_endpoint, headers = headers, data = json.dumps(weather_body))
	logging.info("sensor was sent with status code of " + str(sentRequest.status_code))
except Exception as error:
	logging.error('General Exception')
	logging.error(error.args[0])
	weather_body = {
		'temp': '',
		'humid': '',
		'status': error.args[0]
	}
	sentRequest = requests.post(url = sensor_endpoint, headers = headers, data = json.dumps(weather_body))
	logging.info("sensor was sent with status code of " + str(sentRequest.status_code))
```

I also included a custom header with a encoded JSON Web Token. This is to secure the transaction between the Raspberry Pi and my Firebase API. I used [pyJWT](https://pypi.org/project/PyJWT/). To create the token I basically did this:

```py
>>> import jwt
>>> encoded = jwt.encode({"some": "payload"}, "secret", algorithm="HS256")
>>> print(encoded)
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZCJ9.Joh1R2dYzkRvDkqv3sygm5YyK8Gi4ShZqbhK2gxcs2U
>>> jwt.decode(encoded, "secret", algorithms=["HS256"])
{'some': 'payload'}
```

> copied from the GitHub example at https://github.com/jpadilla/pyjwt

I had one issue when attaching the value as a bearer token. I had to use [the "decode" method of bytes](https://docs.python.org/3/library/stdtypes.html#bytes.decode) so that the value passed into the Header was a string and could be consumed by my Firebase API.

```py
headers={
    "Content-Type": "application/json",
    "authorization": "Bearer " + encoded_jwt.decode("utf-8")
}
```

Figuring that out took a little bit more time than I had hoped, but that worked and then I was able to send it to Firebase.

## Weather Server

Other than the obvious calling and parsing of data to the Weather APIs, my Firebase instance checks the Bearer token attached to verify the request from the client. I thought this was really cool because my Firebase Functions API is actually in JavaScript. The Raspberry Pi that I had hooked up with the sensor is running Python. This is one of those times when web standards really becomes powerful. Two different languages can use the same thing because they're using the same underlying Algorithm. Since I'm using JavaScript, I used the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) npm package. With my Functions API, I'm using [Node Express](https://expressjs.com/) and added this as middleware like this:

```js
// secure API calls
const validateToken = async (req, res, next) => {
  if (req.headers.authorization === undefined) {
    console.log("authorization header was not defined");
    return res.status(403).send("Unauthorized");
  }

  try {
    // verify the JWT for the request
    const authorization = req.headers.authorization.split("Bearer ")[1].trim();
    console.log(authorization);
    const decodedPayload = jwt.verify(authorization, process.env.SENSOR_KEY);
    if (decodedPayload.source !== process.env.SENSOR_SOURCE) {
      console.log("authorization header was not valid");
      throw new Error("Unauthorized");
    }
    console.log("authorization header was good");
    next();
    return;
  } catch (error) {
    console.log(error);
    return res.status(403).send("Unauthorized");
  }
};
app.use(validateToken);
```

If you'd like to learn more about building APIs with Firebase Functions, I recommend you check out my post [Building an API with Firebase](https://rhythmandbinary.com/post/Building_an_API_with_Firebase).

## Weather Client

![Copy of weather client screenshot](/images/2021-09-27_14-47-39.png)

My client then displays the data retrieved is an Electron App that is running on an old computer. There are lots of ways I could have done this, but I chose Electron because (1) I thought it was cool and (2) it was more sustainable then having to stay logged into a web app. I was looking for something that could run autonomously and that I wouldn't have to fix very often.

I started the project by building a React website. I basically just followed the [creat-react-app](https://reactjs.org/docs/create-a-new-react-app.html) process. Then I added an RxJS interval to properly run the polling of the Firebase API:

```js
// call weather every 5 minutes after it loads
const weatherTimer = interval(intervalSeconds);
const unsubscribe$ = new Subject();
const weatherObservable = weatherTimer.pipe(
  takeUntil(unsubscribe$),
  catchError((error) => {
    throw error;
  }),
);
unsubscribe$.subscribe();
weatherObservable.subscribe(async () => {
  setShowProcessing(true);
  try {
    await callWeather();
  } catch (error) {
    console.log(error);
  }
  setTimeout(() => {
    setShowProcessing(false);
  }, 2000);
});
```

With this, I had a "callWeather" function that basically did the HTTP call and then updated the associated local state of the weather information.

[Electron](https://www.electronjs.org/) by itself is a really cool technology as it lets you package JavaScript projects into fully packaged apps that can be installed on desktops. There are a lot of ways to do this, and I had to do some googling to get it all right. Once you get down to it, it's really just using one of the build tools and adding a few things to your project:

- install [electron](https://www.npmjs.com/package/electron) and [electron-builder](https://www.npmjs.com/package/electron-builder) as a dev dependency to your project
- create an npm script that packages your project with electron builder

```bash
   "electron-pack": "npm run build && electron-builder build --publish never"
```

- Add a "build" definition to the `package.json` as follows:

```json
  "build": {
    "appId": "com.example.electron-cra",
    "files": [
      "build/**/*",
      "node_modules/**/*"
    ]
  },
```

- add a "homepage" entry to your `package.json` as follows:

```json
  "homepage": "./",
```

- add a "manifest.json" file to your React App's public directory that looks similar to the following:

```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

- when all that is set, you can run `electron-pack` and that should create the packaged solution

There are a lot of options with electron builder. I recommend checking out [their docs](https://www.electron.build/).

I also had several issues getting this to work initially. I found it works best if you're on the OS of the machine you want to install it on. So that means if you want to install on a Mac, do this on a Mac, if you want to do it on a PC, do it on a PC. I use both, but for this project I was primarly working on Windows Subystem for Linux (WSL) on a Windows PC. I ended up having to get onto regular Windows and use VSCode on windows (not WSL) to properly package the EXE file that I used for installing it on my old computer. There's a lot of docs on this as well, but I just recommend building it on whatever OS you intend to do an install on.

Beyond the packaging, the rest of the electron app was basically just tweaking the display to match what my screen resolution showed.

## Full Picture

So with all of this hooked up, I ended up with a fully working solution. I've had it running for a few weeks now and I have to say it works great. Other than the typical Windows Updates, I haven't even really had to restart the machine it's running on. I recommend checking out the source code at my GitHub repo [evans-weather2](https://github.com/andrewevans0102/evans-weather2).

This project is cool because it makes use of several technologies for both front and back. It also was a learning opportunity for me because I had not really dove that deep into JSON Web Tokens or packaging React apps for Electron. There are a lot of ways to do this same type of a project, and that also makes this fun.

I encourage you to check out some of the technologies I've outlined in this article. They all have a pretty solid set of docs and have a lot of fun things to learn and do.
