---
title: Making NodeJS Functions Sleep
pubDate: 2021-02-10T15:41:30.609Z
snippet: "When learning JavaScript for the first time, one of the biggest
  challenges is understanding the event loop. Unlike many other languages,
  JavaScript operates "
heroImage: /images/cover.png
tags: ["javascript"]
---

When learning JavaScript for the first time, one of the biggest challenges is understanding the event loop. Unlike many other languages, JavaScript operates inside a hosted environment which determines how the code is actually ran. This means that things like scope and order can make or break JavaScript programs. It makes it harder when you want to streamline processing to force control on things like threads or API calls.

One common approach to handling things like this is using `async await`. Which forces things that are async (like promises) to complete before getting a payload and making calls. I actually cover a basic walkthrough of this in my post [Optimizing Angular with Async Await](https://rhythmandbinary.com/post/Optimizing_Angular_with_Async_Await).

Recently, I was working on an NodeJS API that calls a set of endpoints to provide a weather forecast. I'm using some of the NOAA Endpoints that you can see [here](https://www.weather.gov/documentation/services-web-api).

The issue I had was that one of the API calls would intermittently fail. What I noticed in testing was that if it failed, but I waited a few seconds and tried again, it worked. This was pretty frustrating because it would happen at different points in the day. My assumption was this was based on load etc. on the NOAA APIs. Regardless, I needed to build in some mechanism to handle this behavior. Otherwise, it would force my API to fail as a result.

So to do this I built a custom "sleep" function. There are several ways to do this (and npm packages as well). I liked my function because it was very simple and I understood what it was doing end to end.

In this post I'm just going to show what I did, and how you can use this in your programs.

## Lets start with the code

So to start off with I originally had an API call that looked like this:

```js
const NOAAWeeklyForecast = await axios.get(endpoint);
if (NOAAWeeklyForecast === undefined) {
  throw new Error("error when calling NOAA API for weekly forecast");
}
```

I'm using [axios](https://www.npmjs.com/package/axios) to handle my AJAX calls here.

This was pretty simple, except (as i stated earlier) if an error happened, the rest of my endpoint would fail.

So to do this, I first created a "sleep" method that looks like this:

```js
// wrap settimeout in a promise to create a wait
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
```

As the comment suggests, it wraps setTimeout with a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and using [setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) to delay activity. So if you call this with `async await` then it will pause or "sleep" any function that calls it.

I refactored my original axios call to have its own method and it looks like this:

```js
const callNOAA = async (endpoint) => {
  let attempts = 5;
  let response = undefined;
  while (attempts > 0) {
    try {
      response = await axios.get(endpoint);
      break;
    } catch (error) {
      console.log(
        `error occured with message ${error} and attempts ${attempts.toString()}`,
      );
      attempts = attempts - 1;
      console.log("waiting 5 seconds and then am going to try again");
      // wait 5 seconds before running again
      await sleep(5000);
    }
  }
  return response;
};
```

If you notice it calls my `sleep` function, and basically retries the HTTP call in 5 second intervals. Each time keeping track of a number of attempts. If it fails after 5 attempts, then it throws an exception (which can be handled by any function that calls this).

## Axios Interceptors

So after adding this, I've been watching my APIs performance for some time. This basically resolved the intermittent failures that I saw originally.

I could have just as easily used something like [axios-retry](https://www.npmjs.com/package/axios-retry) or several other packages that do something similar. However, I liked this implementation because it used some core JavaScript concepts and there was no "black box" that you often get with packages.

Another thing that I wanted to mention was that if you're using axios then there are also things called `interceptors`. They can be utilized with this kind of behavior, but also can be a great way to track HTTP calls in your NodeJS APIs.

I used axios `request` and `response` interceptors like you see here:

```js
// request interceptor
axios.interceptors.request.use(
  function (config) {
    console.log(`request sent with config ${JSON.stringify(config)}`);
    return config;
  },
  function (error) {
    console.log(`request sent with error ${error}`);
    return Promise.reject(error);
  },
);

// response interceptor
axios.interceptors.response.use(
  function (response) {
    console.log(`response sent with return of ${response.status}`);
    return response;
  },
  function (error) {
    console.log(`response sent with ${error}`);
    return Promise.reject(error);
  },
);
```

If you'd like to learn more about axios interceptors, please check out their [GitHub repo](https://github.com/axios/axios#interceptors).

## Closing Thoughts

I hope you enjoyed this post and also learned about a way to make your NodeJS functions sleep. I did quite a bit of googling leading up to this and found that there is a lot of documentation on this method as well as others to make your NodeJS functions sleep.
