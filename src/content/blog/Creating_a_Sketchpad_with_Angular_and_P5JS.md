---
title: Creating a Sketchpad with Angular and P5JS
pubDate: 2019-11-05T17:47:52.000Z
snippet: "There are a lot of great frameworks that provide animation and drawing capabilities with software today.  I was recently working with P5JS and wanted to share some cool things I learned a long th"
heroImage: /images/brush.jpg
tags: ["angular"]
---

There are a lot of great frameworks that provide animation and drawing capabilities with software today. I was recently working with [P5JS](https://p5js.org/) and wanted to share some cool things I learned a long the way.

This post is going to cover how to build an Angular Project with P5JS. I’m going to walkthrough creating a basic sketchpad, and also discuss some cool things that you can do in your own applications.

Here is the application I’m going to cover:

[![](https://img.youtube.com/vi/gJ50_FGEeKA/0.jpg)](https://www.youtube.com/watch?v=gJ50_FGEeKA)

I’m also using Angular for this post, but P5JS can be used in any JavaScript framework. I just used Angular here because I’m a fan.

I’m also going to be referencing [my GitHub project here](https://github.com/andrewevans0102/angular-sketchpad). I recommend doing a `git clone` and following along for reference.

You can also view the [project on Stackblitz here](https://stackblitz.com/edit/angular-sketchpad1).

## So what is P5JS?

[P5JS](https://p5js.org/) is a JavaScript library that was built as a successor to the [Processing project](https://processing.org/) that was orginally started by [Casey Reas](https://en.wikipedia.org/wiki/Casey_Reas) and [Ben Fry](https://en.wikipedia.org/wiki/Ben_Fry) at MIT. “Processing” refers to the language and the editor that you can use to directly interact with (and create) projects. The “Processing” language is Java, but there are additional versions in different languages. The Processing Language sits on top of media libraries, and a lot of core functionality that was traditionally very hard to work with. Processing makes it easier for Artists and people not as familiar with technical stacks, to build really awesome graphical displays and artwork.

![](https://atevans85.files.wordpress.com/2019/11/screen-shot-2019-11-05-at-12.03.26-pm.png?w=855)

The processing site has [a lot of great tutorials](https://processing.org/tutorials/) that cover everything from getting started to building advanced artwork. The Processing language has support for visual elements as well as sound.

I was originally introduced to Processing while I was doing my Masters in Computer Science at Christopher Newport University. For my class I used processing to build a custom implementation of Photoshop as well as some other projects.

P5JS is the JavaScript variant of processing, and does most of the same capabilities as the Processing language. For this post I’m going to focus on P5JS, but I encourage you to check out the Processing site and associated documentation.

Both Processing and P5JS are structured around two different methods:

1.  Setup
2.  Draw

There are also additional methods that you can run to catch certain stages in your application (i.e. before the app loads etc.).

The **setup** method basically creates your application and does the initial bootstrapping. The **draw** method is called continually as your application pages and literally repaints the screen.

In P5JS this would look like this:

```js
function setup() {
  createCanvas(640, 480);
}

function draw() {
  ellipse(50, 50, 80, 80);
}
```

This is super basic, but basically creates a canvas 640px X 480px and just draws an ellipse. The output should look similar to the following:

![canvas has a circle of width and height 50 at position 80 x and 80 y](/images/first-sketch.png)

Full disclosure, I copied the above example from the [P5JS getting started page](https://p5js.org/get-started/). However, this gives you the general idea of how this works.

## How to get started?

So, to get started with P5JS is actually really simple. You really just need an HTML file and a downloaded copy of the P5JS library. The [getting started page here](https://p5js.org/get-started/) has the basic setup with examples. As I said in the intro, I’m going to be using Angular for my project. The Angular setup requires a few extra steps but its not very difficult.

Please refer to my [project here](https://github.com/andrewevans0102/angular-sketchpad) as I’m going to be walking through that starting now. You can also just follow the steps I walkthrough here and refer to my project to see the expected “final state”.

So to use P5JS go ahead and create an Angular project. I use the [Angular CLI](https://cli.angular.io/) with `ng new`. **Make sure to say “yes” when the CLI asks to enable routing**.

Once you’ve got a “hello world” project ready to roll, install a “home page” and a “page not found” component with the following:

```bash
    ng g c home-page
    ng g c page-not-found
```

Now just do some basic setup with the provided router (app-routing.module.ts):

```js
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomePageComponent } from "./home-page/home-page.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

const routes: Routes = [
	{ path: "home-page", component: HomePageComponent },
	{ path: "", redirectTo: "/home-page", pathMatch: "full" },
	{ path: "**", component: PageNotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
```

Here I’m just doing the basics, pointing the default page to “home-page” and catching anything else with the “page-not-found”.

Now install P5JS with the following:

```bash
    npm i p5
```

Optionally, you can also use bootstrap. I’m using it for styling so install that with:

```bash
    npm i bootstrap
```

Then, go over to your `styles.scss` file and add the following:

```scss
@import "~bootstrap/dist/css/bootstrap.css";
```

Now, you’ve got everything setup so lets create our sketch and component!

## Your Sketch

So now, our application has a `home-page` component and a `page-not-found` component. When we’re finished you should have something that looks like the following:

![](/images/screen-shot-2019-11-05-at-12.38.43-pm.png)

To start with, we need to define a sketch. Let’s go over to the `home-page` component and add the following to the `ngOnInit` method:

```js
// this sketch was modified from the original
// https://editor.p5js.org/Janglee123/sketches/HJ2RnrQzN
const sketch = (s) => {
  s.setup = () => {
    let canvas2 = s.createCanvas(s.windowWidth - 200, s.windowHeight - 200);
    // creating a reference to the div here positions it so you can put things above and below
    // where the sketch is displayed
    canvas2.parent("sketch-holder");

    s.background(255);
    s.strokeWeight(this.sw);

    this.c[0] = s.color(148, 0, 211);
    this.c[1] = s.color(75, 0, 130);
    this.c[2] = s.color(0, 0, 255);
    this.c[3] = s.color(0, 255, 0);
    this.c[4] = s.color(255, 255, 0);
    this.c[5] = s.color(255, 127, 0);
    this.c[6] = s.color(255, 0, 0);

    s.rect(0, 0, s.width, s.height);

    s.stroke(this.c[this.strokeColor]);
  };

  s.draw = () => {
    if (s.mouseIsPressed) {
      if (s.mouseButton === s.LEFT) {
        s.line(s.mouseX, s.mouseY, s.pmouseX, s.pmouseY);
      } else if (s.mouseButton === s.CENTER) {
        s.background(255);
      }
    }
  };

  s.mouseReleased = () => {
    // modulo math forces the color to swap through the array provided
    this.strokeColor = (this.strokeColor + 1) % this.c.length;
    s.stroke(this.c[this.strokeColor]);
    console.log(`color is now ${this.c[this.strokeColor]}`);
  };

  s.keyPressed = () => {
    if (s.key === "c") {
      window.location.reload();
    }
  };
};

this.canvas = new p5(sketch);
```

So what is this doing? Well this is basically the whole sketch!

Notice in the first part, I create a `sketch` object and define the `setup` method with the following:

```js
        const sketch = s => {
          s.setup = () => {
            let canvas2 = s.createCanvas(s.windowWidth - 200, s.windowHeight - 200);
            // creating a reference to the div here positions it so you can put things above and below
            // where the sketch is displayed
            canvas2.parent('sketch-holder');

            s.background(255);
            s.strokeWeight(this.sw);

            this.c[0] = s.color(148, 0, 211);
            this.c[1] = s.color(75, 0, 130);
            this.c[2] = s.color(0, 0, 255);
            this.c[3] = s.color(0, 255, 0);
            this.c[4] = s.color(255, 255, 0);
            this.c[5] = s.color(255, 127, 0);
            this.c[6] = s.color(255, 0, 0);

            s.rect(0, 0, s.width, s.height);

            s.stroke(this.c[this.strokeColor]);
          };
```

This is creating a reference to the HTML `canvas` object which is literally the place where the sketch occurs. You can also expand this beyond the `canvas` with audio and even video.

Next if you notice I create a call to several drawing methods:

- background
- strokeWeight
- rect
- stroke

These are all defining the sketch with the rectangle being the outline of the canvas, background is the background color, and `stroke` is telling processing to apply a paint operation (given these parameters) to the canvas. The array of colors is used by this sketch to determine which color to show on the screen. Each of these colors is one from the rainbow.

The call to the draw method looks like the following:

```js
s.draw = () => {
  if (s.mouseIsPressed) {
    if (s.mouseButton === s.LEFT) {
      s.line(s.mouseX, s.mouseY, s.pmouseX, s.pmouseY);
    } else if (s.mouseButton === s.CENTER) {
      s.background(255);
    }
  }
};
```

If you notice this is using P5JS built in event listeners for `mouseIsPressed` and `mouseButton` to determine the application behavior. One of the best parts of P5JS (and the greater Processing language) is that it does all of these event listeners for you. So rather than having to build events and listener actions, P5JS has these APIs built for you and you just need to define them.

The sketch also includes some additional event listeners with the following:

```js
s.mouseReleased = () => {
  // modulo math forces the color to swap through the array provided
  this.strokeColor = (this.strokeColor + 1) % this.c.length;
  s.stroke(this.c[this.strokeColor]);
  console.log(`color is now ${this.c[this.strokeColor]}`);
};

s.keyPressed = () => {
  if (s.key === "c") {
    window.location.reload();
  }
};
```

Here the sketch is adding an implementation of the `mouseRleased` and `keyPressed` events. If you notice, I’ve added a `console.log` statement to capture the change in color events.

Finally, the sketch is complete with a definition and binding to a variable that we can put into our Angular Template.

```js
this.canvas = new p5(sketch);
```

Now with the sketch defined, lets go over to the template to finish up styling and actually display our sketch!

## Finishing up our Sketch

So with the initial sketch defined, le’s go over to the html file of your `home-page` component and add the following:

```html
<div class="container">
  <div class="row">
    <div class="col">
      <h1>Welcome to the Angular Sketchpad!</h1>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <p>Click in the space below to draw with your mouse.</p>
      <p>Type "c" on your keyboard to clear the screen.</p>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="sketch-container">
        <div id="sketch-holder"></div>
      </div>
    </div>
  </div>
</div>
```

Now finally, go over to the `styles.scss` file and add the following:

```css
body {
  height: 100%;
}

body {
  margin: 0;
  display: flex;
  flex-direction: column;

  /* This centers our sketch horizontally. */
  justify-content: center;

  /* This centers our sketch vertically. */
  align-items: center;
}
```

> This is just some basic styling that enables your sketch to be centered. I found [this page on the P5JS wiki](https://github.com/processing/p5.js/wiki/Positioning-your-canvas) helpful.

So now with all of this, you’re ready to go. Save the files and do an `npm run start` to see the sketchpad in action. If you’re seeing issues, I recommend checking out [the Stackblitz version of the project here](https://stackblitz.com/edit/angular-sketchpad1).

# Wrapping Up

So in this post, you were introduced to the P5JS Library and I showed you how to build a very basic sketchpad application. The P5JS Library and the Processing Language are a lot of fun and I recommend checking out their projects and documentation. There is also a fairly large community based around the Processing project, and I recommend checking out some of their videos and forums. I hope you enjoyed my post here and it helped you to learn something new in the process.
