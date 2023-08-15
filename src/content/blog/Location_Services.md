---
title: Location Services
pubDate: 2018-11-13T03:11:56.000Z
snippet: "When HTML5 came out one of the coolest features that it offered was the use of location services. This was the point in time when you started to see the little pop up windows on site's asking &"
heroImage: home.jpg
tags: ["web development"]
---

When HTML5 came out one of the coolest features that it offered was the use of location services. This was the point in time when you started to see the little pop up windows on site’s asking “is it ok to share your location?”.

The HTML5 “Geolocation API” as it is more formerly called offers several different objects that you can query with some basic Javascript. This is really advantageous for developers because they can provide information specific to a users location for anything they’re doing.

I’m going to walk through the basic usage of the Geolocation API, and show you how you can not only get location but also track updates as a user moves around.

The “navigator.geolocation” object is the main way your code can interact with the service. The object has a lot of different options but the two that are most significant are (1) getting your literal location (latitude and longitude) and (2) tracking your location as you move.

## reading the current location

To get the literal location you first want to check to make sure that location is supported in the browser running your application. Some older browsers don’t support location services so you should handle that case.

```js
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    this.savePosition(position);
  });
} else {
  alert("Browser does not support location services");
}
```

If you notice in this snippet the call to “getCurrentPosition” is then being passed into a callback with a “position” object to the “savePosition()” method. This is common practice to handle the response in a callback, and basically just means you should work in some async handling for this service. The method only runs once, so once the callback is called then the only way to update the location is to call the method again, unless you use the “watchPosition” method that is explained next.

In the implemented method “savePostion()” shown here, the latitutde and longitutde are pulled fro the geolocation object as follows:

```js
savePosition(position) {
  this.lat = position.coords.latitude.toFixed(4).toString();
  this.long = position.coords.longitude.toFixed(4).toString();
}
```

## updating the location for movement

If you want to continually update a users position as they move around, its better to call the “watchPosition” method as shown here:

```js
function geo_success(position) {
  do_something(position.coords.latitude, position.coords.longitude);
}

function geo_error() {
  alert("Sorry, no position available.");
}

var geo_options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
};

var wpid = navigator.geolocation.watchPosition(
  geo_success,
  geo_error,
  geo_options,
);
```

As you can see, calling the “watchPosition()” method passes the result to a callback. The method signature is taking in a success method (geo_success), error method (geo_error), and options (geo_options). The method is continually called and allows your application to update as a user moves around.

There are more cool things you can do with location services, but this basically gets you started. For a more detailed walkthrough of the API please consult the Mozilla Docs here [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).
