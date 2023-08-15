---
title: Understanding useState in React
pubDate: 2023-01-03T18:37:48.990Z
snippet: I﻿f you've worked with React (or are even new to it) you've probably
  heard of the `useState` hook. The `useState` hook is one of the most
  fundamental parts of the React library, and also greatly improves data
  management in an application.
heroImage: /images/lego-blocks-g3e55a117a_1920.jpeg
tags: ["react"]
---

I﻿f you've worked with [React](https://reactjs.org/) (or are even new to it) you've probably heard of the `useState` hook. The `useState` hook is one of the most fundamental parts of the React library, and also greatly improves data management in an application.

T﻿his post is going to walkthrough what `useState` is and more generically how you can use it and other hooks in React development. If you want to follow along, I recommend checking out my sample project on GitHub at <https://github.com/andrewevans0102/react-use-state-examples2>. I'm also presenting at one of Log Rocket's virtual Meetups on Janary 16 at 12 PM EST on this same topic. Sign up for the meetup online at <https://blog.logrocket.com/understanding-usestate-in-react/>.

## What are React Components?

W﻿hen working with React, one of the first things you usually find is someone referring to a "hook" for development. [According to the React Documentation](https://reactjs.org/docs/hooks-intro.html#its-hard-to-reuse-stateful-logic-between-components) React Hooks are reusable stateful logic that can reused in different components.

By React "components" we are referring to small pieces of a user interface. This could be an entire page or just the header, they really can be whatever you want to define them as. Usually you see something like the following:

```js
// someComponent.tsx
const someComponent = () => {
  return (
    <div>
      <p>Hello World</p>
    </div>
  );
};
```

T﻿his example is obviously ver simplified, but you basically just have a function definition which then returns whatever part you are defining of a webpage. Components can have \`props\` that can be passed into a component to use. You can then define hierarchies of components where you have a parent with children similar to the following:

```js
// parentComponent.tsx

import { ChildComponent } from './components/ChildComponent';

const parentComponent = (props: any) => {

  return(
    <div>
      <h1>Hello World</h1>
      <ChildComponent />
    </div>
   );
}
```

A﻿gain, these are super simple but you can see how components can be used to build a part or a whole Frontend with React.

Inside these components, you have the concept of "state" which can be anything from a local value to something connected with a centralized state management library like [Redux](https://react-redux.js.org/). A simple component that just has one thing managed in its local state, a variable called "title" that stores the value "hello world" like the following:s

```js
const HelloComponent = () => {
  const title = "hello world";

  return (
    <div>
      <p>{title}</p>
    </div>
  );
};
```

Now you may want the "title" value to be editable by the user, or to change it programatically. This is where the `useState` hook (and hooks more generically speaking) are important.

React's `useState` hook is built in and allows you to manipulate a component's state. Considering our `HelloComponent` from before, lets now look at it with `useState`:

```js
import { useState } from "react";

const HelloComponent = () => {
  const [title, setTitle] = useState("hello world");

  return (
    <div>
      <p>{title}</p>
    </div>
  );
};
```

Notice how `const [title, setTitle] = useState("hello world");` replaces the original value declaration. The `useState` hook provides the component with the value, and a way to manipualte that value (here `setTitle`).

You can now wire this up to something like a Textfield or Button and then manage your component's state like the following:

```js
import { useState } from "react";

export const Single = () => {
  const [title, setTitle] = useState("hello world");

  return (
    <section>
      <h1>{title}</h1>
      <input
        type="text"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        value={title}
      />
    </section>
  );
};
```

This results in something that looks like the following:

![hello world useState component](/images/screen-shot-2023-01-03-at-2.35.06-pm.jpg)

The cool part about this is that the `useState` functionality can be used in any React component. This is why Hooks are so powerful. The `useState` component is built in, but you can also write you own hooks and use them throughout your application. Check out [the official React Documentation for more on writing custom hooks](https://reactjs.org/docs/hooks-custom.html).

For the sake of this article, we are going to focus on `useState` specifically. In a broader sense, you can write custom React Hooks that operate similart to `useState` and then bring them into components in a larger application.

## More advanced use of useState

So in the examples I've walked through above, I made things very simple to be able to demonstrate some basic concepts. If you're looking at my sample project, you'll note that I have three components that showcase useState:

1. `Counter.tsx` that just increments a number
2. `Single.tsx` that changes the "hello world" text input
3. `Multiple.tsx` that changes an array of "to-do" values in a component

All three of them showcase common ways that you would use the `useState` hook in your application.

Both `Counter.tsx` and `Single.tsx` directly call the `set` function like so:

```js
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
```

The `Multiple.tsx` component has handlers for the `onChange` of a variable input as well as state variables for the text input and the array of to-do values to output:

```js
    const handleTodoChange = (event: any) => {
        setTodoInput(event?.target.value);
        console.log(
            `todo input was updated successfully to be ${event?.target.value}`
        );
    };

    const addTodo = (newTodo: string) => {
        const localTodos: textInput[] = todos;
        localTodos.push({ text: newTodo });
        // set value
        // use spread syntax to trigger re render
        setTodos([...localTodos]);
        console.log(
            `todo array was updated to be ${JSON.stringify(localTodos)}`
        );

        // clear input field
        setTodoInput('');
        console.log('todo input was cleared');
    };
```

This pattern of having an event handler and corresponding calls to update the state value is pretty common in React projects. Having a handler also helps if you have more advanced situations like you want to call an API after a value is input or you may want to sanitize the data that is typed.

In the example components I also added `console.log` statements so you can follow along and see the `useState` hook changing the values directly:

![example useState components in browser](/images/screen-shot-2023-01-03-at-2.44.37-pm.jpg)

## More Advanced cases and beyond

The main purpose of this post was just to introduce the `useState` hook. I also introduced the concepts of `hooks` to be able to understand hwo they work in React development.

The examples that I've shown have been necessarily simple, but with real applications you'll often find fairly complext usescases where state is passed between components. The `useState` hook works well with simple components that just need simple state maintained. When you get into more complex applications, you'll often have pages composed of smaller components that often will need to exchange data based on user actions and API calls. Those more complex situations often call for libraries like [Redux](https://react-redux.js.org/). Libraries like Redux allow you to keep your code DRY (do not repeate yourself) and also make your life easier as you maintain one section of variables rather than individual state values in many different components.

I recommend checking out the sample project, and also looking into the way more complex applications manage state.

Thanks for reading my post!
