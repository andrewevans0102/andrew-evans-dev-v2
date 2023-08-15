---
title: " Building AWS Serverless APIs with local DynamoDB"
pubDate: 2022-02-17T15:45:02.140Z
snippet: Recently I was building an AWS API with the Serverless platform and
  found a super cool plugin that lets you run a local instance of dynamoDB. This
  is helpful because you can run your API locally and then when its good,
  actually deploy.
heroImage: /images/books-g2e71feb77_1920.jpeg
tags: ["aws"]
---

Recently I was building an AWS API with the [Serverless platform](https://www.serverless.com/) and found a super cool plugin that lets you run a local instance of DynamoDB. This is helpful because you can run your API locally and then when its good, actually deploy.

In this post, I'm just going to show how you add this to your serverless projects and what I did to get it working. This is actually two plugins the `serverless-dyanmodb-local` plugin for local dynamoDB and then the `serverless-offline` plugin to allow you to run your API offline (locally).

If you're not familiar with Serverless.com, I recommend checking out the [getting started page](https://www.serverless.com/framework/docs/getting-started).

So to add the plugin to your project, you first need to add the following to the bottom of your serverless yaml file:

```yaml
plugins:
  - serverless-dynamodb-local
  - serverless-offline
```

Then in the "custom" section at the top of your serverless file also add:

```yaml
custom:
  dynamodb:
    stages:
      - dev
    start:
      migrate: true
```

You'll also want to include a table name in the custom section and define it in the resources part to let serverless know to build it:

```yaml
custom:
  tableName: "your-table-goes-here"

resources:
  Resources:
    YourServer:
      Type: AWS::DynamoDB::Table
      Properties:
        AttributeDefinitions:
          - AttributeName: name
            AttributeType: S
        KeySchema:
          - AttributeName: name
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
        TableName: ${self:custom.tableName}
```

Finally, finish it out by installing these in your project with npm:

```bash
npm install -D serverless-dynamodb-local
npm install -D serverless-offline
```

Once you've got your `serverless.yaml` file all up to date, we now need to install the binaries etc. that makeup the local DynamoDB instance. You do this with:

```bash
sls dynamodb install
```

This should create a ".dynamodb" folder in your project. This should be automatically part of the ".gitignor" file, but if not add it there.

Then when everything's good, you can run your project locally with

```bash
serverless offline start
```

The project I built was a Node Express API, so I also made sure to define a fallback based on the `IS_OFFLINE` property that is set when you run the local DyanmoDB instance. Here is what I had setup:

```js
const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const VALUES_TABLE = process.env.VALUES_TABLE;

const dynamoDbClientParams = {};
if (process.env.IS_OFFLINE) {
  dynamoDbClientParams.region = "localhost";
  dynamoDbClientParams.endpoint = "http://localhost:8000";
}
const dynamoDbClient = new AWS.DynamoDB.DocumentClient(dynamoDbClientParams);

app.use(express.json());
```

> If you notice in this example, it's making the endpoint `localhost` and the actual DynamoDB instance is on port 8000. When you run your app locally, by default it will use port 3000, but I just wanted to clarify why you see the 8000 here.

Then, your project should be running on port 3000, so you can just preface your API calls with "http://localhost:3000" followed by the route name.

I had a few issues with my local installation of Java on my machine. I ended up having to reinstall that, and I think the local DyanmodDB instance runs as a Java applet. Either way, the reinstall fixed my issue and I was able to successfully use it after that. I hope this helps you running serverless and building your applications.

Thanks for reading my post! Follow me at [@AndrewEvans0102](https://twitter.com/AndrewEvans0102).
