---
title: Firebase
pubDate: 2018-04-08T21:14:27.000Z
snippet: "Recently I've been playing with Google's Firebase. Its really cool and it enables you to create and host apps and is free as long as you don't store more than 1GB. It has a nice C"
heroImage: /images/screenshot-from-2018-04-08-17-15-06-e1523222201213.png
tags: ["firebase"]
---

Recently I’ve been playing with Google’s Firebase. Its really cool and it enables you to create and host apps and is free as long as you don’t store more than 1GB. It has a nice CLI that lets you do everything from the commandline and the Firebase console. Check out the main site here [Firebase Site](https://firebase.google.com/)

So in this post I’m just going to show how easy this is to use by creating and deploying an Angular 5 app. For this tutorial I’m using Ubuntu Linux, but with either Putty (for Windows) or terminal on OSX you’ll have a very similar experience.

## Install the Angular CLI

First lets start off installing the Angular CLI. I’m assuming you already have node js installed with NPM. If not, go to the [NodeJS site](https://nodejs.org/en/) and download the package directly. Once you’ve got Node up and running install the Angular CLI with

```bash
npm install -g @angular/cli
```

Next after the Angular CLI is installed, lets create a test app to startout. In the terminal run the following to create a test project

```bash
ng new firebase-test
```

Then go into the directory the CLI created:

```bash
cd firebase-test
```

Next run the CLI command to make sure the app is created and running correctly (this should open your browser with the Hello World page at localhost:4200):

```bash
ng serve --open
```

![Screenshot from 2018-04-08 16-41-13](/images/screenshot-from-2018-04-08-16-41-13-e1523220140287.png)

## Install Firebase

Now that you know your app is good its time to get it ready for firebase. Run the folllowing in the terminal to package your code into a directory called “dist” which can be used for deployment:

```bash
ng build --prod
```

Now that your app is ready its time to login to the console by going here [https://console.firebase.google.com/](https://console.firebase.google.com/) . If you have a google account you can just use that, otherwise you’ll create an account here. Once your account is created, create an app by clicking the “create an app” button. Enter a name for your app and it’s created! You now have access to all the Firebase services and a provisioned VPC. You just need to use the Firebase APIs in your app to interact with the services.

The provisioned VPC that Firebase provides allows you as a developer to be up and running with most of the basics you need. It automates a lot of the challenges that Software Engineers face on a daily basis just get their infrastructure up and running.

The Firebase documentation is pretty broad. Some googling also will provide you with more info and help with challenges etc.

![screenshot-from-2018-04-08-16-47-03.png](/images/screenshot-from-2018-04-08-16-47-03-e1523220497168.png)

## Install Firebase Command Line Tools

Now that your app is setup on your local machine and you’re registered on the console, lets install the firebase tools. Open back up the terminal and enter the following

```bash
npm install -g firebase-tools
```

This will install the toolset needed. When you’ve got everything setup, run

```bash
firebase login
```

This will log you in on your console so you can interact with Firebase directly from the command line. A new webpage window should open for you to enter your password etc. Once you enter your credentials then you’re good to go (you’ll see the message below)

![Screenshot from 2018-04-08 16-54-33](/images/screenshot-from-2018-04-08-16-54-33-e1523220920876.png)

## Setup Your Firebase App to be Deployed

So now you’ve got the app ready, firebase account created, app created, and you’re logged in. Its now time to deploy your app! On the terminal go to your projects root directory and enter the following:

```bash
firebase init
```

Follow the prompts to setup your root directory to connect to firebase. You should see a screen like the following:

![Screenshot from 2018-04-08 17-13-16](/images/screenshot-from-2018-04-08-17-13-16-e1523222052210.png)

- In the first selection make sure to select “Hosting: Configure and deploy Firebase Hosting sites” because we want to deploy this thing into Firebase’s hosted options.
- As you can see there are a lot of other cool options, in the console itself you can set those up later.
- Once you select the hosting option, pick the project you just created in the console from the list they give you.
- When it asks what directory you want to use as your public directory make sure to enter “dist” to account for the ng build directory that we created earlier
- We want to configure as a single page app
- Make sure to select “no” for overwriting the index.html page, otherwise you’ll get the firebase generic page instead of the first page of your app

## Deploy Your Firebase App

Now you have the firebase project setup, so lets deploy it!  Enter the following in the terminal

```bash
firebase deploy
```

If you get a success message, Firebase will give you a hosting URL. When you open that in your browser you can interact with your hosted and you’re done. You just hosted your first app on firebase!

You can continue with the free developer account or upgrade to a paid account at a later time. Check it out and have fun!
