---
title: building a blog with astro
pubDate: 2023-08-15T20:11:24.193Z
snippet: "Recently I've been reviewing some Algorithms, and was specifically looking at ways to search a Graph with Depth First Search (DFS). I thought it was  kinda cool and wanted to"
heroImage: /images/ASTRO.jpeg
tags: ["astro", "react"]
---

This week I finished writing my new blog site here at [andrewevans.dev](https://andrewevans.dev). I decided to write it with [astro](https://astro.build/) and wanted to share what I did and some things I learned a long the way. You can check out the source code for this site at [https://github.com/andrewevans0102/andrew-evans-dev-v2](https://github.com/andrewevans0102/andrew-evans-dev-v2). In addition to this post, I recommend checking out [the astro getting started docs](https://docs.astro.build/en/getting-started/) for more.

## What is Astro?

At a high level astro is a static site generator. What makes it unique is that it does "partial hydration" of the output HTML, CSS, and JS files that compose a bundle. This basically means that the output mostly consists of static content that is highly performant in web browsers, and clientside JavaScript only runs where it's needed.

Under the hood, astro also uses [Vite](https://vitejs.dev/) for packaging and building the project. This enables a very performant and quick feedback loop when doing development.

Astro's docs describe this approach as a Multi-Page Application (MPA) instead of a Single Page Application (SPA). The idea being that instead of having JavaScript handle the page transitions, etc. the site rendering is handled server side wherever possible. So each page is an HTML request, vs compiled JavaScript that rerenders the DOM in place. The other big thing about the way this works is that the runtime is JavaScript, so there's no need for tooling like Ruby, PHP or others. So if you're a developer and familiar with HTML, CSS, and JS then you can get going very quickly with an astro project.

Another feature that makes astro powerful is the concept of "Islands." Taking an image from the astro docs:

![astro islands](/images/ASTRO_ISLANDS.jpg);

The idea is that the components are encapsulated so that you can generate a site with components from different Frameworks or Libraries like React, Svelte, and Vue....but all in the same project. Astro has packages it uses for integrations of these different Frameworks and Libraries, and you just import those into your project.

To get started building with astro, just go to [astro.build](https://astro.build) and use one of the starter templates. You could also use one of the various npx commands to generate a new site fresh with a template like the following:

![astro template](/images/ASTRO_TEMPLATE.jpg)

## Astro Project Layout and Integrations

Astro also includes a file based routing approach.

![astro routing](/images/ASTRO_ROUTING.jpg)

Other features include support for:

- Sitemap generation
- RSS generation
- Markdown to HTML conversion (Frontmatter)
- PWA support
- Service Workers
- Much more

You do the majority of the integration to support these features in the `astro.config.mjs` file that is created when you build a project:

![astro integration](/images/ASTRO_INTEGRATION.jpg)

In this picture you see on the left the config file, in the middle are components (note the `.tsx` and `.astro` components alongside each other), and to the right is an astro component that includes a React component that runs clientside (note the use of `client:only="react"`).

The actual project is very similar to a traditional React, Vue, or Svelete project with a `public` folder for assets and a `src` folder for your components.

![astro component](/images/ASTRO_COMPONENT.jpg)

You'll note on the left is the project and the right is an astro component. The components have a section for importing components and creating local variables, then a "view" area for your HTML and even a section for CSS.

When the project is built, the pages end up looking like the following:

![astro page](/images/ASTRO_PAGE.jpg)

## How I built my site
