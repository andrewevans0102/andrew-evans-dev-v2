---
title: How Cypress Makes Testing Fun
pubDate: 2019-06-09T16:01:28.000Z
snippet: "Tony Stark using Cypress to test his Iron Man suit Recently, I worked through implementing Cypress e2e testing on my application the overwatch-challenge. I was really impressed"
heroImage: /images/tony_stark-suit_test.jpg
tags: ["javascript", "testing"]
---

Recently, I worked through implementing [Cypress](https://www.cypress.io/) e2e testing on my application [the overwatch-challenge](https://github.com/andrewevans0102/overwatch-challenge). I was really impressed by the experience, and wanted to write about what I did, and why it was so cool.

> _This post is going to focus on a high level explaining what Cypress is and why it will help you. For an awesome walkthrough (with code) please check out [How to get started with Cypress](https://blog.angularindepth.com/get-started-with-cypress-d6ac4b910605) by [Michael Karén](https://blog.angularindepth.com/@michael.karen)._

## What is Cypress?

![](/images/cypress1.jpg)_[image source](https://www.cypress.io/))_

Cypress is an [Open Source](https://github.com/cypress-io/cypress) JavaScript testing framework. Cypress enables e2e, integration, and unit tests in your projects. The e2e features of Cypress are what get the most attention currently, because of both the quality of the experience and the large amount of benefits it provides.

Cypress is unique because it runs within the same space as your application when testing. You can also set your Cypress tests to run against a dev environment, but most of the use cases I’ve seen have the application running with the test runner both locally and in CI. For the purposes of what I did, I ran a local version of my application with the Cypress tests in both local testing and CI deployment. Cypress runs with a test runner locally, and it runs headless in your CI.

Additionally, Cypress creates videos, snapshots, and reports whenever it runs by default. These can all be stored either in a project repo or you can integrate your project with [Cypress Dashboards](https://www.cypress.io/dashboard/).

The only drawback is that it currently only supports Chrome, [but there is discussion of future browser expansion](https://github.com/cypress-io/cypress/issues/310). However, when you consider the huge user base that Chrome supports, you realize that this really isn’t a problem for many applications.

For most developers, testing is something that is seen as a “necessary evil.” With Cypress this reverses that feeling, and makes it fun for the developer to write tests along with their code.

The true power of Cypress is just in the fact that **it encourages developers to write tests in their projects**. When the developers want to write tests, the business side of projects greatly benefit because the result is more maintainable code. Developers like to write the tests, and managers benefit because they receive more maintainable code.

## How Does it work?

As I stated in the first section, Cypress runs in the same loop as the application. You can point your Cypress tests to an environment instead, but most of the examples you see run a local copy of your project along with the Cypress Test Runner in the same environment.

Cypress runs as a local Node Server alongside your application. This is greatly different than more traditional tests ran with Selenium and Webdriver. By running as a local Node Server, you are able to interact with both the tests that you have written and the server itself.

![](/images/cypress_screen.png)

_Local test runner that runs when you run your Cypress Tests. The test runner reads spec files within a Cypress directory to allow you to run the test individually or together._

Since you are running the Cypress Test Runner as a local Node Server, you usually have to use some type of utility to accomplish this.

In my tests I used:

- NPM module [concurrently](https://www.npmjs.com/package/concurrently) for local tests
- NPM module [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) for CI tests

> _The Cypress documentation encourages you to use [wait-on](https://github.com/jeffbski/wait-on) and [start-server-and-test](https://github.com/bahmutov/start-server-and-test). I found that concurrently works better than wait-on. For more info [check out the docs here](https://docs.cypress.io/guides/guides/continuous-integration.html#Boot-your-server). Also please check out the [concurrently NPM page here](https://www.npmjs.com/package/concurrently)._

With regards to actually writing your tests, the learning curve is super small because Cypress sits on top of technologies that most developers are familiar with. Cypress runs on top of the following tools:

- [Mocha](https://mochajs.org/) (test framework)
- [Chai](https://www.chaijs.com/) (assertion library)
- [Sinon](https://sinonjs.org/) (spies, stubs and mocks)

![](/images/cypress2.jpg)

As you can see from this code snippet, the structure of the tests you’ll write is very much similar to what you see with any of the major test frameworks that frontend applications currently use. This of a great benefit as it makes the learning curve very low for new devs using Cypress for the first time.

Most of the Cypress syntax starts with the prefix `cy` and is very similar to the Jasmine Syntax that most developers have used for many years. This similarity (and the awesome documentation) make for a super small learning curve for Cypress.

## Ok, so lets see it running

When you run your tests locally, a Chrome window will display alongside the Cypress Test Runner. The Chrome window shows you a console output of each test as it runs. The console here **also enables time travel**, where you can click on a test ran and see what the browser looked like at that specific step. This makes it really easy to resolve bugs and broken tests.

![](/images/screen-shot-2019-06-09-at-7.02.54-am.png)_Cypress Test Runner Chrome Window_

Additionally, whenever your tests run Cypress records a video by default. This can be turned off in the cypress configuration if you want. I found this to be really cool. In an enterprise environment, you could consider a time when a Product Owner might want to see the test results from Production. Having a video output is a great benefit.

_Video Captured during Cypress Test_

## CI Reports and Dashboards

Whenever Cypress Runs in your CI environment, it will create a report of the tests and how they ran. This is very similar to reports that you see with other frameworks like Karma.

![](/images/screen-shot-2019-06-09-at-7.31.07-am.png)_Cypress Report from CI Run_

Cypress takes it a step farther, however, and offers a Dashboard service where you can view all of the runs (and output) of your tests. This is particularly helpful if you want to see history or compare failing test results from your pipeline.

![](/images/cypress_report.jpg)_Cypress Dashboard_

## Configuration

Cypress offers a vast amount of custom [configuration options](https://docs.cypress.io/guides/references/configuration.html#Options). As stated in the earlier sections, you can customize both the front and backend of your Cypress Test Runner.

Cypress provides a cypress.json file where you can put in configuration settings that will be read in whenever you start the test runner. You can access these values in your tests with `Cypress.env` directly.

![](/images/cypress_configuration.jpg)

You can also view the configuration in the Test Runner GUI under the **settings** button.

![](/images/cypress_c1.jpg)

## Network Requests

One of the really nice features of Cypress is the ability to intercept [network requests](https://docs.cypress.io/guides/guides/network-requests.html#Testing-Strategies). This is particularly valuable if you wanted to check for the correct response from an API call.

In order to do this you just add a `beforeEach` with an instance of `cy.server()` with a `route` as you see here:

![](/images/cypress_request1.jpg)

Then in your test you just add a `cy.wait()` and intercept the response from the route you created.

![](/images/cypress_request2.jpg)

In the Chrome Window that opens with your Test Runner you’ll see this as well:

![](/images/cypress_chrome.jpg)

## Reducing Boilerplate

Cypress also helps with reducing boilerplate code through [the use of fixtures](https://docs.cypress.io/api/commands/fixture.html#Syntax) as well as [custom commands.](https://docs.cypress.io/api/cypress-api/custom-commands.html#Syntax)

In the Cypress `support` folder you define a command similar to the following:

![](/images/c1.jpg)

Then in your test you can call the command directly as you see here in the `before` with `cy.login()`:

![](/images/c2.jpg)

This reduces the amount of code that you would have to write throughout your application. A common use case where this helps a lot is tests that require users be signed in. Rather than having to write the sign in logic several times, you can just call this command and it covers all of that boilerplate code for you.

## Closing Thoughts

![Image result for tony stark with iron man suit](/images/im3_hall_of_armors-e1528842275831.jpg)_Tony Stark reviewing his Cypress tested Iron Man suits ([image source](https://geeksofcolor.files.wordpress.com/2018/06/im3_hall_of_armors-e1528842275831.jpg?w=950))_

So after working with Cypress, I really can’t say enough good things about it. The framework has made testing easy (and fun). It has provided a lot of features that older frameworks lacked. It was also very easy to integrate into my projects pipeline.

Just to reiterate a point I made earlier, the **real power of Cypress is in making developers want to write tests**. Writing Cypress tests is far less painful than I’ve traditionally seen in my career. The fact that developers could enjoy writing tests is a huge win for both the software they produce, and the companies that they represent. One of the biggest hurdles company has is encouraging their devs to write tests for their code. Cypress has provided a framework which makes it fun and easy to do. I hope you’ll give Cypress a look, and even build out some tests for your own project. Feel free to leave comments. Thanks for reading!
