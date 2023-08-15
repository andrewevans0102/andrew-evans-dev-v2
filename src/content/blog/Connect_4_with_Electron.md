---
title: Connect 4 with Electron
pubDate: 2019-12-06T21:53:42.000Z
snippet: "Over the past few weeks I've been learning about ElectronJS (also known just as Electron), and wanted to write about my experiences and applications I built.  In the process o"
heroImage: /images/connect4.jpg
tags: ["electron", "javascript"]
---

Over the past few weeks I’ve been learning about ElectronJS (also known just as “Electron”), and wanted to write about my experiences and applications I built. In the process of learning, I built both an Angular and an Electron version of the classic game “Connect 4.”

The projects can be found at the following links:

- [Angular App](https://github.com/andrewevans0102/connect4-angular)
- [Electron App](https://github.com/andrewevans0102/connect4-electron)

I wrote both an Angular and an Electron version so that I could compare the two frameworks, and learn a little more about the underlying tooling in the process.

This post is going to cover some background about Electron, and walkthrough building a “Connect 4” game with it. I’m also going to do a brief discussion of Electron and Angular build implementations.

You can view a hosted version of [the Angular version here](https://connect4-angular.firebaseapp.com/home-page), or watch a video of the Electron version in action:

[![](https://img.youtube.com/vi/kqp3useWRz0/0.jpg)](https://www.youtube.com/watch?v=kqp3useWRz0)

## What is Electron?

![](/images/screen-shot-2019-12-07-at-9.07.03-am.png)

[Electron](https://electronjs.org/) is a framework that enables you to build Desktop applications with JavaScript.

Originally developed by GitHub, Electron uses [Chromium](https://www.chromium.org/) and [Node.js](https://nodejs.org/en/) to build and package applications for desktop platforms. I was really impressed that a lot of applications that I already use are actually written with Electron! This includes [VSCode](https://code.visualstudio.com/) and [Atom.io](https://atom.io/)!

Electron has really great documentation, and is an unopinionated framework. This means that you have the flexibility to build your Electron apps the way you want to (beyond some basic structure I’ll cover in the next section). Additionally, since Electron is JavaScript, it is not that difficult to convert frontend applications over to Electron. As part of my learning, I actually did this with an Angular application (more on this later).

To help with building Electron applications there are several CLI and boilerplate projects available. The [quick-start](https://github.com/electron/electron-quick-start) app is a great place to start as you can can modify it easily to get up and running.

I also really liked working with [electron-builder](https://www.electron.build/) to build and package my application. If you do some googling, you’ll find that there are also several other tools including [electron-packager](https://github.com/electron/electron-packager) that are good as well .

Finally, I also wanted to point out that if your team is already familiar with frontend technologies like JavaScript, CSS, and HTML then using electron is super intuitive. A lot of the skills web developers use everyday can be leveraged with Electron. You can even utilize bundling platforms like [webpack](https://webpack.js.org/) to do even more cool things with your Electron applications.

## How are Electron Applications structured?

So borrowing from the [official docs](https://electronjs.org/docs/tutorial/first-app#electron-development-in-a-nutshell), your application really only consists of the following:

```bash
your-app/
├── package.json
├── main.js
└── index.html
```

- The `package.json` file obviously manages your projects dependencies, but also defines the main entry point of your application and (optionally) a build configuration.
- The `main.js` file is where you define the application window behavior including size, toolbar menus, closing, icons, and a lot more.
- The `index.html` page is the main presentation or “view” of your application. You can also pull in additional JavaScript libraries like you would with any other project.

From this basic setup, you can see how you could build out more complex applications. This setup is the bare minimum, and using basic HTML, CSS, and JavaScript you could build much bigger things with these building blocks.

You also obviously will need [electron installed](https://www.npmjs.com/package/electron) as a dependency or globally on your system to do builds etc. This can be installed easily with just a `npm i electron` .

In addition to your dependencies, the `package.json` file will need to minimally have the following (again copied and pasted from the docs):

```json
{
  "name": "your-app",
  "version": "0.1.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  }
}
```

Notice the “main” entry in the file, this identifies the location of your `main.js` file. This is fairly similar to the way that [ExpressJS](http://expressjs.com/) does this with an `index.js` file.

> Also note if you’re using [electron-builder](https://www.electron.build/) you’ll want to define a `build` configuration. You can avoid this by just using their CLI, either way the [docs here will get you started](https://www.electron.build/#quick-setup-guide).

In the `main.js` file (again copying from the docs), you typically would have a setup that looks like this:

```js
const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Open the DevTools.
  win.webContents.openDevTools();

  // and load the index.html of the app.
  win.loadFile("index.html");
}

app.on("ready", createWindow);
```

What’s this code doing? Well first, you basically instantiate the application, and then its defining window behaviors. The `createWindow` method defines what the actual application will do as handled by the OS. Notice that you have to define how the window is closed, and that you need to load the `index.html` file.

Notice also this small section:

```js
// Open the DevTools.
win.webContents.openDevTools();
```

Is that the same [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) that we know and love? Why yes it is! Since Electron leverages the same internals that Chrome does for web applications, you can actually run DevTools and debug your Electron application the same way you would a web app with Chrome.

Additionally, this basic setup in the `main.js` file can be tuned for processes for Mac, Windows, and Linux platforms. An example being on Mac you normally would “quit” an application instead of just closing the window.

To complete your Electron app, you’d have a corresponding `index.html` file that looks like the following:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World!</title>
    <!-- https://electronjs.org/docs/tutorial/security#csp-meta-tag -->
    <meta
      http-equiv="Content-Security-Policy"
      content="script-src 'self' 'unsafe-inline';"
    />
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using node
    <script>
      document.write(process.versions.node);
    </script>
    , Chrome
    <script>
      document.write(process.versions.chrome);
    </script>
    , and Electron
    <script>
      document.write(process.versions.electron);
    </script>
    .
  </body>
</html>
```

Notice that its just straight html. This is just like the old days when you had to manually build pages before frameworks like Angular or React. However, this is also super simple and you can imagine injecting custom components and other behaviors directly into your `index.html` page. If you’re familiar with the standard output from builders like [webpack](https://webpack.js.org/), then you can also see how easy it would be to reference the bundles and convert a frontend application to Electron.

I also left out things like the `renderer.js` file and the `preload.js` file which you typically will see in applications. These aren’t required to get started, but you see them in a lot of projects and can learn more about these options with the [docs here](https://electronjs.org/docs/api/browser-window#class-browserwindow).

The makers of Electron also have several nice examples you can [review here as well](https://github.com/electron/simple-samples).

Once you’ve got these basic files setup, you can start your application with `electron .` at the root directory of your project. For more on this, check out the [getting started docs here](https://electronjs.org/docs/tutorial/first-app#running-your-app).

## How are Electron Apps Packaged?

As I mentioned in the previous section, once you’ve got your application up and running you can bundle your application with several different tools and utilities.

I found [electron-builder](https://www.electron.build/) super helpful. You just build your app similar to the [quick-start](https://github.com/electron/electron-quick-start) I just was referencing, and then add [electron-builder](https://www.npmjs.com/package/electron-builder) as an NPM dependency to your project.

The [other builders](https://electronjs.org/docs/tutorial/boilerplates-and-clis) that are available have similar configurations, but the basic idea is to compile your JavaScript, CSS, and HTML into binaries for the different platforms. For Mac you’d have a DMG or .app file. Windows would have a .exe file etc. The resulting binaries could then be signed and distributed via the normal platforms like iOS app store or other deployment option.

For my “Connect 4” app, I used electron-builder and defined a “build” configuration in my `package.json` file like the following:

```json
{
  "build": {
    "appId": "connect_4_with_electron",
    "mac": {
      "category": "public.app-category.entertainment"
    }
  }
}
```

In addition to this setup, I also used the [electron-builder CLI](https://www.electron.build/cli) to create the packaged versions of my application.

Between the two of them, I actually favored the CLI because it requires the least amount of configuration. I think that ultimately, whichever one you chooses is based on the requirements for your project.

## Electron and Angular Builds

![](/images/screen-shot-2019-12-07-at-9.07.46-am.png)

So all of this summary has brought us to the point of being able to discuss my “Connect 4” Electron app. You can go ahead and do a `git clone` of the [project here](https://github.com/andrewevans0102/connect4-electron). You can also refer to the Angular version of the [project here](https://github.com/andrewevans0102/connect4-angular).

The project itself basically follows the same convention has I’ve already walked through. The “sketch” or graphical part of the Connect 4 game board is done with [P5JS](https://p5js.org/).

The cool part is that my Electron implementation of the project is super similar to my Angular implementation of the same code.

The Electron project has the same `main.js` , `index.html` , and `package.json` as we’ve already discussed. The only real differences was that I had to follow some conventions of how P5JS sketches work ([check out the docs for more](https://p5js.org/get-started/)). I also created a [context menu](https://electronjs.org/docs/api/menu), and did a few other small customizations.

Additionally, if you look in the main [home-page-component.ts](https://github.com/andrewevans0102/connect4-angular/blob/master/src/app/home-page/home-page.component.ts) it will have a very similar structure to the [sketch.js](https://github.com/andrewevans0102/connect4-electron/blob/master/sketch.js) file that is in the Electron app. I’m not going to go into how P5JS renders images, but you can compare these two sections of the projects and understand how similar they are.

What I really wanted to highlight, however, was just how similar the code is. I’m just using Angular here since I’m a fan, but you can theoretically do this for any of the main frontend frameworks. The biggest thing is just understanding how the apps are bundled with a central `index.html` file and supporting code “chunks” and CSS styles.

Both Angular and Electron are composed of JavaScript, CSS, and HTML that bundles to form the application. The Angular CLI creates a bundle with webpack that can be deployed. Electron relies on the JavaScript, CSS, and HTML to render its application, and uses builders to package binaries for distribution.

You can really see the similiarties when you compare the Angular bundle generated by the CLI and webpack with the basic Electron application structure.

In the Angular implementation of my “Connect 4” game, the final bundle looks like the following:

```bash
.
├── assets
│   └── favicon.ico
├── favicon.ico
├── index.html
├── main-es2015.js
├── main-es2015.js.map
├── main-es5.js
├── main-es5.js.map
├── polyfills-es2015.js
├── polyfills-es2015.js.map
├── polyfills-es5.js
├── polyfills-es5.js.map
├── runtime-es2015.js
├── runtime-es2015.js.map
├── runtime-es5.js
├── runtime-es5.js.map
├── styles-es2015.js
├── styles-es2015.js.map
├── styles-es5.js
├── styles-es5.js.map
├── vendor-es2015.js
├── vendor-es2015.js.map
├── vendor-es5.js
└── vendor-es5.js.map
```

Now compare this to the structure of the Electron version of the “Connect 4” application (before being packaged obviously):

```bash
.
├── LICENSE
├── README.md
├── dist
├── icon.icns
├── index.html
├── main.js
├── node_modules
├── package-lock.json
├── package.json
├── preload.js
├── renderer.js
├── sketch.js
└── style.css
```

Its not that hard to see how you could easily take the build created from the Angular project and build an Electron app from it. You really would just need to pull in the `main.js` , `preload.js`, and `renderer.js` files and make them reference the associated bundles from the Angular CLI and webpack. This isn’t really a simple task, and would require some testing etc. but the I just wanted to point out the basic building blocks are there.

> I was actually able to do this with a different project. It did require quite a bit of googling and learning about the different builders. The issue really wasn’t with converting the project, but rather just in understanding how to correctly generate the binaries I wanted. If you want to do something like this, I recommend you go incrementally and take your time. It’s easier to do with a smaller project first.

## Closing Thoughts

I hope you’ve enjoyed this post, and it’s been some help in getting a background with Electron. I recommend checking out my projects on GitHub for reference.

- [Angular Project](https://github.com/andrewevans0102/connect4-angular)
- [Electron Project](https://github.com/andrewevans0102/connect4-electron)

In general, I’ve had a good experience working with the platform and building applications. I think it’s really cool that you can leverage frontend skills to build desktop applications. I also really liked the documentation, and large amount of information available on working with Electron. It was fairly easy to get up and running overall.

Also, when you’re ready to package and deploy I highly recommend [electron-builder](https://www.electron.build/) and its associated CLI. They made building electron applications easier, and overall were very good to work with.
