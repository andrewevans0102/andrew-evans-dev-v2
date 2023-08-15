---
title: Wines with ReyRey!
pubDate: 2021-04-20T15:22:01.055Z
snippet: "Over the past few months, I've been working on a fun side project that
  is for anyone that is a fan of wine. I built an Angular Progressive Web App
  (PWA) that "
heroImage: /images/home.jpg
tags: ["angular", "firebase"]
---

Over the past few months, I've been working on a fun side project that is for anyone that is a fan of wine. I built an Angular Progressive Web App (PWA) that I call "Wines with ReyRey." The app is optimized for the `Apple iPhone`, but it should render well on most mobile devices. It's a fun combination of my love of wine and my cat Rey (we call her ReyRey). It's live and you can use it at [wineswithreyrey.com](https://www.wineswithreyrey.com).

The basic premise of the app is that you can store (and share) information about wines that you like. Once you create an account, you can log and edit wines and even include a picture.

![Cover](/images/screen-shot-2021-04-20-at-11.51.32-am.png)

![record wine](/images/b.jpg)

You can also share the wine via [Twilio](https://www.twilio.com/) using the share feature.

![Text Message](/images/screen-shot-2021-04-20-at-12.15.24-pm.png)

This post is going to introduce the app, and also talk about some of the cool technical things I did along the way. If you'd like to see the source code, it is open source under the MIT license and available at <https://github.com/andrewevans0102/reys-wines>.

I've also created a YouTube video that showcases the app at the following:

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/urC7mZpIRKA/0.jpg)](https://www.youtube.com/watch?v=urC7mZpIRKA)

## Its a JAMstack

I built the app with Angular and Firebase. I used the [angularfire](https://github.com/angular/angularfire) library to connect with [Firebase](https://firebase.google.com/). This was a good implementation of a "JAMstack" which is:

1. Javascript
2. APIs
3. Markup

The cool part about JAMstack application is that you don't have to go through building a backend. Rather you can rely on a cloud provider (in my case it was Firebase) and just make API calls with tokens (or other auth means).

I specifically made use of [Firebase Authentication](https://firebase.google.com/docs/auth), [Firestore Database](https://firebase.google.com/docs/firestore), and [Firebase Storage](https://firebase.google.com/docs/storage). I wrapped them all in a service class so I could just inject the services in pages or components where necessary.

Firebase Authentication:

```js
    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private popupService: PopupService,
        private storageService: StorageService
    ) {
        afAuth.authState.subscribe(async (user) => {
            this.loginUID = user.uid;
            this.originalWine = await this.storageService.retrieveWines(
                this.loginUID
            );
            this.wineSaved = this.originalWine;
            this.authToken = await user.getIdToken();
        });
    }
```

Firestore Database:

```js
    constructor(
        private firestore: AngularFirestore,
        private storage: AngularFireStorage,
        private popupService: PopupService,
        private router: Router,
        private starsService: StarsService
    ) {}

    async saveWine(wine, loginUID) {
        if (wine.id === null) {
            throw new Error('id was not found');
        }
        const wineDocument = this.firestore.doc<any>(`user/${loginUID}`);
        const wineCollection = wineDocument.collection<any>('wine');
        await wineCollection.doc(wine.id).set(wine);
    }
```

Firebase Storage:

```js
const task = this.storage.upload(wine.winePicture, selectedFile);
task
  .snapshotChanges()
  .pipe(
    finalize(async () => {
      this.saveWine(wine, loginUID);
    }),
  )
  .subscribe();

const saveTask = task.percentageChanges();
saveTask.subscribe(
  (percentage) => {
    showPercent = Math.floor(percentage);
  },
  (error) => {
    this.popupService.showMessage(error.message);
  },
  () => {
    selectedFile = null;
    this.popupService.showMessage("Wine save was successful!");
    this.back();
  },
);
return saveTask;
```

## Connecting with Twilio

I used Twilio to be able to let users share wines via text message. I did this with a [Firebase Cloud Function](https://firebase.google.com/docs/functions).

Using the Twilio APIs this was pretty straightforward. I just passed in the wine information and then built a message and sent it (including a picture).

```js
const message =
  "🍷 🍷  Wines with ReyRey! 🐈 🐈" +
  "\n \n" +
  `${userProfile.data().firstName} ${userProfile.data().lastName} \n` +
  "is sharing the following wine with you:" +
  "\n \n" +
  `Name: ${wineName}` +
  "\n \n" +
  `Location Purchased: ${locationPurchased}` +
  "\n \n" +
  `Rating: ${stars}` +
  "\n \n" +
  `Notes: \n` +
  `${notes}` +
  "\n \n" +
  "and checkout the above image too!";

const clientRequest = {
  body: message,
  from: process.env.TWILIO_PHONE,
  mediaUrl: [downloadURL],
  to: phone,
};

await client.messages.create(clientRequest);
```

## Angular PWA

As I mentioned, this app is a PWA. I followed the [Angular Docs](https://angular.io/guide/service-worker-getting-started) and also built a small event listener to determine if you were online or not.

```js
    ngOnInit(): void {
        window.addEventListener(
            'online',
            this.onNetworkStatusChange.bind(this)
        );
        window.addEventListener(
            'offline',
            this.onNetworkStatusChange.bind(this)
        );
    }

    onNetworkStatusChange() {
        this.offline = !navigator.onLine;
        console.log('offline ' + this.offline);
    }
```

![Offline Message](/images/screen-shot-2021-04-20-at-12.16.25-pm.png)

I also found [this article on the okta developer site](https://developer.okta.com/blog/2019/01/30/first-angular-pwa#monitor-your-networks-status) super helpful.

## CICD with GitHub Actions

I also built a GitHub action in my project for deployment. I made it very simple, and plan to add some tests and additional steps in future additions. I leveraged the project secrets, and dynamically pull in everything and build on pushes to `master`. This is a pretty common pattern, and I found working with GitHub actions to be a lot of fun.

```yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [12.x]
    env:
      RW_PROJECT_ID: ${{ secrets.RW_PROJECT_ID }}
      RW_API_KEY: ${{ secrets.RW_API_KEY }}
      RW_AUTH_DOMAIN: ${{ secrets.RW_AUTH_DOMAIN }}
      RW_DATABASE_URL: ${{ secrets.RW_DATABASE_URL }}
      RW_STORAGE_BUCKET: ${{ secrets.RW_STORAGE_BUCKET }}
      RW_MESSAGING_SENDER_ID: ${{ secrets.RW_MESSAGING_SENDER_ID }}
      RW_APP_ID: ${{ secrets. RW_APP_ID }}
      RW_MEASUREMENT_ID: ${{ secrets.RW_MEASUREMENT_ID }}
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm run environment
      - run: npm install
      - run: npm run build
      - run: npm install -g firebase-tools
      - run: firebase deploy --only hosting --token ${{ secrets.FIREBASE_TOKEN }}
```

## Closing Thoughts

So this is basically just a quick intro to my app. If you get a chance, please check it out at [wineswithreyrey.com](https://www.wineswithreyrey.com). It has been a lot of fun to build, and we've enjoyed getting to share it with family and friends.
