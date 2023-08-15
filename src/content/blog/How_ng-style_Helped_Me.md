---
title: How ng-style Helped Me
pubDate: 2019-06-27T15:38:10.000Z
snippet: "Recently I was working on trying to dynamically strikethrough values in a list in an Angular Project. This is pretty straightforward and works with the standard css text-decoration: line-through , b"
heroImage: /images/grocery.png
tags: ["angular"]
---

Recently I was working on trying to dynamically strikethrough values in a list in an Angular Project. This is pretty straightforward and works with the standard css `text-decoration: line-through` , but that’s harder to do if you want to apply this style dynamically.

Looking around stack-overflow, lots of people have ways to fix this.

I wanted to be able to dynamically stirke-through a line, and save it in a way that my app could automatically apply this when values are loaded.

The app was hosted with [Firebase](https://rhythmandbinary.com/2018/04/08/firebase/) and I wanted to take advantage of the remote state management feature. With Firebase, your data uses observables to listen to streams from the data’s source. I talk about it more in [my Angular-In-Depth post here](https://blog.angularindepth.com/how-the-angular-fire-library-makes-firebase-feel-like-magic-1fda375966bb).

Back to my story…

So I wanted to dynamically apply a strike-through. This ended up actually being kinda challenging, becuase I wanted the strike-through to be applied on-load. Kinda like the following:

![](/images/grocery.png)

I wanted to the following in my app:

1.  store the list
2.  store the fact that some values have strike-through.
3.  on load, I wanted to dynamically apply the strike-through
4.  when users click the checkbox, the stirke-through is applied

The first item was super straightforward, Just using the AngularFire2 library I wrote a little method that takes in the values and saves:

```js
// async is not necessary here, but using it to control event loop
async addItem() {
  const id = this.afs.createId();
  const groceryItem: GroceryItem = {
    value: this.createForm.controls.item.value,
    lineThrough: false,
    id: id
  };
  const createCall = await this.groceryItemsCollection.doc(id).set(groceryItem)
    .catch(() => new Error('Error when creating item'));

  if ( createCall instanceof Error) {
    return alert(createCall);
  }

  this.createForm.controls.item.setValue('');
}
```

If you notice, in the values stored I included a `lineThrough` boolean value. This is where I’m storing the strike-through value. This takes care of #2 above as well.

However, how do pick this up? Add a listener for the click event to the checkbox, then when it is saved, apply the associated value

Listen for the value in the template html:

```html
<mat-checkbox
  (click)="linethrough(groceryItem)"
  [checked]="groceryItem.lineThrough"
></mat-checkbox>
```

Listen for the change and update the local value:

```js
async linethrough(groceryItem: GroceryItem) {
  if (groceryItem.lineThrough) {
    groceryItem.lineThrough = false;
  } else {
    groceryItem.lineThrough = true;
  }
  const updateCall = await this.groceryItemsCollection.doc(groceryItem.id).set(groceryItem)
    .catch(() => new Error('Error when creating item'));

  if ( updateCall instanceof Error) {
    return alert(updateCall);
  }
}
```

Dynamically read in the value from firebase onload:

![](/images/screen-shot-2019-06-27-at-11.42.51-am.png)

WOAH! WOAH! What is `[ngstyle]` doing there?

This was my magic solution.

If you google `[ngstyle]` you’ll find a lot of articles on how it dynamically allows you to apply styling.

In this case, what I’m doing is I’m applying the `text-decoration: line-through` based on the values that are brought in.

What does this enable me to do?

EVERYTHING! J/k but it is pretty cool. This all basically let me setup this dynamic value, based on a checkbox and accomplished my goals.

I recommend checking out some more on `[ngstyle]` when you have some time. Its pretty cool and gives you a lot of flexibility in your templates.
