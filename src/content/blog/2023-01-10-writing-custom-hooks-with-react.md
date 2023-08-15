---
title: Writing Custom Hooks with React
pubDate: 2023-01-10T14:23:23.865Z
snippet: 'I﻿f you''ve done any React development, you''ve probably heard of
  "hooks" in components. Hooks enable you to reuse logic across your project''s
  components. Hooks help minimize repetition of code, and also make your
  project''s easier to maintain. React has a few "built in" hooks, but also
  allows you to build your own. In this post I''m '
heroImage: /images/building-blocks-gce7238fad_1280.png
tags: ["react"]
---

If you've done any React development, you've probably heard of "hooks" in components. Hooks enable you to reuse logic across your project's components. Hooks help minimize repetition of code, and also make your project's easier to maintain. React has a few "built in" hooks, but also allows you to build your own. In this post I'm going to walk through what custom hooks are, and how they can help you in your projects.

I﻿'m going to be referring to a sample project throughout this post. If you'd like to follow along, check it out at <https://www.github.com/andrewevans0102/react-custom-hooks-examples>.

## Some Basics about Hooks

As I said in the intro, Hooks allow you to reuse logic across your project's components. You can see this in action with some of the built in hooks like `useState`.

> If you'd like to learn more about useState, I recommend checking out my post [Understanding UseState in React](https://rhythmandbinary.com/post/2023-01-03-understanding-usestate-in-react).

With `useState` you can update local state in a React Component similar to the following:

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

In that example the "title" variable is has both a reference value and a setter("setTitle") that the component can use to update the state.

Similarly, if you've seen the `useEffect` hook you can handle events by listening to renders like in this example:

```js
// example originally copied from https://reactjs.org/docs/hooks-effect.html
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

In both of these cases, the `useState` and `useEffect` hook can be reused throughout an application. There are several built in hooks that can be used like this, in the next sections I'm going to show you how to create your own.

## Rules about Hooks Usage

Based on the [React Rules on Hooks](https://reactjs.org/docs/hooks-rules.html) and the page on [creating your own hooks](https://reactjs.org/docs/hooks-custom.html) Hooks have a few basic rules.

- 🛑 Do not call hooks from JavaScript functions
- ✅ Call hooks from React Functional Components
- ✅ Call Hooks from other Custom Hooks
- ✅ Custom hook names start with "use" like `useCoolFunctionName` or `useAnotherCoolFunctionName`
- 🛑 Two Hooks using the same hook DO NOT share state. Each time a component uses a hook, state and side effects are isolated.

These rules are all you need to refer to when creating your own hooks. This gives you a lot of flexibility in development, and makes it so hooks can accomodate a lot of different usescases.

## Our first Custom Hook

As I mentioned in the intro, I have a sample project that I'll be referring to at <https://www.github.com/andrewevans0102/react-custom-hooks-examples>.

To understand how to create a hook, lets consider a very simple "To-Do list" component like the following:

```js
import { useState } from 'react';
import { TextInput } from '../models/input';

const ToDoListUseState = () => {
    const [todoInput, setTodoInput] = useState('');
    const [todos, setTodos] = useState<TextInput[]>([]);

    const handleTodoChange = (event: any) => {
        setTodoInput(event?.target.value);
        console.log(
            `todo input was updated successfully to be ${event?.target.value}`
        );
    };

    const addTodo = (newTodo: string) => {
        const localTodos: TextInput[] = todos;
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

    return (
        <section style={{ border: 'solid orange 5px' }}>
            <h2>To Do List with UseState</h2>
            <input type="text" onChange={handleTodoChange} value={todoInput} />
            <div>
                <button
                    onClick={() => {
                        addTodo(todoInput);
                    }}
                >
                    Create
                </button>
            </div>
            <ul>
                {todos &&
                    todos.map((value: TextInput, index: number) => {
                        return <li key={index}>{value.text}</li>;
                    })}
            </ul>
        </section>
    );
};

export default ToDoListUseState;
```

In this component, we have two pieces of local state that we want to manage (1) the input field and (2) an array of To-Dos. With the `useState` hook, this is easy as we just update the state with the setter functions and have two methods for handling the changes in the component("handleToDoChange" and "addTodo" respectively).

Now let's consider a situation where we may want to have multiple To-Do list's in our application. That would mean we would have to copy this same logic (and use of useState) in the different components. This would mean we'd have multiple places to maintain, and in general an increase in the risk for errors down the road in maintenance.

Hooks will allow us to encapsulate some of this logic so we can reuse it and minimize the amount of code we have to write.

Here is a hook that covers the changing of the input fields and To-Do list:

```js
import { TextInput } from '../models/input';

function useList(setListInput: Function, setList: Function) {
    const handleInputChange = (event: any) => {
        setListInput(event?.target.value);
        console.log(
            `input was updated successfully to be ${event?.target.value}`
        );
    };

    const addInput = (newInput: string, originalList: TextInput[]) => {
        originalList.push({ text: newInput });
        // use spread syntax to trigger re render
        setList([...originalList]);
        console.log(`list was updated to be ${JSON.stringify(originalList)}`);

        // clear input field
        setListInput('');
        console.log('list input was cleared');
    };

    return {
        handleInputChange,
        addInput,
    };
}

export default useList;
```

Notice in this hook, we first have prefaced it with the `use` and then we also export the two event handling functions. We can use this hook in the same To-Do list component as follows:

```js
import { useState } from 'react';
import useList from '../hooks/useList';
import { TextInput } from '../models/input';

const ToDoListCustomHooks = () => {
    const [listInput, setListInput] = useState('');
    const [list, setList] = useState<TextInput[]>([]);

    const listHook = useList(setListInput, setList);

    return (
        <section style={{ border: 'solid green 5px' }}>
            <h2>To-Do list with Custom Hooks</h2>
            <input
                type="text"
                onChange={listHook.handleInputChange}
                value={listInput}
            />
            <div>
                <button
                    onClick={() => {
                        listHook.addInput(listInput, list);
                    }}
                >
                    Create
                </button>
            </div>
            <ul>
                {list &&
                    list.map((value: TextInput, index: number) => {
                        return <li key={index}>{value.text}</li>;
                    })}
            </ul>
        </section>
    );
};

export default ToDoListCustomHooks;
```

Notice now in the component we just needed to define the local state, but the functions for working with the local state are handled via the hook:

```js
const listHook = useList(setListInput, setList);
```

This is very simple, but you can see how we could take this further and pass more functions into the hook. We could even use the hook to maintain its own slice of state. Often times with larger projects, you can do that and leverage things centralized state management systems like Redux to make this scale even further.

## More Advanced Hook Usage

So now that we have seen our first hook, lets consider a more advanced usecase. What if we wanted to store our To-Do list in local storage, so the user could leave and come back to see their To-Dos. In a more realistic scenario we would do this with a database and API calls etc. I'm using local storage here to make things simple.

Let's use a hook called `useLocalStorage` that looks like the following:

```js
import { useState } from 'react';

// copied originally from https://usehooks.com/useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };
    return [storedValue, setValue] as const;
}

export default useLocalStorage;
```

> I actually copied this hook from a great website called [https://usehooks.com](https://usehooks.com) which has several readymade hook examples that you can use in your projects. I've actually used a few of these for actual work projects, and highly recommend using them or at least referring to them when doing development.

If you notice in this hook, it leverages `useState` to retrieve and set values in localStorage. You only need the key and payload to be able to pass into the local storage to get going.

Hooking this up to our To-Do list, we can use both the custom `useList` hook I mentioned before and this `useLocalStorage` hook as in the following:

```js
import useList from '../hooks/useList';
import useLocalStorage from '../hooks/useLocalStorage';
import { TextInput } from '../models/input';

const AdvancedToDoList = () => {
    // instead of useState, save the values in local storage
    const [listInput, setListInput] = useLocalStorage<string>('input', '');
    const [list, setList] = useLocalStorage<TextInput[]>('list', []);

    const listHook = useList(setListInput, setList);

    return (
        <section style={{ border: 'solid blue 5px' }}>
            <h2>Advanced To-Do List</h2>
            <input
                type="text"
                onChange={listHook.handleInputChange}
                value={listInput}
            />
            <div>
                <button
                    style={{ backgroundColor: 'green', margin: '10px' }}
                    onClick={() => {
                        listHook.addInput(listInput, list);
                    }}
                >
                    Create
                </button>
                <button
                    style={{ backgroundColor: 'red' }}
                    onClick={() => {
                        setListInput('');
                        setList([]);
                    }}
                >
                    Clear
                </button>
            </div>
            <ul>
                {list &&
                    list.map((value: TextInput, index: number) => {
                        return <li key={index}>{value.text}</li>;
                    })}
            </ul>
        </section>
    );
};

export default AdvancedToDoList;
```

Here you see we instead of directly using `useState` we can take the `useLocalStorage` hook and the `useList` hook to manage the state in the component:

```js
    // instead of useState, save the values in local storage
    const [listInput, setListInput] = useLocalStorage<string>('input', '');
    const [list, setList] = useLocalStorage<TextInput[]>('list', []);
```

This could be further simplified and have both of these hooks combined. However, I wanted to showcase using multiple hooks in a component because often times with larger React projects teams will use several hooks at once. This usage is probably the best part of hooks as it lets you easily reuse functionality at different parts of an application without the need to repeat a lot of code.

## Custom Hooks and Beyond

I hope this post has helped you to understand a few basics about custom hooks with React. I encourage you to check out my sample project, and also look at the React Documentation. The [https://usehooks.com/](https://usehooks.com/) website is also a great resource to see more advanced scenarios that you can use hooks for. I've used hooks in several large projects, and really enjoy working with them. They've helped organize very complicated solutions for customers, and also helped me a lot in application maintenance down the road.

Thanks for reading my post!
