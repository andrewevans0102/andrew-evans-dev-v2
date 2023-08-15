---
title: Exception Handling with NgRx Effects
pubDate: 2019-03-04T14:01:22.000Z
snippet: "Recently I've been working with NgRx and learning about how to use the effects and the store.  I implemented NgRx in my weather app Goose Weather, and learned a great deal about both RxJs and s"
heroImage: /images/screen-shot-2019-03-04-at-9.02.19-am.png
tags: ["javascript"]
---

Recently I’ve been working with NgRx and learning about how to use the **effects** and the **store**. I implemented NgRx in my weather app [Goose Weather](https://github.com/andrewevans02/goose-weather), and learned a great deal about both RxJs and state management with Redux.

I also recently went through the Pluralsight course “[Angular NgRx: Getting Started](https://app.pluralsight.com/library/courses/angular-ngrx-getting-started/table-of-contents)” with Duncan Hunter and Deborah Kurata. This course gave a good introduction to the concepts behind NgRx, and highlights best practices. One of the big things that I learned from the course was proper ways to handle exceptions and handle errors with NgRx effects. I thought it was cool, and wanted to write about what I learned.

I’m going to walk through how I setup error handling with NgRx in Goose Weather. I’m first going to discuss handling errors with Observables, and then go into how I setup Goose Errors to handle errors in an effect.

With this walkthrough, I’m going to assume you’re already familiar with NgRx and Angular. If not, I recommend the NgRx Pluralsight course I mentioned as well as the documentation on the [RxJs](https://github.com/ReactiveX/rxjs) and [NgRx](https://ngrx.io/) sites.

## Exception Handling with Obervables vs. Promises

**Observables** are stream objects in Javascript. They must be handled with subscriptions and they emit values. This concept makes them very powerful because applications just connect to them and then listen for changes. This is very different than **Promises**, where you are guaranteed a result and handle them in a synchronous fashion. Promises always return some kind of value, and are run as a single event. Observables create a channel to listen for events, and will continue listening unless you destroy them or use one of the operators that automatically close the connections.

In the world of Promises you would typically handle errors with something like the following:

```js
getMetadata(lat: string, long: string): Promise<any> {
  const metadataURL: string = 'https://api.weather.gov/points/' + lat + ',' + long;
  return this.http.get(metadataURL).toPromise()
    .catch(() => new Error('error when calling metadataURL'));
}
```

This code is pretty straightforward. You make a call to something that generates a promise and then include a **catch** clause. This code is also cheating a little since it is wrapping an http client observable in a Promise. however, the use of catch is what I wanted to highlight here. If you wanted to use this method, you would listen for the response and handle it if it was an error like this:

```js
const metadata: any = await this.getMetadata(lat, long);
if (metadata instanceof Error) {
  throw metadata;
}
```

So here, note that if an error is thrown in the method, it is caught and then rethrown wherever it is called. This passes the error from the method into whatever is calling it.

When working with observables, you have to capture errors that are returned from the stream. The same idea of catching and rethrowing errors occurs, but it is handled with operators like **catchError** and **throwError** like you see here:

```js
getNoaaHourlyForecast(hourlyURL): Observable<any> {
  return this.http.get(hourlyURL)
    .pipe(
      catchError(() => throwError('error when retrieving hourly forecast'))
    );
}
```

When you use the **catchError** operator you are adding error handling to the observable itself. When an error occurs catchError will allow you to create a value to return to the stream that covers when an error occurs. Using **throwError** here creates an observable that is returned from this call that replaces the value that would have been returned on success.

Additionally, when you combine several observables with operators like **mergeMap** or **switchMap** you can handle rethrowing errors like this:

```js
getWeather(locationData: LocationData): Observable<any> {
  return this.getNoaaMetadata(locationData)
    .pipe(
      mergeMap( metadata => this.getNoaaWeeklyForecast(metadata.properties.forecast)
        .pipe(
            map((weeklyForecast) => {
              // metadata
              this.weatherData.currentConditions.latitude = locationData.latitude;
              this.weatherData.currentConditions.longitude = locationData.longitude;
              this.weatherData.currentConditions.city = metadata.properties.relativeLocation.properties.city;
              this.weatherData.currentConditions.state = metadata.properties.relativeLocation.properties.state;
              this.weatherData.NoaaWeeklyForecastUrl = metadata.properties.forecast;
              this.weatherData.NoaaHourlyForecastUrl = metadata.properties.forecastHourly;

              // weekly forecast
              this.weatherData.weeklyForecast = this.createWeeklyForecastFromNoaaData(weeklyForecast.properties.periods);

              return this.weatherData;
            }))
      ),
      catchError(err => {
        return throwError(err);
      })
    );
}
```

Here you see two service calls (1) **getNoaaMetadata** and (2) **getNoaaWeeklyForecast** being combined together for a single output. If an error is thrown in either one of these service calls the **catchError** will take the error that was thrown by the individual observables, and rethrow it back up to where it was called.

There are also multiple ways to handle errors with observables. I recommend reading through the Angular University article [here](https://blog.angular-university.io/rxjs-error-handling/) for a more in depth walk through.

## Handling Errors with NgRx Effects

Now that you have an idea of how observables handle errors, you can apply these same principles to error handling with NgRx.

My Goose Weather application only potentially has errors when it makes API calls for the weather forecast. When the user’s location is updated, an action is fired off to update the location information in the **store**. When the location information is updated, an effect fires off for the location action that calls the weather service that provides the weather forecast. This is where I applied my error handling with NgRx.

To start, the application makes a service call in an effect when the location is updated with a **LoadLocations** action like you see here:

```js
@Effect()
loadLocation$ = this.actions$
  .pipe(
    ofType<LoadLocations>(LocationActionTypes.LoadLocations),
    mergeMap((action) => this.weatherService.getWeather(action.payload.locationData)
    .pipe(
      map(weather => {
        return (new LoadWeather({weatherData: weather}));
      }),
      catchError((errorMessage) => of(new LocationsError({locationData: null, error: errorMessage})))
    ))
);
```

When an error happens, the **catchError** operator is used, and then **of** returns an observable with a **LocationsError** action to update the **store**.

This is defined in the Locations Actions with the following:

```js
export enum LocationActionTypes {
  LoadLocations = '[Location] Load Locations',
  LocationsError = '[Location] Locations Error'
}

export class LocationAction implements Action {
  type: string;
  payload: {
    locationData: LocationData,
    error: string
  };
}

export class LoadLocations implements Action {
  readonly type = LocationActionTypes.LoadLocations;

  constructor(readonly payload: {locationData: LocationData, error: null}) {

  }
}

export class LocationsError implements Action {
  readonly type = LocationActionTypes.LocationsError;

  constructor(readonly payload: {locationData: null, error: string}) {

  }
}
```

The successful **LoadLocations** action takes in a null value for **error**. The **LocationsError** action takes in a null value for **location** and a value for error.

I have a condition for the error action in my Location Reducer as you see here:

```js
export function locationReducer(
  state: LocationState = initialLocationState,
  action: LocationAction
): LocationState {
  switch (action.type) {
    case LocationActionTypes.LoadLocations:
      return {
        location: action.payload.locationData,
        error: null,
      };

    case LocationActionTypes.LocationsError:
      return {
        location: null,
        error: action.payload.error,
      };

    default:
      return state;
  }
}
```

When the action fires off of type **LocationsError** then the correct payload is returned to the store to indicate an error has occurred.

In order for components in Goose Weather to access the error data, I also created a selector for error here:

```js
export const selectError = (state: AppState) => state.location.error;
```

Finally, in order to show error messages to the user I subscribe to the error selector in the Goose Weather’s **weather component** with an observable like you see here:

```js
this.error$ = this.store.pipe(select(selectError));
```

Then I added an \*ngIf to the weather component’s template with the async pipe to respond if an error message is returned here:

```js
error {{ error }}
```

The final result is that when error’s occur they are shown as a message at the top of my application like you see here:

![](/images/screen-shot-2019-03-04-at-9.02.19-am.png)

If you run the application with the [Redux Devtools Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) then you also see the error value is correctly loaded into the store here as well:

![](/images/screen-shot-2019-03-04-at-9.02.35-am.png)

This process shows you the power of using NgRx, and how easy it is to implement error handling with your Angular applications. In a larger application, you could imagine multiple components subscribing and responding to error events from the **store**. The implementation I’ve gone over here also highlights how you can handle errors when you’ve got multiple observables in Angular services. I hope you enjoyed the walkthrough, and this post helps you to better understand exception handling with NgRx effects.

Special thanks also to [Tim Deschryver](https://twitter.com/tim_deschryver?lang=en) for his input on the correct ways to handle errors with effects!
