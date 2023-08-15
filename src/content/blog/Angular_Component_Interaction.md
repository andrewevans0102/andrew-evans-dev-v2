---
title: Angular Component Interaction
pubDate: 2018-11-13T04:02:16.000Z
snippet: "With Angular 2+ you have a lot of flexibility to create applications with many or few connecting pieces. Typically you would create components that either exist on themselves or are pieces of a bigge"
heroImage: /images/screen-shot-2018-11-12-at-11-06-19-pm.png
tags: ["angular"]
---

With Angular 2+ you have a lot of flexibility to create applications with many or few connecting pieces. Typically you would create components that either exist on themselves or are pieces of a bigger object.

Recently, I created a weather app that basically uses the default app.component as a parent for children components that need associated data. This can be seen in the template file here:

![Screen Shot 2018-11-12 at 11.06.19 PM](/images/screen-shot-2018-11-12-at-11-06-19-pm.png)

Basically the “app component” renders a display that includes the “current-weather” component template and the “forecast” template. The challenge here was that I wanted (1) all the data to appear at the same time and (2) the data in the child components controlled by the parent component.

In order to do all of this I had to use input binding from the parent to the child.

When you create your child components, make sure to declare values using the “@Input” annotation for anything being bound from the parent. Here is an example using the above mentioned weather app:

![Screen Shot 2018-11-12 at 11.11.55 PM](/images/screen-shot-2018-11-12-at-11-11-55-pm.png)

The “weatherDisplay” variable is being passed as input to the “app-current-weather” template and associated component.

Then in the child component you add the “@Input” declaration next to the value passed in and use either observables or (as is in this case) the “ngOnChanges” lifecycle hook to detect changes in the bound data elements.

Basically whenever a value is changed from the parent, the “ngOnChanges” lifecycle hook kicks off and detects the change. Then the change can get propagated to the associated element in the child.

If you had wanted you can also use observables here, so that basically any change to the parent gets passed to the child subscribers. I had never used the “ngOnChanges” lifecycle hook before, and thought it’d be cool to implement it here.

So basically with this setup, whenever the value is changed in the parent, it will be passed to the child elements. You are able to control the data from one source. You can also control how the user sees the data and how it is sent to the display.

For a more in depth look at this setup (and more on component interaction) check out the Angular Docs page on this [Component Interaction](https://angular.io/guide/component-interaction).
