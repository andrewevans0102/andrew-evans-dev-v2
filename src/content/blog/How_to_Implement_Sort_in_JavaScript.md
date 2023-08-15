---
title: How to Implement Sort in JavaScript
pubDate: 2019-07-11T20:50:00.000Z
snippet: "Sometimes in Software Engineering you run across code that is so elegant that you have to write about it. I was recently working with a project that uses an array of values that needed to be sor"
heroImage: home.jpg
tags: ["javascript"]
---

Sometimes in Software Engineering you run across code that is so elegant that you have to write about it.

I was recently working with a project that uses an array of values that needed to be sorted by date. The array was read in from a Json file.

In JavaScript to sort an array you can just use the standard `array.sort` method. If you want to do custom sorting you could do something like the following:

```js
compare( a, b ) {
  // sort descending
  if ( a.score < b.score ) {
    return 1;
  }
  if ( a.score > b.score ) {
    return -1;
  }
  return 0;
}
```

The JavaScript sorting method takes advantage of the following relationship (credit [geeksforgeeks.com](https://www.geeksforgeeks.org/javascript-array-sort/) for this):

```js
compareFunction(a, b) < 0;
```

Then a comes before b in the answer.

```js
compareFunction(a, b) > 0;
```

Then b comes before a in the answer.

```js
compareFunction(a, b) = 0;
```

Then the order of a and b remains unchanged.

Here we come to the elegant part. So in the project I was working on, I needed to sort the array by date. Since all I need to be concerned with was a negative, postiive, or 0 value I could do the following:

```js
// sort by date here
posts.sort(function (a, b) {
  return new Date(b.pubDate) - new Date(a.pubDate);
});
```

So in the one line of code

```js
return new Date(b.pubDate) - new Date(a.pubDate);
```

I was able to sort the array by taking advantage of the built in JavaScript functionality. I have to credit this to [the stack overflow article I found here](https://stackoverflow.com/questions/10123953/sort-javascript-object-array-by-date).

So this post is rather short, but just wanted to mention it because I thought it was cool how such little code could accomplish so much.

Hope this helped or at least highlighted something cool you didn’t know before.
