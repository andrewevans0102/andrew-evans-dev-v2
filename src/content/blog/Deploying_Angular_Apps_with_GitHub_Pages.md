---
title: Deploying Angular Apps with GitHub Pages
pubDate: 2019-01-05T13:27:27.000Z
snippet: "Today I was playing with GitHub pages for an app I was working on and wanted to write about it.I originally used GitHub pages last year, but back then people were saying that it had limited r"
heroImage: /images/screen-shot-2019-01-05-at-8.11.13-am.png
tags: ["angular"]
---

Today I was playing with GitHub pages for an app I was working on and wanted to write about it.

I originally used GitHub pages last year, but back then people were saying that it had limited resources and could just do static hosting. Today I found out that they were wrong! It is totally possible to host your Angular App with GitHub pages. I’m going to walkthrough my experience.

For reference, the app that I’m going to be talking about can be viewed [here](https://andrewevans0102.github.io/angular-telegraph/). The source code for this app can also be viewed [here](https://github.com/andrewevans02/angular-telegraph).

So the app that I’m working with is Angular 7. There are differences based on versions before 6 (and obviously just using AngularJS).

I’m using the NPM package [angular-cli-ghpages](https://www.npmjs.com/package/angular-cli-ghpages).

First go ahead and do an install globally with:

```bash
npm install -g angular-cli-ghpages
```

You don’t have to do this, but it helps just to have it globally. I also went ahead and installed it locally to my project with:

```bash
npm i angular-cli-ghpages --save-dev
```

Now with that installed, its just a matter of (1) building your project and then (2) uploading it to GitHub pages.

As I mentioned in the intro, the version of Angular makes a difference based on what you’re trying to do. For Angular 7 I needed to make sure that the base URL that is used by Angular was set to what GitHub pages will use for any pages and assets.

The basic convention for this new baseURL is:

```bash
https://<user-name>.github.io/<repo>/
```

I created an NPM script for my project for this command, but my “build” command ended up looking like this:

```bash
ng build --prod --base-href https://andrewevans0102.github.io/angular-telegraph/
```

Once you’ve got it built, now its just a matter of deploying. The docs on the angular-cli-ghpages site say just to use the npx command. For Angular 7 you also need to specify the “dist” directory since thats what the “ng build –prod” puts the packaged code in. Earlier versions of Angular didn’t have this requirement.

So for my project I also created an NPM script for the “deploy” phase and it looked like the following:

```bash
npx ngh --dir=dist/angular-telegraph
```

So once you do that you should be able to view your page at a URL similar to the following:

```bash
https://<username>.github.io/<repo>/
```

I also found I had some issues with images. The app that I’m working with is small and only has 1 image, but in my Angular Component I was making the “img” element source go directly to where it was in the project (i.e. “../../some/place.png” instead of just using the relative “./” locator. In doing some Googling I found a lot of people had similar issues. Most of the time it was literally just needing to remove a backslash or something. These type of errors are easily debugged since the GitHub page is just pulling the code files directly from your repo.

When you push the code into GitHub pages a branch **gh-pages** is created which is where you can see the code that is deployed. Having this custom branch makes it easy to see and resolve location errors.

Hopefully this post helped you get started with GitHub pages and Angular. I used the following two pages for help:

- [Alligator IO](https://alligator.io/angular/deploying-angular-app-github-pages/)
- [Stack Overflow](https://stackoverflow.com/questions/42465667/github-pages-images-not-showing)
