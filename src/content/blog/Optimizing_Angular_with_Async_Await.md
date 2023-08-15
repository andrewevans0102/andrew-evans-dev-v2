---
title: Optimizing Angular with Async Await
pubDate: 2018-12-18T12:23:31.000Z
snippet: "Recently I've been working on an Angular app and had a situation where I needed a more efficient way of handling async calls.The project I'm working on is a weather app that has to ca"
heroImage: home.jpg
tags: ["angular"]
---

Recently I’ve been working on an Angular app and had a situation where I needed a more efficient way of handling async calls.

The project I’m working on is a weather app that has to call 4 different REST endpoints to get associate data from the NOAA weather APIs.

Previously my code looked kinda nasty, and had the following service method that is called when the app starts up:

```js
getWeather(lat: string, long: string): Promise<any> {
  return new Promise((resolve, reject) => {
    this.weatherDisplay.latitude = lat;
    this.weatherDisplay.longitude = long;

    const metadataPromise = this.getMetadata(lat, long);
    metadataPromise.then(
      function(metadataSuccess) {
        this.weatherDisplay.radarStation = metadataSuccess['properties']['radarStation'];
        const city = metadataSuccess['properties']['relativeLocation']['properties']['city'];
        const state = metadataSuccess['properties']['relativeLocation']['properties']['state'];
        this.weatherDisplay.currentLocation = city + ', ' + state;
        this.weatherDisplay.forecastURL = metadataSuccess['properties']['forecast'];
        this.weatherDisplay.observationStations = metadataSuccess['properties']['observationStations'];

        const radarStationsPromise = this.getRadarStations(this.weatherDisplay.observationStations);
        radarStationsPromise.then(
          function(observationStationsSuccess) {
            // Select the closest radar station to use in call
            const closestStation = this.getRadarStationClosest(observationStationsSuccess['features'], lat, long);
            this.weatherDisplay.observationsURL = closestStation + '/observations/latest';

            // Current Observations
            const observationsPromise = this.getObservations(this.weatherDisplay.observationsURL);
            observationsPromise.then(
              function(observationsSuccess) {
                const celsius = observationsSuccess['properties']['temperature']['value'];
                const farenheit = (celsius + (9 / 5) + 32).toFixed(0);
                this.weatherDisplay.temperature = String(farenheit);
                this.weatherDisplay.icon = observationsSuccess['properties']['icon'];
              }.bind(this),
              function(error) {
                alert (error);
                reject(error);
              }
            );

            // Detailed Forecast
            const detailedForecastPromise = this.getDetailedForecast(this.weatherDisplay.forecastURL);
            detailedForecastPromise.then(
              function(detailedForecastSuccess) {
                this.weatherDisplay.forecast = detailedForecastSuccess['properties']['periods'];
              }.bind(this),
              function(error) {
                alert(error);
                reject(error);
              }
            );

            // Call Promise.all to get all the information at one time
            Promise.all(
              [observationsPromise, detailedForecastPromise])
              .then(
                function(success) {
                  resolve(this.weatherDisplay);
                }.bind(this),
                function(error) {
                  alert(error);
                  reject(error);
                }
              );
          }.bind(this),
          function(error) {
            alert(error);
            reject(error);
          }
        );
      }.bind(this),
      function(error) {
        alert(error);
        reject(error);
      }
    );
  });
}
```

As you can see from this code, there is one main promise that wraps several other promises. There are 4 calls that are made here:

- metadata
- radar stations
- latest observations
- detailed forecast

Each one of these methods calls a NOAA api endpoint with the standard httpclient that comes with Angular. The issue here is that all of the calls in the code above are nested and are hard to read and even harder to maintain.

## Enter Javascript’s Async Await

With Async Await you can make your Javascript code be synchronous, and control the flow of the event loop.

With Async Await you basically preface your method with the “async” keyword and then wherever you want to create thread blocks in your code you add the “wait”.

So some sample code would be:

```js
async doStuff(): Promise<any> {

    const asyncVariable = await callAsync();

    const secondVariable = await callAsync();

}
```

In the code above whenever the “doStuff” method is called, the calls to “callAsync” will create thread blocks. So this all allows you to control the execution of your code, and not have to do nesting like I had done before.

When you use Async Await on your method or function, it will return a Promise. You can handle errors and resolve the Promise just like you would anywhere else with Javascript.

Using Async Await greatly improves your code and is a small step toward making it easier.

Going back to the code I pasted above. After using Async Await I did some pretty major refactoring of the method and grouped the API calls. The end result was much easier code as you see here

```js
async getWeather(lat: string, long: string): Promise<WeatherDisplay> {
  try {
    const metadata: any = await this.getMetadata(lat, long);
    if (metadata instanceof Error) {
      throw metadata;
    }
    this.weatherDisplay.latitude = lat;
    this.weatherDisplay.longitude = long;
    this.weatherDisplay.radarStation = metadata['properties']['radarStation'];
    const city = metadata['properties']['relativeLocation']['properties']['city'];
    const state = metadata['properties']['relativeLocation']['properties']['state'];
    this.weatherDisplay.currentLocation = city + ', ' + state;
    this.weatherDisplay.forecastURL = metadata['properties']['forecast'];
    this.weatherDisplay.radarStationsURL = metadata['properties']['observationStations'];

    // Select the closest radar station to use in call
    const radarStations = await this.getRadarStations(this.weatherDisplay.radarStationsURL);
    if (radarStations instanceof Error) {
      throw radarStations;
    }
    const closestStation = this.getRadarStationClosest(radarStations['features'], lat, long);
    this.weatherDisplay.observationsURL = closestStation + '/observations/latest';

    const latestObservations = await this.getLatestObservations(this.weatherDisplay.observationsURL);
    if (latestObservations instanceof Error) {
      throw latestObservations;
    }
    const celsius = latestObservations['properties']['temperature']['value'];
    const farenheit = (celsius + (9 / 5) + 32).toFixed(0);
    this.weatherDisplay.currentTemperature = String(farenheit);
    this.weatherDisplay.icon = latestObservations['properties']['icon'];

    const detailedForecast = await this.getDetailedForecast(this.weatherDisplay.forecastURL);
    if (detailedForecast instanceof Error) {
      throw detailedForecast;
    }
    this.weatherDisplay.forecast = detailedForecast['properties']['periods'];
  } catch (error) {
    this.weatherDisplay.errorMessage = error.message;
  }

  return new Promise<WeatherDisplay>((resolve) => {
    resolve(this.weatherDisplay);
  });
}
```

If you notice the calls to the API endpoints are now easily identified with the following methods:

- getMetdata
- getRadarStations
- getLatestObservations
- getDetailedForecast

Also you should note how the errors are being handled thanks to using Async Await for these methods. These endpoints all return promises with the “await” and the return object is checked for being type “error”. The endpoints use the “Promise.catch” model for handling the errors. If an error is thrown in the http GET request, a custom error object is returned. Here is one of the methods:

```js
getMetadata(lat: string, long: string): Promise<any> {
  const metadataURL: string = 'https://api.weather.gov/points/' + lat + ',' + long;
  return this.http.get(metadataURL).toPromise()
    .catch(() => new Error('error when calling metadataURL'));
}
```

Using Async Await and the above error handling, the process for resolving errors in this app is the following:

1.  The methods that call the NOAA endpoints first catch the actual error and create a custom error object to return
2.  The calling method (main) checks to see if the return is of type “error” and if so, uses the Javascript “throw” to throw that error in the try{}…catch{} block that surrounds the main service method
3.  The “throw” sends the error to the main “catch”
4.  The “catch” saves the error message as the “errorMessage” property in the return object
5.  The method returns a Promise with the “errorMessage” in the return object that can be handled by the calling component

This enables the users of the app to trace any error directly to the endpoint that was causing it. This method of handling errors and the ease to which you can use this code was made possible with Async Await in Javascript.

Hopefully the code here shows you the benefit of Async Await in your applications. Check out the [Link Here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) for more information.
