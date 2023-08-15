---
title: Sharing Websites with Social Media Meta Tags
pubDate: 2020-06-11T14:21:29.491Z
snippet: >-
  As I've been setting up my newly built rhythmandbinary.com site, I learned
  about the role that meta tags have in sharing on social media.
heroImage: /images/social_media.jpg
tags: ["web development"]
---

As I've been setting up my newly-built rhythmandbinary.com site, I learned about the role that meta tags have in sharing on social media.

Being a WordPress user previously, this was basically taken care of for me. Having a custom-built site, I found out that I'd need to do this for myself.

This post is going to cover some things I learned about meta tags, and how to properly use them for sharing websites on modern social media sites.

## What is a meta tag?

Meta tags are an old part of the HTML standard ([check out this article for more](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)). They provide additional data that webcrawlers and other sites can use when interacting with web pages. The wiki page also provides a good amount of [information here](https://en.wikipedia.org/wiki/Meta_element).

With modern social media sites like LinkedIn and Twitter, there are specific meta tags that determine how shared links are previewed and displayed. This is particularly important when considering your site's brand and how you want it to appear when you share it etc.

Modern social media sites also make use of the [Open Graph Protocol meta tags](https://ogp.me/) to display additional content when links are shared.

Since I had built my site custom, I found out quickly that I'd need to set this up for my pages so they are shown correctly when sharing. The end result was that I spent an evening learning about meta tags and playing with the different options. In the next sections, I'm going to cover some things I did, and ways you can also get this to work for your custom site.

## Meta Tags for Twitter

Twitter has its own set of meta tags that it uses with your site. They have a nice set of docs around this, and include a [validator page](https://cards-dev.twitter.com/validator) that lets you verify your site.

For my site, I used the "summary large image" card that can be [seen here](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/summary-card-with-large-image).

As you can see from the example code, they suggest you use the following to get started:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@nytimes" />
<meta name="twitter:creator" content="@SarahMaslinNir" />
<meta name="twitter:title" content="Parade of Fans for Houston’s Funeral" />
<meta
  name="twitter:description"
  content="NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here."
/>
<meta
  name="twitter:image"
  content="http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-articleLarge.jpg"
/>
```

> this example was copied from the [docs here](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/summary-card-with-large-image).

When I tested this with my site, I found that I basically just needed the following:

- `twitter: title`
- `twitter: description`
- `twitter: image`
- `twitter: card`
- `twitter: site`

The end result was that when you share posts, I can pull in a description of the page I'm sharing along with a nice cover image and title.

The result of setting up these meta tags is that your Tweets look like this:

![](/images/screen-shot-2020-06-11-at-11.02.18-am.png)

## Meta Tags for LinkedIn

LinkedIn makes use of the Open Graph Protocol and has some [basic guidelines for sharing](https://www.linkedin.com/help/linkedin/answer/46687/making-your-website-shareable-on-linkedin?lang=en).

According to their docs they require:

```html
<meta property='og:title' content='Title of the article"/>
<meta property='og:image' content='//media.example.com/ 1234567.jpg"/>
<meta property='og:description' content='Description that will show in the preview"/>
<meta property='og:url' content='//www.example.com/URL of the article" />
```

> this example was copied from the [docs here](https://www.linkedin.com/help/linkedin/answer/46687/making-your-website-shareable-on-linkedin?lang=en)

In addition to these meta tags in the example, I also found the need for an "image" tag specifically like this:

```html
<meta name="image" content="https://rhythmandbinary.com/home.jpg" />
```

LinkedIn also has a nice [validation tool](https://www.linkedin.com/post-inspector/) that you can use to make sure your meta tags are correct for sharing.

The result of using these meta tags is that your LinkedIn posts look like this:

![](/images/screen-shot-2020-06-11-at-11.02.41-am.png)

## Meta Tags for Next.js Sites

So this was all great, and got me started. However, I quickly found out that I'd need a way to override the tags for pages since my site has blog posts. I couldn't use the same tags for all the pages, because when users share my posts I'd need to have the specific title and image etc.

So to achieve this I made use of the Next.js [Head element](https://nextjs.org/docs/api-reference/next/head) that is built-in with the framework. This basically lets you customize what you want in the `<head>` block of each page.

So for the page on my Next.js site that I use specifically for posts, I pull in some elements from the post object like this:

```js
import Head from "next/head";

const Post = ({ post }) => {

  return (
    <main>
      <Head>
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.snippet} />
        <meta
          name="twitter:image"
          content={`https://rhythmandbinary.com${post.heroImage}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rhythmandbinary" />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:image"
          content={`https://rhythmandbinary.com${post.heroImage}`}
        />
        <meta property="og:description" content={post.snippet} />
        <meta
          property="og:url"
          content={`https://rhythmandbinary.com/post/${post.slug}`}
        />
        <meta
          name="image"
          content={`https://rhythmandbinary.com${post.heroImage}`}
        />
      </Head>
```

If you notice here, I'm setting the title, description, etc. on the fly based on values that I pull in from the component.

For the remainder of the pages, I created a custom "PageHead" component that I can just pull in so that the rest of the pages (i.e. about, home, etc.) have a uniform appearance.

That looked like this:

```js
import Head from "next/head";

const PageHead = () => {
  const title = "your tittle goes here";
  const description = "your description goes here";
  const image = "the actual cover image goes here";
  const twitterCard = "type of twitter card you want to use";
  const twitterSite = "twitter handle you want associated with the share";
  const url = "actual site url to link shares back to";

  return (
    <Head>
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="image" content={image} />
    </Head>
  );
};

export default PageHead;
```

## Closing Thoughts

So this all was a big learn with regards to ways you can customize your site when it is shared. With the large presence of social media today, it makes sense for this to be an important part of any website.

In addition, I didn't mention issues I had with images. Both Twitter and LinkedIn have specific requirements for images. The links I've shared above point to the different requirements that you'd need.

I also noticed that Microsoft Teams was hit or miss with all of this. I wasn't able to find good documentation specific to meta tags for teams, but I think generally speaking it seems if the Open Graph Protocol tags I mentioned are there then it will work.

In the process of working through all of this, I found two additional resources super helpful:

1. [Social media cards with Vue and Gridsome](https://timdeschryver.dev/blog/gridsome-social-cards) by [Tim Deschryver](https://timdeschryver.dev/).
2. [The Essential Meta Tags for Social Media](https://css-tricks.com/essential-meta-tags-social-media/) by Adam Coti.

I hope you enjoyed this post and learned something in the process. Thanks for reading, like my post here and follow me at [andrewevans.dev](https://www.andrewevans.dev).
