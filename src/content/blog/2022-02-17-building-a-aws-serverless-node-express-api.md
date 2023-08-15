---
title: Building a AWS Serverless Node Express API
pubDate: 2022-02-17T16:04:50.618Z
snippet: Recently I had some fun building a side project that needed an API. I'm
  a longtime fan of serverless.com, and so I went there to look at some of their
  examples. I had previously built a few APIs using individual lambdas, but
  found that you can actually build an API with serverless with AWS API
  Gateway's v2 setup. This allows you to run a serverless API with the popular
  express framework (and greatly simplifies development in the process).
heroImage: /images/cyberspace-gc3ae364fe_1920.jpeg
tags: ["aws", "javascript"]
---

Recently I had some fun building a side project that needed an API. I'm a longtime fan of serverless.com, and so I went there to look at some of their examples. I had previously built a few APIs using individual lambdas, but found that you can actually build an API with serverless with AWS API Gateway's v2 setup. This allows you to run a serverless API with the popular express framework (and greatly simplifies development in the process).

Serverless makes use of the \`httpAPI\` event which you [can read about in detail here](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). I also found [this post](https://www.serverless.com/examples/aws-node-express-api) super helpful as a "getting started" example.

## My Project

So the project I built as around the popular [book series Shadow and Bone](https://en.wikipedia.org/wiki/Shadow_and_Bone). My wife is actually currently reading the series, and I wanted to make a fun reference point that has characters, locations, and various terms the book uses. I could've done this several ways, but figured this was a fun way to use a Serverless API in the process.

You can checkout an open source version of my project on GitHub at <https://www.github.com/andrewevans0102/sahdow-and-bone-server2>.

## How the project is built

So to create a Node Express API with serverless, you need to define the provider, any iam statements you want to use, and finally any resources that you might need to get built (a DynamoDB instance for example). Since we're taking advantage of the `httpAPI` event, we just establish our API's entrypoint in the serverless yaml file with the following:

```yaml
functions:
  api:
    handler: handler.handler
    events:
      - httpApi: "*"
```

For reference, here is a copy of the yaml file I used in my project:

```yaml
service: shadow-and-bone-server
frameworkVersion: "2 || 3"

custom:
  tableName: "shadow-and-bone-server"
  dynamodb:
    stages:
      - dev
    start:
      migrate: true

provider:
  name: aws
  runtime: nodejs12.x
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:Query
            - dynamodb:Scan
            - dynamodb:GetItem
            - dynamodb:PutItem
            - dynamodb:UpdateItem
            - dynamodb:DeleteItem
          Resource:
            - Fn::GetAtt: [ShadowAndBoneServer, Arn]
  environment:
    VALUES_TABLE: ${self:custom.tableName}
  httpApi:
    cors: true

functions:
  api:
    handler: handler.handler
    events:
      - httpApi: "*"

resources:
  Resources:
    ShadowAndBoneServer:
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

plugins:
  - serverless-dynamodb-local
  - serverless-offline
```

Now with that all setup, you can start building your project. Since we're using Node Express, we'll use `npm` to install all of the dependencies. This is the dependencies that I used:

```json
{
  "dependencies": {
    "aws-sdk": "^2.1072.0",
    "express": "^4.17.2",
    "serverless-http": "^2.7.0"
  },
  "devDependencies": {
    "prettier": "^2.5.1",
    "serverless": "^3.2.0",
    "serverless-dynamodb-local": "^0.2.40",
    "serverless-offline": "^8.4.0"
  }
}
```

Now you can setup your express API by just following the standard conventions like so:

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

> If you notice, I'm making a reference to `IS_OFFLINE` which is an environment variable that is used when running this locally. If you'd like to read more about how to run the API locally, [check out my post here](https://rhythmandbinary.com/post/2022-02-17-building-serverless-apis-with-local-dynamodb)

Then from here it's just a matter of defining your endpoints like so:

```js
// health
app.get("/health", async function (req, res) {
  res.status(200).json({ response: "working successfully" });
});
```

You also have a standard endpoint to handle when a not found case:

```js
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});
```

Finally, just wrap your express instance with `serverless` and you're good to go!

```js
module.exports.handler = serverless(app);
```

There is a lot of great documentation on the serverless website on this as well. I hope this post has helped you to see a way to create Node Express APIs with serverless.
