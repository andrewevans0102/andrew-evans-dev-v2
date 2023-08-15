---
title: creating aliases with npm
pubDate: 2021-12-08T17:04:15.666Z
snippet: I recently ran into a situation where a CICD pipeline was breaking
  because of an npm dependency. This is a common issue in web development as
  packages become deprecated or you're forced to use an older version to be
  compliant with some enterprise requirements.  To fix the issue I used an npm
  alias. I thought this was super cool
heroImage: /images/masterchief-and-the-arbiter.png
tags: ["javascript", "cicd"]
---

> [The cover image was copied from here](https://preview.redd.it/9ze1450305221.png?auto=webp&s=d56dd4d214af9a62b078d55c33018c464f8b555e). In honor of today's release of [Halo Infinite](https://www.xbox.com/en-US/games/halo-infinite), the pictures in this post are all from Halo.

I recently ran into a situation where a CICD pipeline was breaking because of an npm dependency. This is a common issue in web development as packages become deprecated or you're forced to use an older version to be compliant with some enterprise requirements.

To fix the issue I used an npm alias. I thought this was super cool and so this post is going to briefly cover how it works.

## The issue with the dependency

So before I go into how it works, I wanted to explain the problem/ I was using an older version of a dependency that had been deprecated. This hadn't been an issue before, but my Continuous Integration Continuous Deployment(CICD) runner changed its version of NodeJS and this made the package fail. Fortunately, some quick googling found that I could use an upgraded package, but I had steps in a custom webpack setup that were set to using the older package. So to fix this, I created an alias!

![Masterchief getting ready to install aliases](/images/masterchief-halo.jpg)

> [Halo image copied from here](https://i.ytimg.com/vi/nD_Qm6TFszY/maxresdefault.jpg).

## What is an npm alias

If you use npm, you'll know there are a lot of different features that you can use when installing and building your projects.

Npm aliases are when you install a package, but with an aliased name. So this means you can install the package, but instead of using the standard npm name, you can use your own!

To do this, you just run the following when doing your install:

```bash
npm install <ALIAS_NAME>@npm:<REAL_PACKAGE>@<PACKAGE_VERSION>
```

Here obviously the `ALIAS_NAME` is how you reference it in your code, and then the `REAL_PACKAGE` is the actual npm package you are installing.

So in our case, what I did was install the newer package under an alias for the older one. This made it so we didn't have to change any code in our webpack setup.

One other good reason for using aliases is when you want to install an upgraded package, but want to test it first. If you install a newer version of the same package under an alias, then you can reference both old and new packages in your code. [This specific example can be seen on egghead.io with a video at this link](https://egghead.io/lessons/javascript-install-multiple-versions-of-the-same-package-in-npm-with-package-aliases).

## Example of it in action

![Masterchief and Cortana discussing npm aliases](/images/masterchief-cortana.jpg)

> [Halo image was copied from here](https://www.windowscentral.com/sites/wpcentral.com/files/styles/xlarge/public/field/image/2021/06/chief-and-the-weapon.jpg).

So I wanted to finish out this post with an example. Since we're getting close to Christmas I thought it'd be fun to use a Christmas npm package called [days-until-christmas](https://www.npmjs.com/package/days-until-christmas). This package basically just calculates the days until Christmas and then prints them to your console. I have a copy of this example in my GitHub repo [npm-alias](https://github.com/andrewevans0102/npm-alias);

So to start with, the "days-until-christmas" package that was originally installed was version `1.1.2`. If you go check npm, you'll see that the newest version of this package is `1.1.3`.

So before we upgrade the package, lets test the new upgrade with an alias.

To do this, you can install the newer version with the following:

```bash
npm install days-until-christmas-next@npm:days-until-christmas@1.1.3
```

If you open your `package.json` file you'll see that the newer version is installed alongside the original:

![package json file with dependencies](/images/2021-12-06_14-27-15.png)

Now in our code, we can reference both the old and new packages by just importing them (in this case I'm using "require" since its just a standalone JS file).

```js
const daysUntilChristmas = require("days-until-christmas");
const daysUntilChristmasNext = require("days-until-christmas-next");

console.log("counting the days until Christmas with the original package");
console.log(daysUntilChristmas());
console.log("counting the days until Christmas with the new package");
console.log(daysUntilChristmasNext());
```

If you run this with `node HelloAlias.js` you'll see the following:

![program running with npm alias in place](/images/2021-12-06_14-29-38.png)

Now you can go ahead and uninstall the older version and reinstall the newest version to finish out the upgrade.

## Wrapping Up

![Mastercheif finished with npm aliases](/images/masterchief.jpg)

> [Halo image copied from here](https://c4.wallpaperflare.com/wallpaper/595/336/1021/halo-infinite-silhouette-hd-wallpaper-preview.jpg)

I know this post was relatively short, but it covers the basic concept and shows you a real example of how this works. I think npm aliases are really useful, and will definitely remember this in the future.

Thanks for reading my post! Follow me [@AndrewEvans0102](https://twitter.com/AndrewEvans0102) and at [andrewevans.dev](https://www.andrewevans.dev).
