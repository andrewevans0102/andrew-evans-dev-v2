---
title: How to get Started with React Redux
pubDate: 2020-10-15T23:49:00.625Z
snippet: Redux is one of the most popular patterns that is in use in the
  frontend world today. You see the same pattern in not only React, but Angular,
  and Vue as well. Redux is very powerful as it provides a routine way that you
  can manage state in your applications. Moreover, Redux scales very nicely as
  your projects get larger. So it works great for both small and enterprise
  applications.
heroImage: /images/mandalorian_cockpit.jpg
tags: ["react", "javascript"]
---

> The original cover image was copied from [here](https://www.cinemablend.com/television/2486422/the-only-star-wars-things-you-need-to-know-before-watching-the-mandalorian)

Redux is one of the most popular patterns that is in use in the frontend world today. You see the same pattern in not only React, but Angular and Vue as well. Redux is very powerful as it provides a routine way that you can manage state in your applications. Moreover, Redux scales as your projects get larger. So it works great for both small and enterprise applications.

This post is going to walkthrough how to use Redux in your React applications. I'm going to assume that you understand some basics about [React Hooks](https://reactjs.org/docs/hooks-intro.html) as I'm going to be using the `useState`, `useEffect`, `useSelector` and `useDispatch` hooks respectively.

I'm also going to be walking through a sample project that I've setup at [my GitHub repo here](https://www.github.com/andrewevans0102/intro-to-redux-lab2). We will be walking through different phases of the same project. I'm going to walk you through (1) setting up Redux, (2) adding actions and reducers, and (3) creating side effects.

As a Mandalorian fan myself, the sample project will be a mini fan site with pages for episode info, quotes, and more.

## Redux Concepts

So before we dive into using Redux, we should cover some vocabulary that we'll be using in the subsequent sections.

![](/images/screen-shot-2020-10-16-at-8.36.38-am.png)

> _image was copied from my article "How to Start Flying with Angular and NgRx" [here](https://indepth.dev/how-to-start-flying-with-angular-and-ngrx)_

Redux is a way to centrally organize your applications state in what's called a `store` (in the diagram that's the block in pink). The idea is that everything about your application will be stored there, and then you'll use `selectors` in your components to access this state. The store is `immutable` which means that it cannot change. When you "change" the store, you are actually generating a new version. This is a concept you see in functional programming, and sometimes can be hard for newer folks to understand. I highly recommend watching [Russ Olsen's talk on Functional Programming here for more on this concept](https://www.youtube.com/watch?v=0if71HOyVjY).

Your components fire what are called `actions` that then go through `reducers` to modify the values in the `store`. The idea behind reducers is that the state is `reduced` from an `action`. An `action` can be any event that your application does from initial loading of data to responding to a button click. The `reducers` in your application handle the changes to the store that result.

Your components also subscribe to `selectors` which basically listen for any type of state change. Whenever the store updates, the `selectors` receive the updates and allow you to render your components accordingly.

Some `actions` can generate "side effects" which are usually HTTP calls. This would be when you want to call an API to get values to put in the store. The flow there is that you would (1) fire an `action`, (2) call an API through an `effect`, and then return an `action` that goes through a `reducer` to modify the `store`.

I know that this is a lot of vocabulary to start, but it will make more sense as we begin to add Redux to our application.

## Starting Out

So if you [view my sample project](https://www.github.com/andrewevans0102/intro-to-redux-lab2), you'll find that it has the following folders:

1. `start`
2. `redux-setup`
3. `redux-actions`
4. `redux-http`

We're going to walkthrough the folders in the project in this order. We will begin in the `start` folder, as that's a version of the application with no Redux at all. Then the three other folders are completed phases of this project:

1. `redux-setup` is the `start` with redux added and an initial set of actions, reducers, selectors, and effects for the `episodes` page.
2. `redux-actions` is the `start` with the `episodes` and `quotes` actions, reducers, selectors, and effects setup.
3. Finally, `redux_http` includes a set of actions, reducers, selectors and an effect that makes an actual HTTP call.

When you're finished, you'll have a mini Mandalorian fan page that includes a page for episodes, quotes, a video of Season 2, and even a way to send a contact message.

## Initial Setup

We'll start by cloning the project, and then going into the `start` folder.

The initial project looks like this:

```bash
.
├── README.md
├── ReduxFlow.png
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── components
    │   ├── Header.js
    │   └── index.js
    ├── config
    │   ├── episodes.json
    │   └── quotes.json
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── pages
    │   ├── ContactPage.js
    │   ├── EpisodesPage.js
    │   ├── HomePage.jpg
    │   ├── HomePage.js
    │   ├── QuotesPage.js
    │   ├── Season2Page.js
    │   └── index.js
    ├── serviceWorker.js
    ├── setupTests.js
    └── styles
        ├── _contact.scss
        ├── _episodes.scss
        ├── _header.scss
        ├── _home.scss
        ├── _quotes.scss
        ├── _season2.scss
        └── styles.scss
```

The first step is to add Redux to your application and then install the necessary libraries. Go ahead and install the libraries with npm by doing the following:

```bash
npm i react-redux
npm i redux
npm i redux-devtools-extension
npm i redux-thunk
```

Now, I also recommend the [Redux DevTools extension for Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) as that will help you see what happens with your store. I recommend installing that at this phase as well.

So now with your libraries installed, let's go over to the `src/index.js` file to setup our `store`.

To add Redux to React, you first need to wrap your entry component with a `Provider` as you see here:

```js
// step 1 add these imports
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";

const initialState = {};
const { store } = configureStore(initialState);

ReactDOM.render(
  // step 2 wrap your app in the Provider here
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```

Now, you'll notice that we're referencing a `redux` folder that hasn't been created yet. You'll need to ahead and set that up so we can begin the `actions`, `reducers`, and eventually `effects` that we'll be using.

Go ahead and create a `src/redux` folder as this will be where we put our Redux implementation. Now create the `src/redux/configureStore.js` file as you see here:

```js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers/index";

const middleware = [thunk];
const enhancers = [];

// create enhancers to include middleware
// thunk allows you to dispatch functions between the actions
const composedEnhancers = composeWithDevTools(
  applyMiddleware(...middleware),
  ...enhancers,
);

// create the store and return it to the application onload
// note that here we are including our reducers to setup our store and interactions across the application
export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, composedEnhancers);

  return { store };
}
```

As the comments point out, we first use the `redux-devtools-extension` library to create `enhancers` that we will use with Redux. This is a common way to start building your store, but there are other methods and enhancers you can include.

Then we create the `configureStore` method by using the `createStore` to build a root reducer and an initial state with our enhancers. Also note that we are using the [redux thunk](https://github.com/reduxjs/redux-thunk) middleware so that we can return functions instead of just actions with our flows. There are a lot of options with middleware beyond thunk, but this is all we'll need for our application.

Once you've got `configureStore` all setup, let's go ahead and create our reducers folder in `src/redux`. Inside that folder create `src/redux/reducers/index.js` file with the following:

```js
import { combineReducers } from "redux";

export default combineReducers({});
```

Now we've got the basic shell setup, and we have basically an empty store with no initial state except for `{}`.

## Setting up the Actions

So with this basic shell, we now can go ahead and add actions. We're going to setup the `episodes` actions for the site.

Go ahead and create an `actions` and `actionTypes` folder in the `src/redux` folder that we created before.

Inside `actionTypes` folder create an `Episodes.js` file and copy and paste the following:

```js
export const GET_EPISODES = "episodes/GET_EPISODES";
export const SET_EPISODES = "episodes/SET_EPISODES";
export const EPISODES_ERROR = "episodes/EPISODES_ERROR";

export const initialEpisodesState = {
  episodes: [],
  errors: [],
};
```

I'm also using JavaScript modules, so add a `index.js` file next to it with:

```js
import * as EpisodesActionTypes from "./Episodes";

export { EpisodesActionTypes };
```

What is this doing? This is defining the action types we'll be using in our application. Notice that it is very simple and we have a `GET_EPISODES` and `SET_EPISODES` action along with an `EPISODES_ERROR` message. The `initialEpisodesState` is just defining what our store will look like when the application loads.

Next lets actually define the actions in a file `src/redux/actions/Episodes.js` file like so:

```js
import { EpisodesActionTypes } from "../actionTypes";
import episodes from "../../config/episodes";

export function getEpisodes() {
  return { type: EpisodesActionTypes.GET_EPISODES };
}

export function setEpisodes(episodes) {
  return { type: EpisodesActionTypes.SET_EPISODES, episodes };
}

export function episodesError() {
  return { type: EpisodesActionTypes.GET_EPISODES };
}

// here we introduce a side effect
// best practice is to have these alongside actions rather than an "effects" folder
export function retrieveEpisodes() {
  return function (dispatch) {
    // first call get about to clear values
    dispatch(getEpisodes());
    // return a dispatch of set while pulling in the about information (this is considered a "side effect")
    return dispatch(setEpisodes(episodes));
  };
}
```

I'm also using JavaScript modules, so add a `index.js` file next to it with:

```js
import * as EpisodesActions from "./Episodes";

export { EpisodesActions };
```

So as you see here, we're defining a `getEpisodes` function that corresponds to the `GET_EPISODES` action, a `setEpisodes` function that corresponds to the `SET_EPISODES` action, a `episodesError` that corresponds to the `EPISODES_ERROR` action, and finally a side effect to `retrieveEpisodes` which will pull them from a local configuration file.

There are differing opinions as to where to place side effects in React projects. From the documentation I found on [React Redux](https://react-redux.js.org/) I found it was recommended to place them alongside your actions. In practice, I've experienced that having the side effects near your actions makes it easy as a developer to find and maintain them. In a more general sense, since React is a library, you can organize your application as you see fit and put them wherever it best works for you.

So now that we've defined our action types and actions, let's add reducers that use those actions. Create a `src/redux/reducers/Episodes.js` file as you see here:

```js
import { EpisodesActionTypes } from "../actionTypes";

function Episodes(state = EpisodesActionTypes.initialEpisodesState, action) {
  switch (action.type) {
    case EpisodesActionTypes.GET_EPISODES:
      return Object.assign({}, state, {
        loading: true,
        episodes: [],
      });
    case EpisodesActionTypes.SET_EPISODES:
      return Object.assign({}, state, {
        ...state,
        loading: false,
        episodes: action.episodes,
      });
    case EpisodesActionTypes.EPISODES_ERROR:
      return Object.assign({}, state, {
        ...state,
        errors: [...state.errors, action.error],
      });
    default:
      return state;
  }
}

export default Episodes;
```

Since I'm using JavaScript modules, go ahead and modify the `index.js` file we had before to include the `Episodes.js` file as you see here:

```js
import { combineReducers } from "redux";
import Episodes from "./Episodes";

export default combineReducers({
  Episodes,
});
```

What is all of this doing? The reducers are keyed based on action type. If you notice, the value that is returned from the action is then applied to the necessary place in the state. So in the case of `SET_EPISODES` you'll note that it is taking the action payload and putting it into the `episodes` portion of the state as you see here:

```js
case EpisodesActionTypes.SET_EPISODES:
    return Object.assign({}, state, {
        ...state,
        loading: false,
        episodes: action.episodes,
    });
```

## Connecting Redux to Your Components

So now we have all the pieces together, but we still need to add Redux to our actual components. So let's modify the `src/pages/EpisodesPage.js` as you see here:

```js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EpisodesActions } from "../redux/actions";
import "../styles/styles.scss";
// import episodes from '../config/episodes';

// const episodes = [
//     { key: 'first', value: 'something here' },
//     { key: 'second', value: 'something there' },
// ];

function EpisodesPage(props) {
  const dispatch = useDispatch();

  // first read in the values from the store through a selector here
  const episodes = useSelector((state) => state.Episodes.episodes);

  useEffect(() => {
    dispatch(EpisodesActions.retrieveEpisodes());
  }, [dispatch]);

  return (
    <section className="episodes">
      <h1>Episodes</h1>
      {episodes !== null &&
        episodes.map((episodesItem) => (
          <article key={episodesItem.key}>
            <h2>
              <a href={episodesItem.link}>{episodesItem.key}</a>
            </h2>
            <p>{episodesItem.value}</p>
          </article>
        ))}
      <div className="episodes__source">
        <p>
          original content copied from
          <a href="https://www.vulture.com/tv/the-mandalorian/">here</a>
        </p>
      </div>
    </section>
  );
}

export default EpisodesPage;
```

As you'll note there are a few changes that make Redux possible. First note that we are pulling in the necessary hooks at the top with:

```js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EpisodesActions } from "../redux/actions";
```

Next you'll note that we commented out the pull of the episodes information locally and instead are retrieving it from a selector:

```js
// import episodes from '../config/episodes';

// const episodes = [
//     { key: 'first', value: 'something here' },
//     { key: 'second', value: 'something there' },
// ];

function EpisodesPage(props) {
    const dispatch = useDispatch();

    // first read in the values from the store through a selector here
    const episodes = useSelector((state) => state.Episodes.episodes);
```

Next you'll notice the use of `useEffect` which dispatches a `retrieveEpisodes` action as on load:

```js
useEffect(() => {
  dispatch(EpisodesActions.retrieveEpisodes());
}, [dispatch]);
```

So now, if you run the application, and then go to the Episodes page you should see it in action. If you open the Redux Devtools Extension you'll see the flow:

![](/images/screen-shot-2020-10-15-at-9.36.46-pm.png)

So what happened and how does this work?

1. On load, you initialized your store with an area for episodes
2. The `EpisodesPage` component has subscribed to the store to listen for any new state changes
3. When you click on the "Episodes" page the `retrieveEpisodes` action fired which then actually triggers a side effect to first call `GET_EPISODES` to clear the episodes in the store and then `SET_EPISODES` which retrieves them from the config file and returns them to the component
4. The `EpisodesPage` component receives the new store and renders the component

> _If your end result did not do the above flow, please check out the [redux-setup](https://www.github.com/andrewevans0102/intro-to-redux-lab2/tree/master/redux-setup) folder and see the end product there._

## Adding Quotes

So now that you've got the episodes covered, you can now add quotes. The process is very similar and you'll create:

- `src/redux/actions/Quotes.js`
- `src/redux/actionsTypes/Quotes.js`
- `src/redux/actions/reducers/Quotes.js`

Then in the `QuotesPage` component you'll setup the same `action --> effect --> action --> reducer` flow that we did before.

```js
const dispatch = useDispatch();

// first read in the values from the store through a selector here
const quotes = useSelector((state) => state.Quotes.quotes);

useEffect(() => {
  dispatch(QuotesActions.retrieveQuotes());
}, [dispatch]);
```

The `src/redux/actions/Quotes.js` looks like this:

```js
import { QuotesActionTypes } from "../actionTypes";
import quotes from "../../config/quotes";

export function getQuotes() {
  return { type: QuotesActionTypes.GET_QUOTES };
}

export function setQuotes(quotes) {
  return { type: QuotesActionTypes.SET_QUOTES, quotes };
}

export function quotesError() {
  return { type: QuotesActionTypes.GET_QUOTES };
}

// here we introduce a side effect
// best practice is to have these alongside actions rather than an "effects" folder
export function retrieveQuotes() {
  return function (dispatch) {
    // first call get quotes to clear values
    dispatch(getQuotes());
    // return a dispatch of set while pulling in the quotes information (this is considered a "side effect")
    return dispatch(setQuotes(quotes));
  };
}
```

The `src/redux/actionsTypes/Quotes.js` looks like this:

```js
export const GET_QUOTES = "quotes/GET_QUOTES";
export const SET_QUOTES = "quotes/SET_QUOTES";
export const QUOTES_ERROR = "quotes/QUOTES_ERROR";

export const initialQuotesState = {
  quotes: [],
  errors: [],
};
```

The `src/redux/actions/reducers/Quotes.js` looks like this:

```js
import { QuotesActionTypes } from "../actionTypes";

function QuotesReducer(state = QuotesActionTypes.initialQuotesState, action) {
  switch (action.type) {
    case QuotesActionTypes.GET_QUOTES:
      return Object.assign({}, state, {
        loading: true,
        quotes: [],
      });
    case QuotesActionTypes.SET_QUOTES:
      return Object.assign({}, state, {
        ...state,
        loading: false,
        quotes: action.quotes,
      });
    case QuotesActionTypes.QUOTES_ERROR:
      return Object.assign({}, state, {
        ...state,
        errors: [...state.errors, action.error],
      });
    default:
      return state;
  }
}

export default QuotesReducer;
```

When you connect it to the quotes page it looks like this:

```js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { QuotesActions } from "../redux/actions";
// import quotes from '../config/quotes';

// const quotes = ['first quote', 'second quote'];

function QuotesPage(props) {
  const dispatch = useDispatch();

  // first read in the values from the store through a selector here
  const quotes = useSelector((state) => state.Quotes.quotes);

  useEffect(() => {
    dispatch(QuotesActions.retrieveQuotes());
  }, [dispatch]);

  return (
    <section className="quotes">
      <h1>Quotes</h1>
      <ul>
        {quotes !== null &&
          quotes.map((quotesItem) => (
            <li key={quotesItem}>
              <q>{quotesItem}</q>
            </li>
          ))}
      </ul>
      <div className="quotes__source">
        <p>
          original content copied from
          <a href="https://www.magicalquote.com/best-mandalorian-quotes/">
            here
          </a>
        </p>
      </div>
    </section>
  );
}

export default QuotesPage;
```

Check out the folder [redux-actions](https://www.github.com/andrewevans0102/intro-to-redux-lab2/tree/master/redux-actions) for what the finished product looks like.

## Adding HTTP

So up until now the two flows that you've seen for `episodes` and `quotes` used local files and did not make any HTTP calls. One of the most common usecases you see with React Redux is to make HTTP calls to handle interactions with APIs.

If you go into the [redux-http](https://www.github.com/andrewevans0102/intro-to-redux-lab2/tree/master/redux-http) folder you'll see an example where we add HTTP calls for the "contact" page of the site.

The contact page actually adds messages to the [page here](https://intro-to-redux-lab.web.app). So when you've got this setup, you can see it in action by opening that page up alongside your local application.

When making HTTP calls with React Redux, the general best practice is to put the side effect alongside the actions. If you look in the `redux` folder you'll see Contact Actions, ActionTypes, and Reducers that are created.

A good convention to use with redux is to have an action that initializes the process, a second action that actually calls the process, and then a `success` and `failure` action to suit. You can see this here:

```js
// here we introduce a side effect
// best practice is to have these alongside actions rather than an "effects" folder
export function sendContact(contact) {
  return function (dispatch) {
    // first call sending contact to start the process
    dispatch(sendingContact(contact));
    // actually call the HTTP endpoint here with the value to send
    return axios
      .post(contactEndpoint, contact)
      .then((response) => {
        dispatch(contactSuccess(response));
      })
      .catch((error) => {
        dispatch(contactError(error));
      });
  };
}
```

If you notice the `sendContact` action is called, then it calls `sendingContact` and then it makes the HTTP call and responds with either a `contactSuccess` or `contactError` response.

Once you've built out the redux parts, you can connect it to your component like so:

```js
const dispatch = useDispatch();

// when you make the rest call, the response can be seen in the selector here
const response = useSelector((state) => state.Contact.response);

// when an error occurs it should appear here
const errors = useSelector((state) => state.Contact.errors);

const handleSubmit = (event) => {
  setProgress(true);
  event.preventDefault();
  const sendMessage = { firstName, lastName, message };
  dispatch(ContactActions.sendContact(sendMessage));
  // axios
  //     .post(messageEndpoint, sendMessage)
  //     .then((response) => {
  //         alert('success');
  //         setProgress(false);
  //     })
  //     .catch((error) => {
  //         alert('error');
  //         setProgress(false);
  //     });
};

useEffect(() => {
  if (response !== undefined) {
    setProgress(false);
  }

  if (errors.length > 0) {
    setProgress(false);
  }
}, [response, errors]);
```

Then in your template you can catch the response or errors with a check on the `selectors` as happens with the following:

```js
{
  response !== undefined && (
    <article className="contact__response">
      Success with a return of {response.status.toString()}
    </article>
  );
}
{
  errors.length > 0 && (
    <article className="contact__error">
      Error occured with message "{errors[0].message}"
    </article>
  );
}
```

This pattern scales well, and can be used throughout the HTTP calls in your components.

To do all of this you'll create the following:

- `src/redux/actions/Contact.js`
- `src/redux/actionsTypes/Contact.js`
- `src/redux/actions/reducers/Contact.js`

The `src/redux/actions/Contact.js` looks like this:

```js
import { ContactActionTypes } from "../actionTypes";
import axios from "axios";

const contactEndpoint =
  "https://us-central1-intro-to-redux-lab.cloudfunctions.net/app/message/send";

export function sendingContact(contact) {
  return { type: ContactActionTypes.SENDING_CONTACT, contact };
}

export function contactSuccess(response) {
  return { type: ContactActionTypes.CONTACT_SUCCESS, response };
}

export function contactError(error) {
  return { type: ContactActionTypes.CONTACT_ERROR, error };
}

// here we introduce a side effect
// best practice is to have these alongside actions rather than an "effects" folder
export function sendContact(contact) {
  return function (dispatch) {
    // first call sending contact to start the process
    dispatch(sendingContact(contact));
    // actually call the HTTP endpoint here with the value to send
    return axios
      .post(contactEndpoint, contact)
      .then((response) => {
        dispatch(contactSuccess(response));
      })
      .catch((error) => {
        dispatch(contactError(error));
      });
  };
}
```

The `src/redux/actionsTypes/Contact.js` looks like this:

```js
export const SENDING_CONTACT = "contact/SENDING_CONTACT";
export const CONTACT_SUCCESS = "contact/CONTACT_SUCCESS";
export const CONTACT_ERROR = "contact/CONTACT_ERROR";

export const initialContactState = {
  contact: {},
  errors: [],
};
```

The `src/redux/actions/reducers/Contact.js` looks like this:

```js
import { ContactActionTypes } from "../actionTypes";

function Contact(state = ContactActionTypes.initialContactState, action) {
  switch (action.type) {
    case ContactActionTypes.SENDING_CONTACT:
      return Object.assign({}, state, {
        contact: action.contact,
      });
    case ContactActionTypes.CONTACT_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        response: action.response,
      });
    case ContactActionTypes.CONTACT_ERROR:
      return Object.assign({}, state, {
        ...state,
        errors: [...state.errors, action.error],
      });
    default:
      return state;
  }
}

export default Contact;
```

When you add it to the Contact page it looks like this:

```js
import React, { useState, useEffect } from "react";
// import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { ContactActions } from "../redux/actions";
import "../styles/styles.scss";

const useStyles = makeStyles((theme) => ({
  circle: {
    margin: "48px auto",
    display: "block",
  },
}));

function ContactPage(props) {
  const dispatch = useDispatch();

  // when you make the rest call, the response can be seen in the selector here
  const response = useSelector((state) => state.Contact.response);

  // when an error occurs it should appear here
  const errors = useSelector((state) => state.Contact.errors);

  // when working on this part of the project
  // check out https://intro-to-redux-lab.web.app to view the messages you send
  const classes = useStyles();
  // const messageEndpoint =
  //     'https://us-central1-intro-to-redux-lab.cloudfunctions.net/app/message/send';
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(false);

  const handleFirstNameChange = (e) => {
    let value = e.target.value;
    setFirstName(value);
  };

  const handleLastNameChange = (e) => {
    let value = e.target.value;
    setLastName(value);
  };

  const handleMessageChange = (e) => {
    let value = e.target.value;
    setMessage(value);
  };

  const handleSubmit = (event) => {
    setProgress(true);
    event.preventDefault();
    const sendMessage = { firstName, lastName, message };
    dispatch(ContactActions.sendContact(sendMessage));
    // axios
    //     .post(messageEndpoint, sendMessage)
    //     .then((response) => {
    //         alert('success');
    //         setProgress(false);
    //     })
    //     .catch((error) => {
    //         alert('error');
    //         setProgress(false);
    //     });
  };

  useEffect(() => {
    if (response !== undefined) {
      setProgress(false);
    }

    if (errors.length > 0) {
      setProgress(false);
    }
  }, [response, errors]);

  return (
    <>
      {!progress && (
        <section className="contact">
          <h1>Contact</h1>
          <form onSubmit={handleSubmit}>
            <span>
              <label>First Name</label>
              <input
                type="text"
                id="fname"
                name="firstname"
                placeholder="Your name.."
                onChange={handleFirstNameChange}
              />
            </span>

            <span>
              <label>Last Name</label>
              <input
                type="text"
                id="lname"
                name="lastname"
                placeholder="Your last name.."
                onChange={handleLastNameChange}
              />
            </span>

            <span>
              <label>Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Write something.."
                onChange={handleMessageChange}
              ></textarea>
            </span>
            <button type="submit" className="contact__button">
              submit
            </button>
          </form>
          {response !== undefined && (
            <article className="contact__response">
              Success with a return of {response.status.toString()}
            </article>
          )}
          {errors.length > 0 && (
            <article className="contact__error">
              Error occured with message "{errors[0].message}"
            </article>
          )}
        </section>
      )}
      {progress && (
        <div>
          <CircularProgress className={classes.circle} />
        </div>
      )}
    </>
  );
}

export default ContactPage;
```

Check out the full implementation in the folder [redux-http](https://www.github.com/andrewevans0102/intro-to-redux-lab2/tree/master/redux-http) for what the finished product looks like.

## Closing Thoughts

So as you see with this project, once you understand the parts to Redux it's not hard to follow the pattern. In our project we setup episodes, quotes, and even a contact page that used Redux in the process.

As I stated in the intro, this pattern enables you to have a common method of handling your applications state as you build more features and move it through its lifecycle. I have personally found that this pattern makes maintenance much easier than manually handling application state through custom services and event interactions.

I hope that this post and my sample project helped you in your journey to learn more about Redux. I recommend playing with the example project I have here, and building out additional pages or features to learn the process.
