---
title: Building a Serverless API with ClaudiaJS
pubDate: 2019-07-17T19:01:59.000Z
snippet: "Recently I was trying to build out a serverless JavaScript API with AWS, and found a really nice CLI and Framework called Clau"
heroImage: /images/construction-2578410_960_720.jpg
tags: ["javascript", "aws"]
---

> [cover image was originally copied from here](https://pixabay.com/photos/construction-worker-safety-2578410/)

Recently I was trying to build out a serverless JavaScript API with AWS, and found a really nice CLI and Framework called [ClaudiaJS](https://claudiajs.com/). With ClaudiaJS I was able to build out a basic CRUD interface for my application. The experience was super easy, and greatly improved my experience with AWS Lambda and API Gateway. The following post is going to cover my experience and the basics of what I did.

## Serverless

Before I start discussing what I did, I wanted to take a second and define some basic terms I’m going to be using:

- **API** = Application Programming Interface
- **Serverless** = any type of system that does not require maintaining a physical server
- **Lambdas** = technology that lets you run code in the cloud without hosting infrastructure
- **CRUD** = Create, Read, Update, Delete

Serverless technologies have become very popular within the last few years. All of the cloud providers have some flavor of them. For the purposes of this post, I’m going to be working entirley inside AWS. Check out the following links for more info:

- [AWS Lambdas](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Google Cloud Functions](https://cloud.google.com/functions/)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions/http-events)
- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)

Why is serverless important? Serverless technologies remedy a lot of the pain points that have accompanied traditional software development. In the past engineers would need to not only develop code, but also find places to host it to interact with the rest of the world. This typically involved setting up a server, installing patches, etc. This was often a maintenance headache as a developer would have to also be sys admin and support. Serverless technologies make this all easier, in that you are **only responsible for your code**. This means that you can rely on the cloud provider to do all the maintenance, and you (as the developer) only have to work on making sure your code runs correctly.

## ClaUDiaJS

ClaudiaJS is a CLI that leverages the NPM package [claudia](https://www.npmjs.com/package/claudia) as well as the NPM package [claudia-api-builder](https://www.npmjs.com/package/claudia-api-builder) to quickly (and easily) build out a serverless backend.

CladuiaJS has an excellent site that has basic walkthroughs for several different uses cases. [Check out their main webpage here](https://claudiajs.com/tutorials/index.html).

The way that it basically works is that ClaudiaJS leverages the API Gateway Proxy and [AWS serverless-express](https://github.com/awslabs/aws-serverless-express) model to create a set of lambdas that act as an API. The whole process is mapped nicely with the following image:

![](/images/screen-shot-2019-07-15-at-5.40.04-pm.png)
_(source [https://www.youtube.com/watch?v=Cuh_gtFX5gI](https://www.youtube.com/watch?v=Cuh_gtFX5gI))_

As you can see in the screenshot:

1.  the application basically starts at the gateway
2.  Once a user hits the gateway, a lambda is called that starts a [node express](https://expressjs.com/) instance
3.  The `AWS event` is transformed into a Node Express request
4.  The corresponding Request endpoint is called, ran, and the corresponding return value is fed back to the caller in the form of an HTTP response.

This is also somewhat similar to the way that Firebase Cloud Functions leverage Node Express, as seen in [their HTTP Request documentation here](https://firebase.google.com/docs/functions/http-events).

AWS also has a nice video that covers what happens underneath the hood here:

In my googling, I also found this presentation useful for a high level overview of how this works:

## Where do I get started?

In order to start working with ClaudiaJS I recommend you walkthrough the [tutorials here.](https://claudiajs.com/tutorials/index.html) For my project I created some basic endpoints that interacted with a DynamoDB table in AWS. To review my project, [check out my code on GitHub here](https://github.com/andrewevans0102/amplify-links-claudiajs-lambda/tree/master).

For my project I followed the [basic outline in the tutorial here](https://claudiajs.com/tutorials/hello-world-api-gateway.html). I did the following:

Installed claudiajs globally with

```bash
npm install -g claudia
```

Created a directory for my project with

```bash
mkdir amplify-links-claudiajs-lambda
```

Did the standard `npm init` to setup my `package.json` file

Installed the claudiajs api builder as a project dependency with

```bash
npm install claudia-api-builder -S
```

Created the initial app file for my server with:

```js
var ApiBuilder = require("claudia-api-builder"),
  api = new ApiBuilder();

module.exports = api;

api.get("/hello", function () {
  return "hello world";
});
```

Then tested deployment with the claudiajs CLI with the following:

```bash
claudia create --region us-east-1 --api-module app
```

After the initial deployment I got a nice terminal message that included the base URL for my API:

```json
{
  "lambda": {
    "role": "amplify-links-executor",
    "name": "amplify-links",
    "region": "us-east-1"
  },
  "api": {
    "id": "e4rrn42jmc",
    "module": "app",
    "url": "https://e4rrn42jmc.execute-api.us-east-1.amazonaws.com/latest"
  }
}
```

Then for any updates I just went ahead and ran `claudia update`

## finished PRoduct

When I was finished my basic application looked like the following:

```js
var ApiBuilder = require("claudia-api-builder"),
  AWS = require("aws-sdk"),
  api = new ApiBuilder(),
  documentClient = new AWS.DynamoDB.DocumentClient(),
  dynamoDBTableName = "amplify-links";

AWS.config.update({ region: "us-east-1" });

module.exports = api;

// hello world
api.get("/hello", function () {
  return "hello world";
});

// create
api.put(
  "/api/create",
  function (request) {
    "use strict";
    try {
      const params = {
        TableName: dynamoDBTableName,
        Item: {
          username: request.body.username,
          links: request.body.links,
        },
      };
      return documentClient.put(params).promise();
    } catch (error) {
      return error;
    }
  },
  { success: { code: 200 }, error: { code: 500 } },
);

// read
api.get("/api/read/{username}", function (request) {
  "use strict";
  try {
    const params = {
      TableName: dynamoDBTableName,
      Key: {
        username: request.pathParams.username,
      },
    };
    return documentClient.get(params).promise();
  } catch (error) {
    return error;
  }
});

// delete
api.delete("/api/delete/{username}", function (request) {
  "use strict";
  try {
    const params = {
      TableName: dynamoDBTableName,
      Key: {
        username: request.pathParams.username,
      },
    };
    return documentClient.delete(params).promise();
  } catch (error) {
    return error;
  }
});
```

As you can see I basically built out the basic CRUD functions. The exception being I didn’t really have an `update` function. However, for the frontend app I’m going to use with this I only ever really created entries and wasn’t concerned with updating.

After I ran claudiajs I went over to my AWS console. If you open API Gateway you’ll find that the necessary endpoints were built out like so:

![](/images/screen-shot-2019-07-17-at-2.53.08-pm.png)

As you can see from the screenshot, claudiajs has taken care of a lot of the manual things that you would otherwise do with creating the endpoints, assigning permissions, etc.

I did also have to add a policy to my AWS lambda to enable it to interact with dynamoDB. I added the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AmplifyLinksLambdaActions",
      "Effect": "Allow",
      "Action": [
        "dynamodb:Get*",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:Delete*",
        "dynamodb:Update*",
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:XXXX:table/amplify-links"
    }
  ]
}
```

Then when (after I had deployed) I was able to run it successfully with Postman like you see in the following screenshot:

![](/images/screen-shot-2019-07-17-at-2.56.36-pm.png)

## Closing Thoughts

I hope this post has given you an introduction to claudiajs, and potentially could help you build out serverlesss APIs. There is a lot of good documentation that goes with claudiajs, and I encourage you to read more.
