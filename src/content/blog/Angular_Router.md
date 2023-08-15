---
title: Angular Router
pubDate: 2018-10-27T18:32:29.000Z
snippet: "So one of the most common tasks with Angular is implementing the Router. There are many ways to do this, if you look at the Angular Docs they basically create a toolbar that you can use at the top of"
heroImage: home.jpg
tags: ["angular"]
---

So one of the most common tasks with Angular is implementing the Router. There are many ways to do this, if you look at the Angular Docs they basically create a toolbar that you can use at the top of your page to tab through the different components. The great part about Angular is it is super flexible and so you are not limited to that method. You can use the router mechanism to control navigation through your site and then point links, buttons, etc. to those routes. The following is going to just setup the router based on the Angular Docs that can be seen here [https://angular.io/guide/router](https://angular.io/guide/router).

So first you need to import the router from the core Angular libraries at the top of your app.module by adding this

```js
import { RouterModule, Routes } from "@angular/router";
```

Next create a section in your app.module for routes. This will be explained more later, but basically you can think of this as a table of contents for your app. The routes you define here will allow navigation throughout your site to the different components you create.

Copying shamelessly from the example given at the Angular Docs

```js
const appRoutes: Routes = [
  { path: "crisis-center", component: CrisisListComponent },
  { path: "hero/:id", component: HeroDetailComponent },
  {
    path: "heroes",
    component: HeroListComponent,
    data: { title: "Heroes List" },
  },
  { path: "", redirectTo: "/heroes", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];
```

Additionally, you’re also going to want to import the RouterModule with a “forRoot” which connects the routes you’ve defined to the app.

The Angular docs example again is shamelessly copied here with:

```js
@NgModule({
imports: [
RouterModule.forRoot(
appRoutes,
{ enableTracing: true } // <-- debugging purposes only
)
// other imports here
],
...
})
export class AppModule { }
```

The Angular example above is from the heroes project that is used in most of the Angular tutorials. A breakdown of the various routes above is as follows.

The “crisis-center” router is pointing the path “/crisis-center” to the crisis center component. If someone in their browser goes “/crisis-center” then the crisis-center component will be shown.

The “hero/:id” route passes an “id” variable into the “hero” component of the site. This is very useful especially if you have an app based on id values or some kind of database key.

The “heroes” route passes the “Heroes List” data item into the “heroes” component. This is also useful in that you can pass variables and entire data structures through the routes that are called.

Using the “” route enables default behavior with the “redirecTo” value defined. This is good if a user accidentally clears the URL in their browser bar accidentally and you want your app to always reroute to a specific page if that happens.

Finally the “\*\*” path points to a page not found component”. This handles the situation when the user tries to change the address in the address bar and the page is not found. Its basically gracefully handling a redirect. Its a best practice and good in general.

The important part with these routes is that Angular uses a “first-match wins” policy. So the order is important. Basically it cycles through the list to find the route that matches what you are trying to route to. So it does this going first to last. So that’s why the “**” route is last since its a catchall. If you put the “**” route first then everybody would go to the page not found component.

With regards to importing the module, the “debug” value and connotation here just provides additional information as your developing your app and is not required.

Once you have those routes setup then make sure you put a tag in your main html page (normally app.component.html”) or other place where your app first loads. Also include a set of links which are the action or address that the navigate the user to. This looks like the following (copying the Angular Docs again):

```html
<h1>Angular Router</h1>
<nav>
  <a routerLink="/crisis-center" routerLinkActive="active">Crisis Center</a>
  <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
</nav>
<router-outlet></router-outlet>
```

Now if you use the setup above and include your own custom routes and components you’ll be up and running in no time. Hope this post helped get the basics going for you with the Angular Routing module.
