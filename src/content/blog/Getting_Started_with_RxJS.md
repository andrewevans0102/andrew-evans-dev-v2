---
title: Getting Started with RxJS
pubDate: 2020-02-12T17:33:05.000Z
snippet: "If you're just starting or a seasoned JavaScript developer, chances are you've heard of RxJS.RxJS is one of the most popular JavaScript Libraries that exists today. This post is "
heroImage: /images/creek-21749_960_720.jpg
tags: ["angular", "javascript"]
---

If you’re just starting or a seasoned JavaScript developer, chances are you’ve heard of RxJS.

RxJS is one of the most popular JavaScript Libraries that exists today. This post is going to cover a basic walkthrough of what it is, and how you can use it in your applications.

## History

So before I begin, it helps to get a understanding of the history behind RxJS.

It all started with [Reactive Extensions](http://reactivex.io/) (or ReactiveX). ReactiveX was a concept that was originally invented by [Erik Meijer](<https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)>). It was an implementation of the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern). After it was developed, subsequent programming Libraries were developed around the major languages like .NET and JavaScript.

RxJS is the implementation of Reactive Extensions for JavaScript. The [RxJS project](https://github.com/ReactiveX/rxjs) was originally started by [Matthew Podwysocki](https://github.com/mattpodwysocki) and others as independent open source project. Starting around the time of RxJS version 5, [Ben Lesh](https://github.com/benlesh) and others improved the project to be more of what it is today.

The RxJS Library implements both the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) and the [Iterator Pattern](https://en.wikipedia.org/wiki/Iterator_pattern).

The RxJS library also uses [Functional Programming](https://en.wikipedia.org/wiki/Functional_programming) to implement operators and functions for managing sequences of events (streams). For a great intro to Functional Prgoramming I highly recommend watching Russ Olsen’s video at GOTO 2018.

## Imperative vs Declarative

When you hear people discuss RxJS, you commonly will hear them referring to **imperative** and **declarative** coding.

**Imperative** refers to code that you write in a specific way. This is code that you have manually piped the control flow similar to the way [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) work.

**Declarative** refers to using declared functions to perform actions. Here you rely upon “pure” functions that can define an event flow. With RxJS you see this in the form of [observables](https://rxjs.dev/guide/observable) and [operators](https://rxjs.dev/guide/operators).

These definitions will be more apparent to you later on in this post, but its good to introduce them here.

## Observables

When explaining RxJS it typically is easiest to do by showing code first.

Most people are typically familiar with a Promise implemented as follows:

```js
// imperative example
const doStuff = new Promise((resolve, reject) => {
  try {
    resolve("success");
  } catch (exception) {
    reject("error");
  }
});

doStuff.then((message) => {
  console.log(message);
});
```

Nothing super exciting here, just using the standard “resolve/reject” syntax. After the promise completes the output message is written to the console.

Now compare that to this:

```js
// declarative example
import { Observable } from "rxjs";

const firstObservable = new Observable((subscriber) => {
  subscriber.next("success");
  subscriber.complete();
});

firstObservable.subscribe({
  next(x) {
    console.log(x);
  },
  error(err) {
    console.error("error");
  },
  complete() {
    console.log("done");
  },
});
```

Woah! What’s that? Well that’s RxJS! If you notice, the declarative practice is being used as the observable is first defined, and then the different hooks in the observer are used with `next` , `error`, and `complete`.

I’m going to come back to this example later in this article, but just wanted to introduce it first.

## How does RxJS work?

So to start with RxJS, it helps to first have a few definitions:

- **Observable** = a defined stream of events
- **Subscription** = represents the actual **execution flow** of events (initiating a subscription basically “turns on” the execution)
- **Operators** = are “pure” functions that can invoke flows with subscriptions. These have different forms that can either create a stream or reproduce a stream in a pipeable flow.
- **Subject** = an event emitter that can be used for multicasting. These are special and used so that you can essentially inject emitters in your programs.
- **Schedulers** = these help with concurrency and are really a more advanced RxJS topic. I’m just including it here for completeness.

> For more info and examples please refer to the [official RxJS Getting Started Guide here](https://rxjs.dev/guide/overview).

So with that vocabulary introduced, now we can formally discuss the example I introduced earlier.

## Observables (again)

So lets go back to the code that I showed before:

```js
// declarative example
import { Observable } from "rxjs";

const firstObservable = new Observable((subscriber) => {
  subscriber.next("success");
  subscriber.complete();
});

firstObservable.subscribe({
  next(x) {
    console.log(x);
  },
  error(err) {
    console.error("error");
  },
  complete() {
    console.log("done");
  },
});
```

This is a great example because it shows you an implemented Observable.

If you notice first you define the Observable with `next` and `complete`. Then when I start the execution flow with the `subscribe` I include definitions for what to do with the execution flow:

- **next** = does a `console.log` of what is returned from the stream
- **error** = does a `console.log` if an error occurs in the stream
- **complete** = writes `done` to the console when execution is finished

This is one way to define an observable directly. Each observer has the three hooks of `next`, `error`, and `complete` that you can use to define execution behavior.

## Operators

Obserables are great, but RxJS also offers **operators** which make defining observables much easier.

With **operators** there are two types:

- **creation operators** = generated observables with predefined behavior
- **pipeable operators** = observables that return other observables using the syntax “.pipe”

Here’s a **creation operator** in action:

```js
// creation operator
// copied from rxjs.dev at https://rxjs.dev/api/index/function/of
import { of } from "rxjs";

of(10, 20, 30).subscribe(
  (next) => console.log("next:", next),
  (err) => console.log("error:", err),
  () => console.log("the end"),
);
// console outputs
// next: 10
// next: 20
// next: 30
// the end
```

Here we are using the `of` operator to emit values of `10`, `20`, and `30` in a sequence. This is super basic, but gives you an idea of how you could use this to emit a set of values in a stream without needing to manually define the observer hooks.

Here’s a **pipeable operator** in action:

```js
// pipeable operator
// copied from rxjs.dev at https://rxjs.dev/api/operators/mergeMap
import { of, interval } from "rxjs";
import { mergeMap, map } from "rxjs/operators";

const letters = of("a", "b", "c");
const result = letters.pipe(
  mergeMap((x) => interval(1000).pipe(map((i) => x + i))),
);
result.subscribe((x) => console.log(x));

// Results in the following:
// a0
// b0
// c0
// a1
// b1
// c1
// continues to list a,b,c with respective ascending integers
```

So here, its a little more complicated, but I think you can figure it out.

1.  We’re using the **creation operator** `of` that I referenced before to generate a stream of values `a`, `b`, `c`,
2.  Next we take the output from `of` into the **pipeable operator** `mergeMap`
3.  Then we’re letting `mergeMap` create a new observable and pipe it into `interval`
4.  Then `interval` takes the output and `console.log` each value after a 1 second delay

So basically this creates a flow with the `pipeable` operators. The original source observable is used to recreate a new observable with added logic.

An easier way to think of this is as a `stream` is being defined here. Each pipe that is used with the stream adds value.

A more literal way to think of **pipeable operators** is as water flows through a set of pipes. Each pipe adds value to the water until it exits the flow.

Visually you can see this flow in the following diagram:

![](/images/screen-shot-2020-02-12-at-12.31.32-pm.png)

> For a better visual of flows with RxJS, many people rely on Marble Diagrams. They’re a little daunting at first, but if you learn how to read them with the RxJS Guide they really help. I recommend checking out the [RxJS guide at the bottom of the operators page here](https://rxjs.dev/guide/operators).

## Subscriptions and Memory Leaks

So one big challenge that developers run into with RxJS is memory leaks with subscriptions.

Memory leaks are when you’ve forgotten to “unsubscribe” from a stream, and the process continues to run eating up your memory. Memory leaks can quickly eat up your browsers memory and slow down your application.

The best solution is to always make sure you have a `.unsubscribe` for your observables. You also can rely on prebuilt mechansims in frameworks like Angular’s `async` pipe.

Here’s some code that creates a memory leak:

```js
// incorrect
import { interval } from "rxjs";

const observable = interval(1000);
const subscription = observable.subscribe(() => console.log("Hello!"));
```

This code can easily be fixed by adding a `setTimeout` that unsubscribes from the stream after a set interval of time like so:

```js
// correct
import { interval } from "rxjs";

const observable = interval(1000);
const subscription = observable.subscribe(() => console.log("Hello!"));
setTimeout(() => {
  subscription.unsubscribe();
  console.log("unsubscribed");
}, 1000);
```

I actually contributed an article on the RxJS DEVTO blog on this topic [titled “Common Approaches to Handling Subscriptions” here](https://dev.to/rxjs/common-approaches-to-handling-subscriptions-1nk7). I highly recommend checking out my post when you have some time.

## Advanced Topics

So far we’ve just covered some basic execution flows. If you combine RxJS operators, you can define some pretty complicated work in just a small amount of code.

The challenge happens when you create a group of Observables from a single Observable. This is called a **Higher Order Observable**. RxJS has operators that help you with flattening these situations to include:

- [concatAll()](https://rxjs.dev/api/operators/concatAll)
- [mergeAll()](https://rxjs.dev/api/operators/mergeAll)
- [switchAll()](https://rxjs.dev/api/operators/switchAll)
- [exhaust()](https://rxjs.dev/api/operators/exhaust)

I’m not going to dive into a deep example of Higher Order Observables here because I think it goes beyond the scope of an introductory article. I do, however, highly recommend checking out the [RxJS Guide on operators that discusses this in more detail](https://rxjs.dev/guide/operators).

I also cover a more advanced topic in my [RxJS DEVTO blog site post “From Promises to Observables” here](https://dev.to/rxjs/from-promises-to-observables-4bdk). In that case I walkthrough setting up a `scan` operator to combine several HTTP calls.

I recommend reading posts on the [RxJS DEVTO blog site](https://dev.to/rxjs) for more advanced Observable cases and discussion as well.

## Further Reading

My discussion in this post has just covered the surface of what you can do with RxJS. There are also lots of great materials and videos available on line that provide in depth walkthroughs and examples.

I recommend checking out these videos as a good place to start:

- [GOTO 2018 – Functional Programming in 40 Minutes – Russ Olsen](https://youtu.be/0if71HOyVjY)
- [RealTalk JavaScript Episode 31: RxJS Wizardry with Ben Lesh](https://realtalkjavascript.simplecast.com/episodes/39f4a2e2-1fe70e46)
- [Ng-Cruise – RxJS By Example with Ben Lesh](https://www.youtube.com/watch?v=K7AvXUNB2X8&t=1292s)
- [Creating an Observable from Scratch (live-coding session) – Ben Lesh](https://www.youtube.com/watch?v=m40cF91F8_A)

## Closing Remarks

I hope this post has helped you with learning RxJS. In this post I walked through what RxJS is, and ways you can use it in your programs.
