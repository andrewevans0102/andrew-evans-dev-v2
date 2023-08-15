---
title: How to use Cypress for E2E with React
pubDate: 2021-03-15T09:38:53.270Z
snippet: "With any Frontend application, End to End (e2e) testing can really
  improve maintenance and the Software Development Life Cycle (SDLC) of the
  application. E2E allows you to quickly verify changes, and also works to
  document features in your application.  There are a few options for E2E
  frameworks today. Cypress is one of the newer and more "
heroImage: /images/lamp-3489395_1920.jpg
tags: ["react", "javascript"]
---

> The cover image was originally [copied from](https://pixabay.com/photos/lamp-light-lighting-light-bulb-3489395/)

With any Frontend application, End to End (e2e) testing can really improve maintenance and the Software Development Life Cycle (SDLC) of the application. E2E allows you to quickly verify changes, and also works to document features in your application.

There are a few options for E2E frameworks today. [Cypress](https://www.cypress.io/) is one of the newer and more exciting options for building E2E tests in your application.

Cypress is a great option for E2E because it:

1. runs in the same event loop as your frontend project (rather than externally "knocking on the door" like E2E [Selenium](https://www.selenium.dev/documentation/en/webdriver/) based projects do)
2. Works with any Frontend project (install Cypress as a dependency and the test runner will automatically detect the corresponding configuration files)
3. All of the E2E is written in JavaScript (no need to have `.feature` or other associated files)
4. Cypress provides a hot reloading test runner allowing you to develop your tests in a very similar way to how you do local development already

The only limitations of Cypress is that it works with [Chrome, Firefox, Electron, and the Edge browser](https://www.cypress.io/blog/2020/02/06/introducing-firefox-and-edge-support-in-cypress-4-0/#header). There are plans for it to support more browsers in the future. It is important to note, however, that those 4 browsers take up a big market share of the browser world and solve many usecases. Each project has different needs, but these 4 browsers provide a lot of potential coverage of E2E tests for Frontend projects.

Cypress has a load of features and a great community supporting it. I highly recommend [checking out their docs](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)

In this post I'm going to introduce Cypress and how you can use it with React. If you'd like to follow along, I've created a GitHub repo that has all of the examples I cover at <https://www.github.com/andrewevans0102/cypress-react>. The example I used also is a rebuild of a previous project I used for my post [How to get started with Cypress](https://www.newline.co/@AndrewEvans/how-to-get-started-with-cypress--0bed3a8b).

I also created a YouTube video where I walk through this same sample project.

[![YouTube video](https://img.youtube.com/vi/FkJMsBEG5LA/0.jpg)](https://www.youtube.com/watch?v=FkJMsBEG5LA)

## Sample Application

Before we dive into using Cypress, I just want to explain how the sample application works. You can reach the sample application at <https://www.github.com/andrewevans0102/cypress-react>.

![Sample Application](/images/screen-shot-2021-03-15-at-6.00.09-am.png)

The application has three major sections which have examples for:

1. Forms
2. Lists
3. Network Requests

In our Cypress Setup we're going to walkthrough building E2E tests for all three of these pages.

## Installing Cypress

There are multiple ways to install Cypress. If you [check out the docs](https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements), you'll see that you can install it with `npm`, `yarn`, or even a manual install of the binary.

In my project I used npm, so I installed it as a `dev dependency` with:

```bash
npm install cypress --save-dev
```

Once you do the `npm install` you should see a `cypress` folder and a `cypress.json` file created in your project's folder:

![Folders](/images/screen-shot-2021-03-15-at-6.11.54-am.png)

> Please notice the "examples" folder, this is something I created and just copied the generated example files from `integrations` over to their own folder for simplicity.

![JSON File](/images/screen-shot-2021-03-15-at-6.12.00-am.png)

The directories and files that are built contain different configuration that we'll use to build E2E with Cypress. They all correspond to:

- `fixtures` is where you build mocks or stubbed responses for your tests
- `integration` is where you place your actual test `.spec.js` files by default.
- `plugins` allow you to extend Cypress behavior
- `screenshots` and `videos` are where the test runner will store visual copies of test runs (more on that in the next sections)
- `support` allows you to define "commands" or boil plate behavior you can reference in your tests avoiding the need to repeat startup tasks like login or similar flows

Once you've got Cypress installed, you can see your first interaction with Cypress by calling "open" with:

```bash
./node_modules/.bin/cypress open
```

## First Tests

![Local Window](/images/screen-shot-2021-03-15-at-6.31.09-am.png)

When you first install Cypress, you'll notice in the `integrations` folder that there is a set of examples. These are really useful because you can see a first interaction with the test runner. These examples hit the Cypress "kitchen sink" site, so there is no configuration required to run them. If you want to go ahead and play with them, you can use the `cypress open` command that was at the end of the previous section to see the test runner in action.

I normally go ahead and copy the "examples" over to its own directory. Assuming you've done that, the next step is to configure some scripts that automate working with Cypress.

I recommend creating the following npm scripts:

```json
{
  "scripts": {
    "cypress-open": "./node_modules/.bin/cypress open",
    "cypress-local": "concurrently \"npm run start\" \"npm run cypress-open\"",
    "cypress-run": "./node_modules/.bin/cypress run",
    "cypress-ci": "start-server-and-test \"npm run start\" http://localhost:3000 \"npm run cypress-run\""
  }
}
```

Let's talk about what they do:

- `cypress-open` opens the test runner by itself
- `cypress-local` runs the test runner and the application locally (interactive)
- `cypress-run` runs the test runner in CI (headless)
- `cypress-ci` runs the application and the test runner in CI (headless)

  > Please note CI refers to "Continous Integration" and is just referring to a build pipeline

You'll also need to go ahead and install [concurrently](https://www.npmjs.com/package/concurrently) and [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) with:

```bash
npm install concurrently
npm install start-server-and-test
```

As I stated in the intro, Cypress runs in the same event loop as your application. This means that when you run your Cypress tests, you'll need to use some mechanism to run your application alongside the test runner. The use of `concurrently` and `start-server-and-test` allows for this behavior. When running locally `concurrently` keeps your application running alongside the test runner. When running in CI, the use of `start-server-and-test` will shut down your application and the test runner when the tests have completed.

Let's write our first test to see the "local" run of this in action.

Go over to the `integrations` folder and create a file `first_test.spec.js` with the following:

```js
describe("First Test", () => {
  it("should visit home page", () => {
    cy.visit("http://localhost:3000/home-page");
  });
});
```

If you notice, this is following the standard [mocha](https://mochajs.org/) and [jasmine](https://jasmine.github.io/) syntax. This is nice because if you're familiar with other testing frameworks, there isn't a lot for you to learn beyond just building your tests and getting used to the `cy` test runner object.

In this first test, we're just visiting the sample applications home page. Once you've created your `first_test.spec.js` file, go ahead and run `npm run cypress-local` to see the test run.

![First Run](/images/screen-shot-2021-03-15-at-6.36.33-am.png)

When you do the first run, you'll note that by default Cypress will open a session of `Chrome` to actually test your application. The test runner then provides details on each step that is run, and you can even do "time travel" when you click through the different steps that ran.

## Forms Test

So now that we have our first test running, let's go ahead and create our forms page test. Go to the `integrations` folder and create `form.spec.js` like the following:

```js
describe("Form Test", () => {
  it("should visit home page", () => {
    cy.visit("/home-page");
  });

  it("should visit home page and click start", () => {
    cy.visit("/home-page");
    cy.get("#startButton").click();
    cy.get("h1").should("contain", "Learn Cypress");
  });

  it("should go to the forms page and enter login information", () => {
    cy.visit("/home-page");
    cy.get("#startButton").click();
    cy.get("h1").should("contain", "Learn Cypress");
    cy.get("#formsButton").click();
    cy.get("#email").type("HanSolo@gmail.com");
    cy.get("#password").type("password");
    cy.get("#submitButton").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(
        "successfully entered input with email HanSolo@gmail.com and password password",
      );
    });
  });
});
```

Also, go ahead and modify the `cypress.json` file to have the following:

```json
{ "baseUrl": "http://localhost:3000" }
```

What we just did there is created our first `environment variable` within Cypress. The `cypress.json` file allows you to create variables you can reference in your tests. The `baseUrl` is a built in variable, but you can [create your own custom ones as well](https://docs.cypress.io/guides/guides/environment-variables.html#Setting). By having the `baseUrl` defined, we can modify our "visit the homepage test" to be:

```js
it("should visit home page", () => {
  cy.visit("/home-page");
});
```

instead of:

```js
it("should visit home page", () => {
  cy.visit("http://localhost:3000/home-page");
});
```

If you go ahead and run `npm run cypress-local` then you should see the forms test run. If you hadn't stopped Cypress or the local application, you should've seen the test runner automatically load in the files and reload the page. This is one of the best parts of Cypress because it allows for "hot reloading" as you develop your tests.

![Forms Output](/images/screen-shot-2021-03-15-at-6.44.33-am.png)

If you notice in the code, we're passing commands to the Cypress test runner object `cy` like the following:

```js
cy.get("#startButton").click();
```

What we are doing here is identifying the object on the page, and then passing events to it. We could also get information as you see with the asserts:

```js
cy.get("h1").should("contain", "Learn Cypress");
```

This is all similar behavior to the traditional:

1. `arrange` = setup your test environment
2. `act` = run the actual test
3. `assert` = verify the output result

There is a lot of documentation on how to setup tests and interact with the `cy` object. I recommend checking out the guide on [writing your first tests](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html).

## Lists Test

So now we can also try testing the `lists` page. Create a file `list.spec.js` in the `integrations` folder:

```js
describe("List Test", () => {
  it("should go to the list page and add a value", () => {
    cy.visit("/home-page");
    cy.get("#startButton").click();
    cy.get("h1").should("contain", "Learn Cypress");
    cy.get("#listsButton").click();
    cy.get("#createInput").type("use the force Luke!");
    cy.get("#createButton").click();
    cy.get("li").eq(4).should("contain", "use the force Luke!");
  });

  it("should go to the list page and delete a value", () => {
    cy.visit("/home-page");
    cy.get("#startButton").click();
    cy.get("h1").should("contain", "Learn Cypress");
    cy.get("#listsButton").click();
    cy.get("#createInput").type("use the force Luke!");
    cy.get("#createButton").click();
    cy.get("li").eq(4).should("contain", "use the force Luke!");
    cy.get(":nth-child(5) > .btn").click();
    cy.get("[data-cy=listValues]").children().should("have.length", 4);
  });
});
```

Once you've ran it, you should see something like the following:

![Lists Output](/images/screen-shot-2021-03-15-at-6.53.44-am.png)

If you run `npm run cypress-local` now, you can run the tests on the lists page. This is similar to the way that built our forms tests, with the additonal step that you notice we can count values as you see here:

```js
cy.get(":nth-child(5) > .btn").click();
cy.get("[data-cy=listValues]").children().should("have.length", 4);
```

This just highlights one of the cool things you can do with the `cy` runner. Its particularly useful with lists since you'll often need to see the length of a list or if a value is present within the list in a frontend project.

## Network Requests

With any Frontend application, network requests are always a key part of any workflow. You need to interact with the backend to get or push data.

Let's create our network requests test in the `integrations` folder by creating a file called `network.spec.js` with the following:

```js
describe("Network Requests Page Test", () => {
  beforeEach(() => {
    // server starts to listen for http calls
    cy.server();
    // create route that cypress will listen for, here it is the films endpoint of the SWAPI
    cy.route("GET", "https://swapi.dev/api/films/**").as("films");
  });

  it("should go to the network requests page and select a movie", () => {
    cy.visit("/home-page");
    cy.get("#startButton").click();
    cy.get("h1").should("contain", "Learn Cypress");
    cy.get("#networkButton").click();
    cy.get("#movieSelect").select("A New Hope (1)");
    cy.get("#movieTitle").should("contain", "A New Hope");
    cy.get("#episodeNumber").should("contain", 4);
  });

  it("should go to the network requests page and verify the HTTP payload called", () => {
    cy.visit("/home-page");
    cy.get("#startButton").click();
    cy.get("h1").should("contain", "Learn Cypress");
    cy.get("#networkButton").click();
    cy.get("#movieSelect").select("A New Hope (1)");
    // await the response from the SWAPI http call
    cy.wait("@films").then((films) => {
      expect(films.response.body.title).to.equal("A New Hope");
    });
    cy.get("#movieTitle").should("contain", "A New Hope");
    cy.get("#episodeNumber").should("contain", 4);
  });
});
```

If you run it, you should see the following:

![Network Output](/images/screen-shot-2021-03-15-at-6.57.12-am.png)

With this test, you'll notice that we have a `beforeEach` block:

```js
beforeEach(() => {
  // server starts to listen for http calls
  cy.server();
  // create route that cypress will listen for, here it is the films endpoint of the SWAPI
  cy.route("GET", "https://swapi.dev/api/films/**").as("films");
});
```

This is standard with `mocha` and `jasmine` as it sets up the test runner before actually exercising the tests. Notice the use of the `cy.server` object. This allows Cypress to listen for network calls and specficially this test is looking for the "swapi.dev" API call with:

```js
cy.route("GET", "https://swapi.dev/api/films/**").as("films");
  });
```

Then in the actual test runs, notice that there is a `cy.wait` which waits for the API call to complete to verify the results:

```js
// await the response from the SWAPI http call
cy.wait("@films").then((films) => {
  expect(films.response.body.title).to.equal("A New Hope");
});
```

This is very powerful in that it will allow you to test the payload of your API calls, and allows the test runner to be versatile enough to not only deal with the DOM on your page, but also the proper payloads that the HTTP calls should be returning.

## Commands

So up until this point, all of our tests have had something like the following:

```js
cy.visit("/home-page");
cy.get("#startButton").click();
cy.get("h1").should("contain", "Learn Cypress");
cy.get("#networkButton").click();
```

This is what I would consider "boiler plate" in that you always have to visit the home page and click one of the buttons to interact with the applicable page.

Cypress allows you to reduce that boilerplate by creating `commands` in the `support` folder. If you go ahead and open up the file `cypress/support/commands.js` you'll notice that there is some docs pointing to the [commands guide](https://on.cypress.io/custom-commands). In Cypress, you can build `commands` which are basically just aliases to a set of steps. If you build a command here, you can then reference it in your tests and avoid having to copy and paste a lot.

Go ahead and add the following to the `commands.js` file:

```js
Cypress.Commands.add("start", () => {
  cy.visit("/home-page");
  cy.get("#startButton").click();
  cy.get("h1").should("contain", "Learn Cypress");
  cy.get("#formsButton").should("contain", "Forms");
  cy.get("#listsButton").should("contain", "Lists");
  cy.get("#networkButton").should("contain", "Network Requests");
});
```

Here we create a `start` command which has the flow up to the `content` page. It then verifies that the correct values are present for the button labels.

We can then go back to our original Forms Test file (`forst.spec.js`) and remove the:

```js
cy.visit("/home-page");
cy.get("#startButton").click();
cy.get("h1").should("contain", "Learn Cypress");
```

and add:

```js
before(() => {
  cy.start();
});
```

This references the `start` command we created. Now if you run the test, you'll see the `start` command and test has run without you needing to reference in the associated spec file.

![Command Output](/images/screen-shot-2021-03-15-at-7.06.50-am.png)

## Running Cypress in CI

So the last thing I wanted to cover was what happens when you run Cypress in CI. In the beginning sections you notice we created a `cypress-ci` npm script which called `cypress run` instead of `cypress open`. This is Cypress mechanism to run "headless" in your project pipeline.

If you go ahead and take the tests we've written so far, you can run `cypress-ci` to see the output. First stop your app and Cypress (if you haven't already done so) and then run `npm run cypress-ci` to see the following:

![CI Output](/images/screen-shot-2021-03-15-at-7.10.29-am.png)

This is all logged runs of all your spec files. Up until now, you would run each `spec` file individually with the test runner GUI. Now in CI, Cypress will run all of your spec files with console output that you can keep in your respective CI system.

You'll also note that there are `mp4` files stored in the `videos` folder:

![Video Output](/images/screen-shot-2021-03-15-at-7.12.30-am.png)

These are live runs of your CI tests. The cool part here is that you could script out this process such that you could copy these files and send them to a shared folder. This could also be sent directly to your project's Product Owner when you do deployments. There are a lot of options here.

## Closing Thoughts

I hope you've enjoyed my post and learned something about Cypress. I've used it on several projects, and found it not only powerful but also fun. The tooling and community support with Cypress make it a very developer friendly tool. The support for logging and storing test run information also make it a powerful asset to any project team. I recommend checking out the docs and various guides on the [Cypress Webisite](https://www.cypress.io/).
