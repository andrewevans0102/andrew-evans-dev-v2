---
title: Getting Started with Unstated Next
pubDate: 2022-05-12T12:27:44.442Z
snippet: I recently worked on a project that used Unstated Next and wanted to
  share some things I learned a long the way. As a long time Redux user, I
  thought Unstated Next was a really cool alternative that was easier and faster
  to use. In this post I'm going to cover how to get started and some things I
  learned a long the way.
heroImage: /images/img_0200.jpg
tags: ["react"]
---

[Unstated Next](https://github.com/jamiebuilds/unstated-next) is a Redux alternative for your React projects. It reduces boilerplate and is very similar to the [context api](https://reactjs.org/docs/context.html).

The main problem Unstated Next tries to solve is to allow you to have centralized state management within your React projects. If you're familiar with [React Hooks](https://reactjs.org/docs/hooks-intro.html) the syntax will be very familiar to you.

With Redux, you have to create a complex flow of actions, reducers, and effects. The advantages of this pattern is that it scales well, and provides uniformity to your applications. The disadvantage of this pattern is that it requires a bit of a learning curve for teams, and can become difficult to get started. Despite these things, I'm still a fan of Redux and I recommend checking out my post [How to get Started with React Redux](https://rhythmandbinary.com/post/2020-10-16-how-to-get-started-with-react-redux).

In the following sections I'm going to show you how Unstated Next works and a real example.

## How does Unstated Next work?

So other than doing the standard installation (`npm install --save unstated-next`) the next step is to create a shared function that you can pass into your application.

If you follow the example in the [GitHub repo](https://github.com/jamiebuilds/unstated-next) you can setup your `App.js` file as follows:

```ts
import React, { useState } from "react";
import { createContainer } from "unstated-next";
import { render } from "react-dom";

function useCounter(initialState = 0) {
  let [count, setCount] = useState(initialState);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);
  return { count, decrement, increment };
}

let Counter = createContainer(useCounter);

function CounterDisplay() {
  let counter = Counter.useContainer();
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}

function App() {
  return (
    <Counter.Provider>
      <CounterDisplay />
      <Counter.Provider initialState={2}>
        <div>
          <div>
            <CounterDisplay />
          </div>
        </div>
      </Counter.Provider>
    </Counter.Provider>
  );
}

render(<App />, document.getElementById("root"));
```

> the example here was copied from the [GitHub repo](https://github.com/jamiebuilds/unstated-next)

First you'll notice the creation of a shared function that includes the `useState` hook:

```ts
function useCounter(initialState = 0) {
  let [count, setCount] = useState(initialState);
  let decrement = () => setCount(count - 1);
  let increment = () => setCount(count + 1);
  return { count, decrement, increment };
}
```

Next, you'll notice that you initialize it with:

```ts
let Counter = createContainer(useCounter);
```

Then in your component you create an instance of this container `useContainer()`:

```ts
function CounterDisplay() {
  let counter = Counter.useContainer();
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  );
}
```

Finally, you wrap your components with the context `Provider` so that all of this can be wired up and you can access the container in your child components:

```ts
function App() {
  return (
    <Counter.Provider>
      <CounterDisplay />
      <Counter.Provider initialState={2}>
        <div>
          <div>
            <CounterDisplay />
          </div>
        </div>
      </Counter.Provider>
    </Counter.Provider>
  );
}
```

This centralized function that you initially setup can then act similar to the way Redux `Store` does without all of the boilerplate. Next, I'll show an example of how I used it in a project.

## Unstated Next in action

I have an application that uses [AWS Amplify](https://sandbox.amplifyapp.com/getting-started) for hosting and auth.

Prior to this, I would use the token returned by the AWS Amplify's `Auth` object when making API calls. This can be done like the following:

```ts
import { Auth } from "aws-amplify";

const getToken = async () => {
  const token = (await Auth.currentSession()).getIdToken().getJwtToken();

  return token;
};
```

Whenever my app would do an API call, it would call this function to retrieve the token. This is fine, but doesn't scale well since in each component I was doing the same function call.

Enter Unstated next.

So my api calls would look like this:

```ts
const token = await getToken();
const axiosCall = await axios.get(someAPI, {
  headers: {
    Authorization: token,
  },
});
```

These were spread throughout the application in multiple places. This is ok, but it'd be great if we could share this information across the components.

So I went into my app's `App.js` file and created a shared function like follows:

```ts
/**
 * Retrieves the token from the logged in user for API calls
 * @returns
 */
export const useShared = () => {
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [pageError, setPageError] = useState("");
  const loadAuth = async () => {
    if (token === "") {
      try {
        const retrievedToken = await getToken();
        setToken(retrievedToken);
      } catch (error: any) {
        setTokenError(error);
      }
    }
  };
  return { token, tokenError, loadAuth, pageError, setPageError };
};

const PageContainer = createContainer(useShared);
```

If you notice here, the shared function has a value for the token, but also an error message for pages and the tokens. This is nice because then in the app i can have a container that listens for changes to the error object and displays them uniformly.

Now I just pass the container to the component in my `App.js` render call with:

```ts
<SomePage pageContainer={pageContainer} />
```

Then in the component I pull in the value:

```ts
function SomePage(props: PageProps) {
    const { pageContainer } = props;
    const pageShared: ContainerProps = pageContainer.useContainer();
```

In order to force the app to retrieve the token on load, I added a `useEffect` to the Header element like so:

```ts
useEffect(() => {
  pageShared.loadAuth();
}, []);
```

Now in the other components, when I want to make API calls I can access the token directly from the shared state:

```ts
// clear out error message when making api call
pageShared.setPageError("");
const axiosCall = await axios.get(someAPI, {
  headers: {
    Authorization: pageShared.token,
  },
});
```

Notice also that I'm clearing the `pageError` value. I added an error component to my apps Header that looks like the following:

```html
<header className="header">
  {pageShared.tokenError !== '' && (
  <p>
    Token Error has occured{' '}
    {JSON.stringify(pageShared?.tokenError?.message)}
    {JSON.stringify(pageShared?.tokenError)}
  </p>
  )} {pageShared.pageError !== '' && (
  <p>Page Error has occured{' '} {JSON.stringify(pageShared?.pageError)}</p>
  )}
  <button onClick="{signOut}">Sign out</button>
</header>
```

The cool part about all of this is that, this just handles tokens and errors. If I had additional information I wanted to share across the app, I could just modify the shared function and add some state values.

## Wrapping Up

In this post I just lightly touched on using Unstated Next in projects. I highly recommend you check out the [GitHub repo](https://github.com/jamiebuilds/unstated-next) and README for more information and examples. This is a really cool alternative to Redux and is easy to get started with.
