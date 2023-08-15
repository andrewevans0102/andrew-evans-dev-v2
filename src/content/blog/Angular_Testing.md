---
title: Angular Testing
pubDate: 2018-12-19T04:17:07.000Z
snippet: "I've been working on an Angular weather app that I've mentioned in several posts. As part of the work on that app I built out unit tests that covered the majority of the project (89%)."
heroImage: home.jpg
tags: ["angular", "testing"]
---

I’ve been working on an Angular weather app that I’ve mentioned in several posts. As part of the work on that app I built out unit tests that covered the majority of the project (89%).

I wanted to write about Angular Testing in general and include some of the tests and methods I learned in the process.

You usually write tests to cover functionality. These tests also usually consist of unit tests or end to end tests with tools like Karma and Protractor. A best practice is to include these tests in your CICD pipeline so new functionality is always tested before it gets deployed. This hopefully prevents bad code from getting deployed and ensures a healthy application.

There are a lot of advantages to testing to include:

- Making sure new code doesn’t hurt old code (regression testing)
- Testing the overall health of your app (are any of your endpoints failing?)
- Being able to see how your app performs for different situations
- Ensuring that your app does not create errors that are unexpected
- and the list just goes on…

I actually have written several posts on testing previously, on just a high level check out the post here [here](https://rhythmandbinary.com/2018/10/12/software-testing/)

I also recommend checking out the works of John Papa and Uncle Bob to get an intro what “clean code” and testing is all about. Here is a link to John Papas Pluralsight course on clean code in AngularJS here [here](https://www.pluralsight.com/courses/angularjs-patterns-clean-code). Here is a good video from Uncle Bob talking about clean code in general [here](https://www.youtube.com/watch?v=Nsjsiz2A9mg)

If you use Anuglar2+ you typically have an architecture that is composed of components and modules that will call services. There are many different design patterns you could follow, but a basic Angular app is composed of connections between the display elements and the backend calls and orchestration of the data you are working with.

The weather app that I mentioned before is fairly simple with a parent component feeding two child components. There is one main service that calls multiple NOAA endpoints to get the weather information. I’m going to walkthrough the setup for some tests I wrote. For a more in depth discussion of this app check out my post [here](https://rhythmandbinary.com/2018/12/19/my-first-open-source-project/).

I should also note, for the following examples I’m assuming you have some basic understanding of a Karma and Jasmine setup. Please consult the following post for a more introductory explanation [here](https://rhythmandbinary.com/2018/11/11/using-karma-tests-with-angular/)

## Verifying the Component is Created

If you just look at the basic tests that are created in the spec file for any Angular component created with the CLI, you should see a test that already checks for the component “toBeTruthy”. If you add additional properties, etc. you’ll need to pull those in using the “beforeEach” method that Jasmine provides. Here you are essentially building an environment for Karma to write your tests. Your tests are written in the Jasmine language with Karma actually running what you have written. Check out a link for more information on Jasmine [here](https://jasmine.github.io/). Check out a link to more information on Karma here [here](https://karma-runner.github.io/latest/index.html).

An example of test for “toBeTruthy” is in the following:

```js
let component: ForecastComponent;
let fixture: ComponentFixture<ForecastComponent>;
const weatherDisplay: WeatherDisplay = require("../../../assets/testing/weather-display.json");

beforeEach(async(() => {
  TestBed.configureTestingModule({
    declarations: [ForecastComponent],
    imports: [HttpClientModule, MaterialModule],
  }).compileComponents();
}));

beforeEach(() => {
  fixture = TestBed.createComponent(ForecastComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});
```

With regards to the snippet I’m showing here, you have

- “fixture” which represents a testable version of your Angular component
- “component” which represents an instance of the “fixture”
- testable environment setup by the declarations and imports of “TestBed.configureTestingModule”

The methods “beforeEach(async)” and “beforeEach” are just called to setup your test environment before your Karma tests are actually ran. The only difference in the two is that the “async” version allows you to have an area where you put async values. These are things that may need to be created by a service or might not be readily available with the static “beforeEach” method that is shown.

with the above setup, I can run the following test

```js
it("should create", () => {
  expect(component).toBeTruthy();
});
```

This test is super basic but it checks to see if the instance is created. When you call “toBeTruthy()” it is just the Karma way of identifying that the object you are testing “truly” exists rather than traditional boolean values.

## Reacting to Changes of the Display with ngOnChanges

With regards to display, there are a lot of more in depth ways to test display elements by using the “debug” element. I briefly talk about it in my previous post [here](https://rhythmandbinary.com/2018/11/11/using-karma-tests-with-angular/) (check out the associated video and links for more info).

I also should note that the weather app that I am talking about passes changes by using the “ngOnChanges” lifecycle hook. There is an arguably easier way to do this with Observables, but I thought that using the lifecycle hook was cool and it works well for the architecture here.

The way the app is setup is that a central object is shared between a parent app component and its children components. The object is passed with the Angular input decorator, and the whole idea is that if the parent changes then the children should react. To do this in testing I first had to create a change, and then call “detectChanges” on the component instance to make the code react to the change. The end result of this test is that the value that was changed should match what I originally passed in. Here is the test that does this:

```js
it("correctly reacts to ngOnChanges lifecycle hook call", () => {
  component.weatherDisplay = weatherDisplay;
  component.ngOnChanges({
    weatherDisplay: new SimpleChange(null, weatherDisplay, true),
  });
  fixture.detectChanges();
  expect(component.weatherDisplay).toBe(weatherDisplay);
});
```

As you can see in the code above, I first pass “weatherDisplay” and then test to see if the component has taken in the “weatherDisplay” value.

## Mocking Angular HTTP Service Calls

So for any service test, you can approach the test in multiple ways. Some people use stubs and external libraries to fake a call and response. Others actually call the service directly, but thats actually an end to end test since you are testing for a full response. One of the great things about Angular is that it already has a lot of built in libraries that make it easy to mock and test values in your services.

Some of the most popular methods of testing HTTP services in Angular are:

- using the “fakeAsync” method to create a “async” area that is then flushed with a call to “flushMicrotasks” or wait for the service to complete with “tick” function
- Using the “done” parameter to force an endpoint within an async call
- Using “spyOn” to force the code to use a function or value you’ve passed in with your tests
- Use Angular’s “HttpTestingController” to force a mock response of your choosing with “request.flush” or even throw an error with “reqeust.error”

Here is an example that uses both “done()” and “spyOn”

```js
it("should catch error when radar stations call is not successful on getWeather call", (done: DoneFn) => {
  const latitude = "37.3069";
  const longitude = "-76.7496";
  spyOn(weatherService, "getMetadata").and.returnValue(
    Promise.resolve(metadata)
  );
  spyOn(weatherService, "getRadarStations").and.returnValue(
    Error("error when calling observationStationsURL")
  );
  weatherService.getWeather(latitude, longitude).then((value) => {
    expect(value.errorMessage).toBe(
      "error when calling observationStationsURL"
    );
    done();
  });
});
```

This test is verifying that an error message is correctly caught when the “getRadarStations” method catches an error. If you notice in the code the use of the “spyOn” values create mock responses when the methods will be later called inside the “getWeather” method.

So the line:

```js
spyOn(weatherService, "getMetadata").and.returnValue(Promise.resolve(metadata));
```

Is basically just saying when “getMetadata” is called in the “weatherService” make sure to return a promise that resolves to whatever is in the “metadata” variable.

If you notice the placement of the “done();” that is just signifying that this is where the test is supposed to complete. Similar to the “Promise(resolve, reject)” setup.

I should note that I noticed in some cases, if there is an actual call being made without all of these mocks then the use of “fakeAsync()” was much more help. Check out the documentation for that [here](https://angular.io/api/core/testing/fakeAsync).

Here’s another example but this one is using the HttpTestingController

```js
it("should catch error when metada call is not successful on getWeather call", () => {
  const latitude = "37.3069";
  const longitude = "-76.7496";
  const metadataURL =
    "https://api.weather.gov/points/" + latitude + "," + longitude;
  weatherService.getWeather(latitude, longitude).then((value) => {
    expect(value.errorMessage).toBe("error when calling metadataURL");
  });
  const req = httpTestingController.expectOne(metadataURL);
  expect(req.request.method).toEqual("GET");
  req.flush(Promise.reject());
});
```

If you notice here I’m supplying the URL and then capturing the request with the line:

```js
const req = httpTestingController.expectOne(metadataURL);
```

Then am making sure to populate the request with the line:

```js
req.flush(Promise.reject());
```

The flow of this test is also a little hard to understand since the steps are not ran synchronously. Basically because of the Javascript event loop, this test is setting up the environment for the test, and then the call to “getWeather” actually initiates the test. Since “getWeather” creates a Promise, the surrounding code will execute first so when “getWeather” is called all the values are set for the test to run.

## Catching Errors from Service Calls

Everyone has to do error handling at some point in their project. The problem is that sometimes, errors can be incorrectly handled or you have to create just the right condition for something to occur.

A good example of this test setup is the following:

```js
it("should return weatherDisplay when called", (done: DoneFn) => {
  const latitude = "37.6584";
  const longitude = "-77.6526";
  spyOn(weatherService, "getMetadata").and.returnValue(
    Promise.resolve(metadata)
  );
  spyOn(weatherService, "getRadarStations").and.returnValue(
    Promise.resolve(observationStations)
  );
  spyOn(weatherService, "getLatestObservations").and.returnValue(
    Promise.resolve(latestObservations)
  );
  spyOn(weatherService, "getDetailedForecast").and.returnValue(
    Promise.resolve(detailedForecast)
  );
  weatherService.getWeather(latitude, longitude).then((value) => {
    expect(value.latitude).toBe(latitude);
    expect(value.longitude).toBe(longitude);
    expect(value.radarStation).toBe(metadata["properties"]["radarStation"]);
    const city =
      metadata["properties"]["relativeLocation"]["properties"]["city"];
    const state =
      metadata["properties"]["relativeLocation"]["properties"]["state"];
    expect(value.currentLocation).toBe(city + ", " + state);
    expect(value.forecastURL).toBe(metadata["properties"]["forecast"]);
    expect(value.radarStationsURL).toBe(
      metadata["properties"]["observationStations"]
    );
    const closestStation = weatherService.getRadarStationClosest(
      observationStations["features"],
      latitude,
      longitude
    );
    expect(value.observationsURL).toBe(closestStation + "/observations/latest");
    const celsius = latestObservations["properties"]["temperature"]["value"];
    const farenheit = (celsius + 9 / 5 + 32).toFixed(0);
    expect(value.currentTemperature).toBe(String(farenheit));
    expect(value.icon).toBe(latestObservations["properties"]["icon"]);
    expect(value.forecast).toBe(detailedForecast["properties"]["periods"]);
    done();
  });
});
```

This test is using several “spyOn” calls with mock data and a “done()” to test for a successful call. The test is basically preventing any actual HTTP calls from happening since the mock data provided in the “spyOn” will be what is actually passed when the methods calling the NOAA endpoints are actually called. The nice part here is that its a “happy path” scenario and is basically just feeding what is expected to be received by the method.

Here is another test that uses the HttpTestingController:

```js
it("should catch error when metada call is not successful on getWeather call", () => {
  const latitude = "37.3069";
  const longitude = "-76.7496";
  const metadataURL =
    "https://api.weather.gov/points/" + latitude + "," + longitude;
  weatherService.getWeather(latitude, longitude).then((value) => {
    expect(value.errorMessage).toBe("error when calling metadataURL");
  });
  const req = httpTestingController.expectOne(metadataURL);
  expect(req.request.method).toEqual("GET");
  req.flush(Promise.reject());
});
```

The second test checks for error handling using the HttpTestingController that was mentioned before. It mocks a “Promise.reject()” response which throws an error an ultimately results in the “errorMessage” being captured within the method call.

## More Information

There is a lot of good documentation to show much more in depth discussion of how to use these test methods and libraries. Hopefully the information here got you started, and check out the official Angular documentation [here](https://angular.io/guide/testing).
