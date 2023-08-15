---
title: My First Work with Storybook….and Introducing Chessie and Rey!
pubDate: 2019-03-08T04:23:40.000Z
snippet: "This week, I went to an RVAJS meetup in Richmond and learned about Storybook. At the event, software consultant Joe Fehrman gave a really nice presentation that outlined the use cases and how to"
heroImage: /images/andrew-rey.jpg
tags: ["javascript", "testing"]
---

This week, I went to an [RVAJS meetup in Richmond](https://www.meetup.com/rva-js/events/jrgfhpyzfbhb/) and learned about [Storybook](https://storybook.js.org/). At the event, software consultant [Joe Fehrman](https://github.com/jfehrman) gave a really nice presentation that outlined the use cases and how to get started with Storybook.

What is Storybook? It’s a development framework that enables you to build your frontend components by themselves. This is really powerful because it solves the challenge of refining components within large projects. Often times, engineers are faced with the challenge of being able to build and test components in a complex architecture. In this situation, engineers are often unable to pull out individual components to refine them or fix an production issue. Storybook serves to solve this challenge, as engineers are able to pull out individual components independent of the larger project. Storybook enables the engineer to be able to work with a component without having to deal with side effects you usually see with nested architectures etc. This all results in development that consists of smaller pieces of work, and also helps build reusable code.

After learning about Storybook, I wanted to try it out for myself with both Angular and React. I decided to build out two small applications, and use Storybook to test the components.

To make this more fun, I also decided to name my two example projects after my two cats, Chestnut (Chessie) and Rey (often referred to as ReyRey). The deal was my wife and I each got to name one of our cats. My wife named Chestnut for Christmas (“Chestnuts roasting on an open fire…”, we also adopted them during Christmas). While I named Rey after [the popular heroine from the new Star Wars movies](<https://en.wikipedia.org/wiki/Rey_(Star_Wars)>). They haven’t been on any of my blog posts yet, and I figured it was about time to introduce them to the world.

Here’s a picture of them together (I think I can hear you saying “awwww”)

![](/images/cr-cuddling.jpg)

In case you needed clarification: Chessie left, Rey right

In the following sections, I’m going to walkthrough using Storybook with an Angular App called “Chessie” and a React App called “Reyrey.” Source code is available on [GitHub here](https://github.com/andrewevans02/storybook-post) Once you clone it, use the branch **before-storybook** if you want to follow along with my examples here.

In my walkthrough here, I’m only going to touch the surface of the capabilities of Storybook. I encourage you to review the Storybook site and do some googling to see some awesome use cases for your projects.

## How Storybook works

Storybook operates as a local service outside of your application. It basically renders components you pass to it in a way that you immediately see them in action. Storybook also does live reloading, so you can edit it in place just like you would with any Angular or React app running locally on your machine.

There is a pretty wide array of ways to setup Storybook. The easiest way is to just use the CLI they provide. In both of my walkthroughs I’m going to be using the CLI for all the setup and installation. If you have a more complex framework or your project has a lot of customization, I recommend looking at the guides on the storybook site for help.

Both of the apps I’m showing only have a simple button. When you click the button it displays a message. These overly simplified examples give you an idea of how Storybook could be used in a much larger project. My discussion here doesn’t really go into a lot of the broader details, but as I said in the intro I recommend reviewing Storybook’s documentation for more.

## Storybook Angular (Chessie Project)

The walkthrough here will follow the [Angular Guide](https://storybook.js.org/docs/basics/guide-angular/).

First do a **git clone** of my [sample project](https://github.com/andrewevans02/storybook-post) and then go into the “Chessie” directory.

Do the initial Storybook CLI install with the following:

```bash
npx -p @storybook/cli sb init
```

Next, do an install of the babel and storybook libraries with:

```bash
npm i --save-dev @storybook/angular @babel/core babel-loader
```

When the install finishes, add the following NPM script to your **package.json** file:

```json
{
  "scripts": {
    "storybook": "start-storybook -p 9001 -c .storybook"
  }
}
```

When you do the initial installs, a “storybook” script is automatically added. You can delete that script and use this one.

The guide also tells you to create a “config.js” and add a custom “tsconfig” file, but I found the initial installation scripts already do that for you, so I ignored those steps. However, it does help to look at those files to see where the stories are pulling their configuration from.

With the installs done, go ahead and run Storybook with the following:

```bash
npm run storybook
```

As I mentioned, Storybook allows for live reloading, so you can leave this running and it will automatically render what you change in the browser.

Now, if you open up the file at “/src/stories/index.stories.ts” you’ll find the place that you can write stories for your components. There’s already a set of example stories there that have pretty straightforward code. The basic setup is very similar to Angular **spec** files for unit tests. You basically just identify the component you want to bring in and any decorators or actions like **Input** or **Output**.

Here’s one of the generated examples:

```js
storiesOf("Welcome", module).add("to Storybook", () => ({
  component: Welcome,
  props: {},
}));
```

Here the component **Welcome** is being brought into a story. There is a place for properties, and these are applied to any of your components decorators. You can also add actions, so when a user clicks that story an action is fired off.

For the component that I used in my sample application, I took out the generated code and added the following for my AppComponent:

```js
storiesOf("AppComponent", module).add("to Storybook", () => ({
  component: AppComponent,
  props: {},
}));
```

This displayed the initial component that I had created:

![](/images/screen-shot-2019-03-07-at-10.14.38-pm.png)

![](/images/screen-shot-2019-03-07-at-10.14.44-pm-1.png)

This was nice but I wanted to use some of the decorators that I saw in the example code. So I used the Angular CLI and generated a second component called **Chessie** with:

```bash
ng g c Chessie
```

Then in the “chessie.component.ts” file I added an **input** decorator with a **sound** field:

```js
@Input()
sound: String;

constructor() { }

ngOnInit() {
}
```

I next used data binding in the template to show the sound value:

```html
<p>chessie works!</p>
<p>chessie sound {{sound}}</p>
```

Then I went back to my story file and created a story with this new component to see what it would look like:

```js
storiesOf("Chessie", module).add("to Storybook", () => ({
  component: ChessieComponent,
  props: {
    sound: "Purrrrrrr",
  },
}));
```

When the story is generated it takes in the “Purrrrrrr” value, and displays on the template like you would if it was part of the overall project:

![](/images/screen-shot-2019-03-07-at-10.20.08-pm.png)

So this little example shows how we were able to quickly add a new component and see what it would look like with Angular. We were able to show the **Chessie** component without needing to run the app itself. **This is why storybook is so powerful.** Being able to quickly build and test individual components enables you to take a big project and work it out in small pieces.

## Storybook React (ReyRey Project)

I’m following the [React Guide](https://storybook.js.org/docs/basics/guide-react/) for this walkthrough.

First, do a **git clone** of my [sample project](https://github.com/andrewevans02/storybook-post) (if you haven’t already), and then go into the “Reyrey” folder and install the storybook CLI with the following:

```bash
npx -p @storybook/cli sb init
```

Next install storybook react with the following:

```bash
npm i --save-dev @storybook/react
```

Next make sure to install the remaining dependences for react:

```bash
npm i --save react react-dom
npm i --save-dev @babel/core
npm i --save-dev babel-loader
```

Just like in the Angular Guide, the instructions say to create a “config.js” file. The installation scripts created this for me so I ignored that step.

If you go over to the “src/stories/index.js” file, you’ll see where you write the stories for your components. Just like in the Angular Guide, the initial install created some samples for you to review.

A lot of this code is self explanatory, and includes the basic setup to include adding properties and actions just like the Angular Guide. I’m just going to show you how you can work with the component I have in my sample application.

To work with the Reyrey component in the sample React app, you just have to add the following to the stories file:

```js
storiesOf("Reyrey", module).add("to Storybook", () => <Reyrey />);
```

When you add those values then Storybook picks up the component and displays it like so:

![](/images/screen-shot-2019-03-07-at-10.39.02-pm.png)

![](/images/screen-shot-2019-03-07-at-10.39.11-pm-1.png)

## Wrapping Up

Storybook is a pretty powerful tool for developing web applications. It enables you to do your development by component instead of having to build out all the dependencies as you progress. This ability to develop smaller sections of code in a more refined way **makes your code better**. Additionally, it should be noted that Storybook can be used with other frameworks for testing. I recommend reviewing the [Storybook Test documentation here](https://storybook.js.org/docs/testing/react-ui-testing/) for more information. There are a lot of cool ways you can use Storybook in any project, and I hope this post helped you get started.

Here’s some more ultra cute pictures to finish on a good note:

![](/images/img_0562-collage.jpg)
