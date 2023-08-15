---
title: JavaScript to TypeScript the Mandalorian Way
pubDate: 2021-12-02T15:36:40.217Z
snippet: Recently I decided to upgrade my fansite mandalorianfan.com over to
  TypeScript. This was something my team at work wanted to do with our React
  project, so this was a fun way to learn how to do this.  In this post, I'm
  going to cover what I did (at a high level) and show
heroImage: /images/mandalorian_cockpit.png
tags: ["javascript"]
---

Recently I decided to upgrade my fansite [mandalorianfan.com](https://www.mandalorianfan.com) over to TypeScript. This was something my team at work wanted to do with our React project, so this was a fun way to learn how to do this.

In this post, I'm going to cover what I did (at a high level) and show some of the cool benefits I got from the upgrade. You can check out the finished product at my GitHub repo at https://github.com/andrewevans0102/mandalorianfan

## What is TypeScript

If you're new to web development, you'll probably have heard someone say TypeScript for a frontend project. TypeScript is basically a superset of JavaScript that includes types and makes your life as a developer easier.

One of the best parts of JavaScript is its ability to work with ambiguity. Meaning if you enter a string or an integer, depending on the order that the code is written it can be interpreted differently.

```js
const value = "11";
const value2 = 11;

// prints out 1111
const valueCombined = value + value2;
console.log(valueCombined);

// prints out 22
const valueNumber = 11;
const secondNumber = 11;
const numberCombined = valueNumber + secondNumber;
console.log(numberCombined);
```

In a similar fashion, if you want to add arguments to a function, you just put them there very minimally.

```js
// no types just put the values there and keep working
const printValues = (value1, value2) => {
  console.log(value1);
  console.log(value2);
};
```

This is great except that when your project gets large, it can be difficult to track down what objects are actually sent to functions. Further, if you use TypeScript most of the code editors that are used today pickup on intellisense in the form of types and documentation. This makes maintaining and building new features easier for your whole team.

TypeScript enforces types and also provides a lot of helpful features that really shine as your projects scale. In the next sections, I'm going to basically just walkthrough how I'm using TypeScript in my fan site. If you'd like to learn more, I highly recommend checking out the free tutorials on TypeScript by Microsoft on [YouTube at this link](https://www.youtube.com/playlist?list=PLWZJrkeLOrbbPWrzjR7DaiXYpk0Dk1c9M).

## First steps

My project was created with [create-react-app](https://create-react-app.dev/), so I started by looking [at their docs on how to upgrade to TypeScript](https://create-react-app.dev/docs/adding-typescript).

My first step was to install the typescript compiler and types for my project

```bash
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
```

Now the first step is to create a `tsconfig.json` file. This is what the TypeScript transpiler will use to lint your code.

Since we've already installed TypeScript in the project, we can directly run the [TypeScript cli](https://www.typescriptlang.org/docs/handbook/compiler-options.html#using-the-cli) and generate a `tsconfig.json` file with the following:

```bash
tsc --init
```

Now from here if you do nothing else, your project will work just fine. However, we want to use TypeScript! So the next step is actually using it in your files. To do this, its best to modify one file at a time. You start this by just changing the `.js` in your React project files to a `.ts` or `.tsx (if you have JSX). The only difference between`.ts`and`.tsx`is that the`.tsx` extension supports JSX.

Since my project is built with React and uses JSX, I also had to enable the JSX flag in my tsconfig file as follows:

```json
"jsx": 'preserve'
```

## Starting with the small components first

So to start with, I went ahead and started modifying the smaller components in my project's "components" directory. These were small and mainly presentational in nature, so the TypeScript issues I found were pretty basic. Example being the `Chapters.js` file. It takes in props to render the content on the Chapters page, TypeScript complained immediately that there was no type specified. So I created an `interface` that defined the type that I wanted to use.

So I changed:

```js
const Chapters = (props) => {
  return (
    <>
      {props.chapters &&
```

To be:

```js
interface Chapter {
  key: string;
  preview: string;
  full: string;
  link: string;
  showFull: boolean;
}

interface Chapters {
  chapters: Chapter[];
  showChapter: any;
}

const Chapters = (props: Chapters) => {
  return (
    <>
      {props.chapters &&
```

I know the prop type is defined local to this component, I'm going to refactor this later to have a centralized place for types.

I worked through the rest of the smaller components, by basically just doing the same process.

When I came to the `Header.js` file, I found an issue where TypeScript couldn't find the definition for the react router components. So to fix this, I just installed them in my project with:

```bash
npm i --save-dev @types/react-router-dom
```

My project also uses Google Analytics. To do this, it is accessing the `window` property. I found a [stackoverflow answer](https://stackoverflow.com/questions/56457935/typescript-error-property-x-does-not-exist-on-type-window/56458070) that showed where I had to create a type to account for the Google Analytics value I used.

```js
declare global {
  interface Window {
    GA_INITIALIZED: any;
  }
}

function InitializeReactGA(ReactGA: any) {
  if (!window.GA_INITIALIZED) {
    ReactGA.initialize("MANDO_GA");
    window.GA_INITIALIZED = true;
  }
}

export default InitializeReactGA;
```

## TypeScript with Redux

So the next big issue I ran across was that I was using Redux, and the TypeScript compiler didn't understand how to work with the `state` variables I was using.

I first installed the redux types with:

```bash
npm i --save-dev @types/react-redux
```

Then I went to [the React Redux page on TypeScript](https://react-redux.js.org/using-react-redux/usage-with-typescript) and followed the instructions they had there.

I created constants for root state and dispatch as well as definitions for useDispatch and useSelector. This enables me to avoid redundancy and enforces types wherever I work with Redux in the project.

```js
const { store } = configureStore(initialState);

// export redux values so TypeScript understands how to enforce the types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Wrapping Up

So after about 2 hours I had everything working. It was a pretty simple conversion. I got stuck when I was converting the Redux actions over because I tried to use types for the actions. What I found was that the types in that case ended up being a little more complicated than I wanted. My fan site is really simple so I didn't want to overcomplicate anything.

I also streamlined my custom types into a "constants" directory. This way all of the types I made for the props etc. were in one place and I just had to import them where I needed them.

The process of doing this was actually pretty fun. TypeScript is well documented. Whenever I had a syntax issue I was usually able to find it with stackoverflow.

I'm using VSCode for this project, and found that they [support JSDoc](https://code.visualstudio.com/docs/languages/typescript#_jsdoc-support). So this means you can add comments which will automatically appear when you hover over values you've imported.

![JSDoc](/images/jsdoc.png)

![Intellisense 1](/images/intellisense1.png)

I also thought it was cool that with Redux you can see a snapshot of what your initial store looks like. This is super helpful when doing quick reviews of code or fixing bugs.

![Redux Store](/images/intellisense2.png)

I hope you've enjoyed this post. Feel free to check out my Mandalorian fan site at[ mandalorianfan.com](https://www.mandalorianfan.com) and on GitHub at https://github.com/andrewevans0102/mandalorianfan

[cover photo was copied from here](https://www.themeparkprofessor.com/wp-content/uploads/2019/12/Screen-Shot-2019-12-27-at-5.49.53-AM.png)
