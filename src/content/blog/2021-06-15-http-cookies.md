---
title: HTTP Cookies
pubDate: 2021-06-15T04:04:47.029Z
snippet: "Recently I had to do some work with HTTP cookies and wanted to write a
  brief post on what I learned. I've used cookies off and on for different
  projects "
heroImage: /images/cookies-1886760_1920.jpg
tags: ["web development"]
---

Recently I had to do some work with [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) and wanted to write a brief post on what I learned. I've used cookies off and on for different projects over the years, and find them still very useful for different projects.

## What are HTTP Cookies

HTTP Cookies are a mechanism for servers to send the browser information for the purposes of things like session management or even location information. Cookies have been around since the 1990s and have survived multiple iterations and developments in the world of web development. You have several options when working with cookies and can limit what you store and make them more or less secure. If you'd like to learn more about the history of Cookies I recommend checking out the wiki page at https://en.wikipedia.org/wiki/HTTP_cookie#History.

## How to use cookies

What I learned in my project was that cookies are "domain driven." This means that they (by design) are only supposed to be used by the domain that creates them. This is somewhat of a security mechanism in that it prevents users from other domains from being able to retrieve them. There are a lot of issues with Security and Cookies that I'm not going to discuss here. However, when done properly, cookies can be a great asset to any project.

Two things that I made the mistake of in my project was (1) not paying attention to the domain and (2) not realizing that the "payload" of a cookie is actually a key value pair.

When you save a cookie, the value that you get back will actually look something like the following:

```bash
name=oeschger; favorite_food=tripe; test1=Hello; test2=World; reader=1; doSomethingOnlyOnce=true
```

To create or read a cookie you can use the `document.cookie` object in your JavaScript and HTML, you could do something like the following:

```js
// example was copied from the Mozilla page at
// https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie

document.cookie = "name=oeschger; SameSite=None; Secure";
document.cookie = "favorite_food=tripe; SameSite=None; Secure";

function showCookies() {
  const output = document.getElementById("cookies");
  output.textContent = "> " + document.cookie;
}

function clearOutputCookies() {
  const output = document.getElementById("cookies");
  output.textContent = "";
}
```

```html
// example was copied from the Mozilla page at //
https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie

<button onclick="showCookies()">Show cookies</button>

<button onclick="clearOutputCookies()">Clear</button>

<div>
  <code id="cookies"></code>
</div>
```

You can do quite a bit with cookies including:

- setting it to expire
- restricting access to a specific domain
- setting a max age
- refreshing it
- forcing it to use a secure protocol (https)

In my case, I spent about a half hour trying to get a cookie to be read only to realize I was running a site locally (localhost) and the cookie had been set by another domain. In my Chrome Devtools I changed the domain to `localhost` and then was able to read the cookie just fine.

## Closing Thoughts

I hope you enjoyed this very brief post. I just wanted to write down a few things I learned along the way of using cookies. There's a lot more that you can do with cookies. If you'd like to learn more, I recommend reading more on the [Mozilla Page](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie).
