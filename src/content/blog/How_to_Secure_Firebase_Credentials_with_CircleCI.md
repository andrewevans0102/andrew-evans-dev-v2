---
title: How to Secure Firebase Credentials with CircleCI
pubDate: 2019-01-11T11:37:57.000Z
snippet: "This week I ran into a situation where I wanted to publish an open source project in GitHub, but it contained credentials that I didn't want to keep in the repo. In an effort to get more"
heroImage: /images/screen-shot-2019-01-11-at-6.01.15-am.png
tags: ["firebase", "cicd"]
---

This week I ran into a situation where I wanted to publish an open source project in GitHub, but it contained credentials that I didn’t want to keep in the repo.

In an effort to get more out of my CircleCI builds, I decided to look into securing the credentials with environment variables. I had already been familiar with this process for the **FIREBASE_TOKEN** parameter that was necessary for CircleCI. [Here are the instructions](https://circleci.com/docs/2.0/env-vars/) from CircleCI for basic setup of environment variables.

Before I go any further, I wanted to note that the rest of this post is assuming that you’re somewhat familiar with CircleCI. To get a more basic walkthrough I’d recommend reviewing my post on CircleCI [here](https://rhythmandbinary.com/2018/10/19/circle-ci/).

So for my project, I first took the Firebase Credentials and put them into environment variables in my CircleCI project (following the instructions above). The end result looked something like this:

- ![](/images/screen-shot-2019-01-11-at-5.36.11-am.png)

I also thought it was funny because they even note in the description how this could help to secure the use case of not putting the credentials in the repo.

Then back to my project, in order to do this you basically follow this model:

1.  Replace the actual variables with the key names listed above (i.e. “API_KEY”)
2.  Then write a shell script that uses the shell program **sed** or **awk** to replace the values
3.  Add a stage to your CirlceCI build that runs the shell program to set the values when the project is built
4.  When the project pipeleine is ran, after downloading the initial project from GitHub, the shell script will update the variables using the key values. The project is then built with the correct values and the credentials are never presented on GitHub

So the project I did this for was an Angular 7 project. The production environment file looks like this:

```js
export const environment = {
  production: true,
  firebase: {
    apiKey: "API_KEY",
    authDomain: "AUTH_DOMAIN",
    databaseURL: "DATABASE_URL",
    projectId: "PROJECT_ID",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MESSAGING_SENDER_ID",
  },
};
```

Then I have a shell script that loads the variables in that looks like this:

```bash
# !/bin/bash
# deploy_config.sh
# This script updates Firebase Environment Variables at deployment
# Note that sed on OSX and sed in Linux operate different ways
# with OSX you have to pass a dummy blank file with -i like 'sed -i "" <s command> <file>'

cd src/environments
sed -i 's/\(API_KEY\)/'$API_KEY'/' environment.prod.ts
sed -i 's/\(AUTH_DOMAIN\)/'$AUTH_DOMAIN'/' environment.prod.ts
sed -i 's/\(DATABASE_URL\)/'$DATABASE_URL'/' environment.prod.ts
sed -i 's/\(PROJECT_ID\)/'$PROJECT_ID'/' environment.prod.ts
sed -i 's/\(STORAGE_BUCKET\)/'$STORAGE_BUCKET'/' environment.prod.ts
sed -i 's/\(MESSAGE_SENDER_ID\)/'$MESSAGING_SENDER_ID'/' environment.prod.ts
cat environment.prod.ts
```

As you see in my comment, there are variations for **sed** depending on your OS. I ran across this when I got multiple errors for **sed** on my macbook (OSX) and then found I had a different set of issues when it deployed with Linux. The best thing to do would be to build a local Docker container that matches the one you’re using for deployment. Then SSH locally into that Docker container and setup this script.

In my CircleCI **config.yaml** I created the stage here right after the initial download but before the build:

```yaml
steps:
  - checkout
  - run:
      name: Show current branch
      command: echo ${CIRCLE_BRANCH}
  - run:
      name: copy deploy config script to root directory
      command: cp build_scripts/deploy_config.sh deploy_config.sh
  - run:
      name: load in environment variables
      command: ./deploy_config.sh
  - restore_cache:
      keys:
        - v1-dependencies-{{ checksum "package.json" }}
  - run:
      name: Install dependencies
      command: npm install
```

The last step would be to make sure your local environment also has the necessary environment variables. You can write another shell script that populates your local values when you do a build or modify the **gitignore** settings. I modified my git exclude file to not include my local environment setup, so I don’t have to worry about those values being sent to my repo and they always stay on my local machine. This article helped with that [here](https://hashrocket.com/blog/posts/ignore-specific-file-changes-only-on-current-machine-in-git).

Hope that helped you if you were trying to figure out how to secure your credentials. There are other ways to do this, but I found this was a very simple and easy way to secure my credentials with my CirlceCI build.
