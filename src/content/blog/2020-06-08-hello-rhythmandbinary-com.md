---
title: Rebuilding my Site with Netlify and Next.js
pubDate: 2020-06-08T16:33:06.079Z
snippet: "Recently I rebuilt this site using Netlify and Next.js and wanted to highlight some cool things I learned along the way. I was previously using WordPress, but decided I wanted to host"
heroImage: /images/rebuilt2.png
tags: ["react", "nextjs", "javascript", "netlify"]
---

> Please note that RhythmAndBinary.com no longer exists as of 08/14/2023. I have since moved the posts to [andrewevans.dev](https:///www.andrewevans.dev).

For quite some time now, I have wanted to rebuild my primary blogging site (www.rhythmandbinary.com) - I was previously using [WordPress](https://wordpress.com/), but decided I wanted to host my own content and have more control over the publishing process. And so finally, over the past few weeks, I have rebuilt this site using [Netlify](https://www.netlify.com/) and [Next.js](https://nextjs.org/) and wanted to highlight some cool things I learned along the way.

I chose Next.js because it has a lot of built in features that work well for static sites ([check out their blog site example here](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)). I also used Netlify because of the ease of their pipeline, and a lot of their built in features which make hosting and writing super fun.

## From Build to Publish

With Netlify, you get a super user friendly console to manage your site out of the box. You connect Netlify to your site's GitHub repo, and set up a pipeline that listens to your repo's master branch. Then whenever you merge a PR into master, Netlify will kickoff a build and deploy of your site. You can customize this for more specialized setups, but this feature alone took a lot of the trouble out of managing a pipeline. There are also a ton of great features with Netlify, I recommend [checking out their docs for more](https://docs.netlify.com/?_ga=2.172710187.965183352.1591624137-733159775.1589712148).

Since this site is a blog, I wanted some form of a CMS to make writing posts easier. After some googling I found [Netlify CMS](https://www.netlifycms.org/)! It works nicely alongside Netlify hosting, and comes with a WYSIWYG editor that you can easily access directly from your site. Whenever you write posts, Netlify CMS makes PRs directly to your GitHub repo. It even has a publish workflow so you can work on posts over time, rather than having to write everything down in one setting. If you setup the workflow option, whenever you "save" Netlify's CMS pushes a commit to the PR that it opened.

![netlify workflow](/images/screen-shot-2020-06-09-at-9.59.02-am.png)

![GitHub Commits](/images/screen-shot-2020-06-08-at-1.26.25-pm.png)

To get started, you just need to enable Netlify to have access to your project's GitHub repo, and then add an associated yaml file for Netlify to read to understand how to work with your site. To get this setup with Next.js is super easy, [check out Netlify's tutorial here](https://www.netlifycms.org/docs/nextjs/).

The end product of using both Netlify CMS and Hosting is this:

![netlify flow](/images/screen-shot-2020-06-08-at-2.10.40-pm.png)

The best part is that all of this is free and I still control all the source content. So you can actually edit posts directly in your project or through the editor.

## Moving Posts from WordPress to Here

I had over 50 posts on my previous WordPress site that I had to move over. To do this, I used a little bit of JavaScript magic and leveraged [the npm rss-parser package](https://www.npmjs.com/package/rss-parser) and [turndown](https://www.npmjs.com/package/turndown) to basically read the RSS feed from my old site and make new markdown files. Once the RSS feed was converted into markdown, I used RegEx to replace punctuation and a few things I saw when initially testing the program. Then I used the Node.js "fs" package to write markdown files locally line by line. This was important since I'm also using Netlify's CMS, I'd need each post to have some metadata at the top of each markdown file. Despite leveraging all of this automation, I still ended up having to take an afternoon of walking through all the posts and fixing indenting errors and various image issues. That being said, this little bit of automation really helped. Here's the program I wrote to make it happen:

```js
const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");
const TurndownService = require("turndown");
const turndownService = new TurndownService();
const striptags = require("striptags");

const callRSS = async (feedSource) => {
  const feedOutput = await parser.parseURL(feedSource);
  const output = feedOutput.items;
  return output;
};

const parseOutput = async () => {
  const feedSource = "https://rhythmandbinary.com/rss";
  const output = await callRSS(feedSource);
  return output;
};

const retrievePostsSaveMarkdown = async () => {
  const output = await parseOutput();

  output.forEach((post) => {
    // fileName
    const blankSpace = " ";
    const blankSpaceRegEx = new RegExp(blankSpace, "g");
    let fileName = post.title;
    fileName = fileName.replace(blankSpaceRegEx, "_");
    const singleColon = ":";
    const singleColonRegEx = new RegExp(singleColon, "g");
    fileName = fileName.replace(singleColonRegEx, "");
    fileName = fileName.replace(/,/g, "");
    fileName = fileName.replace(/\./g, "");
    fileName = fileName.replace(/[(.)]/gm, "");
    fileName = fileName.replace(/[(?)]/gm, "");
    fileName = fileName.replace(/[(!)]/gm, "");

    // title
    let title = post.title;
    title = title.replace(singleColonRegEx, "");

    // postDate
    const postDate = post.pubDate;

    // snippet
    let snippet = striptags(post["content:encoded"]);
    if (snippet.length > 200) {
      snippet = snippet.substring(0, 200);
    }
    const singleQuote = /(&#8217;)/gm;
    snippet = snippet.replace(singleQuote, "'");
    const leftQuote = /(&#8220;)/gm;
    snippet = snippet.replace(leftQuote, "");
    const rightQuote = /(&#8221;)/gm;
    snippet = snippet.replace(rightQuote, "");
    const imageSource = /(\(image source\))/gm;
    snippet = snippet.replace(imageSource, "");
    const multiSpace = /[\n]{2,}/gm;
    const multiSpaceRegEx = new RegExp(multiSpace, "g");
    snippet = snippet.replace(multiSpaceRegEx, "");

    // content
    const content = turndownService.turndown(post["content:encoded"]);

    fs.appendFileSync(`${__dirname}/../_posts/${fileName}.md`, "--- \n");
    fs.appendFileSync(`${__dirname}/../_posts/${fileName}.md`, " \n");
    fs.appendFileSync(
      `${__dirname}/../_posts/${fileName}.md`,
      `title: ${title} \n`,
    );
    fs.appendFileSync(
      `${__dirname}/../_posts/${fileName}.md`,
      `pubDate: ${postDate} \n`,
    );
    fs.appendFileSync(
      `${__dirname}/../_posts/${fileName}.md`,
      `snippet: \"${snippet}\" \n`,
    );
    fs.appendFileSync(`${__dirname}/../_posts/${fileName}.md`, "--- \n");
    fs.appendFileSync(`${__dirname}/../_posts/${fileName}.md`, `${content} \n`);
  });
};

retrievePostsSaveMarkdown();
```

## Generating my own RSS Feed

As part of my new site, I knew I wanted to have an RSS feed. RSS feeds are great for followers and also for times when you want to retrieve a copy of all the content easily. To do this, I actually leveraged the [getStaticProps()](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) method that came with Next.js.

One of the coolest part's of Next.js is that it prebuilds a site to optimize performance. So that means if you use Next.js for your site, you're given a set of APIs that are called only at build time. When building static sites, this is very powerful because it lets you orchestrate data using all of the features you have on your local filesystem. So for my RSS feed, I created an "/rss" route which would retrieve all of my posts locally and build an XML file which I can then share directly form my site ([see the Next.js docs on static file serving here](https://nextjs.org/docs/basic-features/static-file-serving)). This ended up looking somewhat like this:

```js
export async function getStaticProps() {
  const allPosts = getAllPosts(["title", "date", "slug", "content", "snippet"]);

  allPosts.forEach(async (post) => {
    unified()
      .use(markdown)
      .use(html)
      .process(post.content, function (err, file) {
        if (err) throw err;
        post.content = file;
      });
  });

  const XMLPosts = getRssXml(allPosts);
  saveRSSXMLPosts(XMLPosts);

  return {
    props: { XMLPosts },
  };
}
```

The specific file saving looks like this:

```js
export function saveRSSXMLPosts(XMLPosts) {
  const publicDirectory = join(process.cwd(), "public/rss.xml");
  fs.writeFileSync(publicDirectory, XMLPosts);
}
```

To do the actual building of the RSS feed I had to do a fair amount of googling. I found [this post super helpful](https://www.bergqvist.it/blog/2019/12/2/add-rss-feed-to-nextjs) in getting setup. I also used the [W3C official RSS feed site](https://validator.w3.org/feed/) to verify that my XML file was compliant with the standard (it is!).

![RSS Validator](/images/screen-shot-2020-06-08-at-1.45.51-pm.png)

## Custom Navigation

I also built my own paging with custom navigation. I highlight this because it took quite a while to get the paging to work correctly. I know there are a lot of packages that have paging components, but I wanted to write my own. Doing this took a little bit of magic to manage finding the location and "page" of posts. I also made it responsive so that it looked good both in mobile and desktop views. To actually build my pages, I also used the "getStaticProps()" method that I mentioned earlier, and then built a local array that the main page on the site uses. The end result was a nice little set of page buttons:

![custom navigation on page](/images/screen-shot-2020-06-09-at-10.11.20-am.png)

## Liking Posts

With my new site, I wanted a way for readers to "like" posts. So to do this I actually built a whole API with Firebase to save likes for each post. This was pretty straightforward. Just go to the little heart at the bottom of each post to see it in action.

![Like Picture](/images/screen-shot-2020-06-08-at-2.21.25-pm.png)

## Some Other Cool Features

In addition to the features I've highlighted:

- I added a search feature that searches both the titles and content of my posts (using the standard JS filter method)
- I made the site fully responsive. Special thanks to Mrs. Natalie Evans (my wife and best post reviewer around) for doing design reviews with me.
- I made use of SCSS maps wherever possible. This was super helfpul as I was building the site's theme and also making it responsive.
- Setup Google Analytics with regular reports. Next.js had a great example in [their GitHub repo that got me going](https://github.com/vercel/next.js/tree/canary/examples/with-react-ga).

## Closing Thoughts

So I will be using this new site as my primary blog platform from now on. Building my own site was quite an undertaking, but it is really cool to be able to say you built your own setup. From here, just follow this site and stay tuned for new posts. You can also feel free to contact me on [andrewevans.dev](https://andrewevans.dev/). Thanks again for reading my post!
