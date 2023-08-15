---
title: Binary Search Trees and Graph Traversal
pubDate: 2021-01-14T00:05:54.796Z
snippet: "When learning algorithms one of the most difficult concepts is graph
  traversal. Graphs are a data structure that is composed of "
heroImage: /images/binary_search_tree_cover.jpg
tags: ["algorithms"]
---

> [cover image was originally copied from here](https://pixabay.com/photos/lone-tree-tree-oak-clouds-1934897/)

When learning algorithms one of the most difficult concepts is graph traversal. [Graphs](<https://en.wikipedia.org/wiki/Graph_(abstract_data_type)>) are a data structure that is composed of `verticies` (or nodes) and `edges`. Graph `verticies` are basically the endpoints and what connects them are the `edges`.

Graphs can also be `directed` or `undirected` based on the relationship. Graphs normally can be used to represent things in real life. So you can think of a `directed` graph as a one way street, and an `undirected` graph as a sidewalk.

Here is an example graph:

![example binary search tree](/images/graphs2.png)

As you can see the `vertices` in this graph include the letters A, B, C, D, E, F, G. The lines that connect them are considered the `edges`.

This graph is undirected and is just several `verticies` connected without any order.

Often times in computer science we see things called `Binary Search Trees` which are a form of a graph. Binary search trees are special because they have attributes that make them very efficient in storing data.

In this post I'm going to walkthrough binary search trees and a common implementation in JavaScript. If you'd like to follow along, please check out [my GitHub repo here](https://www.github.com/andrewevans0102/learn-binary-search-trees).

## What are Binary Search Trees?

Here is an example of a binary search tree:

![binary search tree example](/images/screen-shot-2021-01-13-at-4.11.08-pm.png)

A binary search tree has the following attributes ([see wiki page for more](https://en.wikipedia.org/wiki/Binary_tree#)):

- each tree has a `root` or first element
- each node has at most two children

  - left
  - right

- the value of the left subtree (child) is less than the parent
- the value of the right subtree (child) is greater than the parent
- the organization of the binary tree makes operations fast and efficient since every node is laid out in an understood order. This means programs can do less comparisons when navigating the tree.

When people talk about binary search trees they often talk about `height`. In a binary search tree the `height` is just the levels. In the example we have above, we have a `height` of 4 since there are 4 levels of nodes.

Often times you hear people ask about a tree being `height balanced`. It is `height balanced` if the heights of its subtrees differ by no more than 1 (meaning each node has at least 1. Here is a balanced tree:

![balanced tree](/images/screen-shot-2021-01-13-at-4.11.08-pm.png)

Here is a not height balanced tree (notice we removed nodes "24" from the same tree):

![tree that is not balanced](/images/screen-shot-2021-01-13-at-4.12.08-pm.png)

Finally, we also need to mention searching. Searching a binary search tree can take the following forms:

- `in order` = leftmost to rightmost value
- `pre order` = explore root nodes before leaf nodes
- `post order` = explore leaf nodes before root nodes
- `level order` = BFS of the tree

## Building it in JavaScript

So I'm going to use the examples from Beau Carnes video here:

[![Binary Search Tree Beau Carnes](https://img.youtube.com/vi/5cU1ILGy6dM/0.jpg)](https://www.youtube.com/watch?v=5cU1ILGy6dM)

My implementation was originally a copy of Beau's example, but I've made some changes for this walkthrough. As I mentioned in the intro, you can see the source code at my [GitHub repo](https://www.github.com/andrewevans0102/learn-binary-search-trees).

> In this example I'm also going to be using JavaScripts [class syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes). This is a little different than the syntax you see with things like [functional components in React](https://reactjs.org/docs/components-and-props.html). It should be somewhat easy to understand, but I recommend checking out the links above if you get confused by some of the syntax. You could also build an implementation with Functions, but the class implementation here follows Object Oriented patterns and I've found it to be more friendly with learning binary search trees.

So to start with, lets build a `BSTNode` class to represent each vertice (or node) on our tree:

```js
module.exports = class BSTNode {
  constructor(data, parent, root = false, left = null, right = null) {
    this.data = data;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
};
```

As you can see here, nothing super exciting yet. We just have a representation of the value of the node (the `data`) as well as the `left` and `right` child and `parent`.

Now let's start to define a class that uses the `BSTNode` class we just defined.

```js
const BSTNode = require("./BSTNode");

module.exports = class BSTGraph {
	#root = null;

	constructor(data) {
		this.root = new BSTNode(data, null);
	}
```

Here we have a class variable that points to the `root` node of the tree. This is important since we'll need that for interacting with the overall structure.

The first method that we can implement is `add`:

```js
	add(data) {
		const node = this.root;
		if (node === null) {
			this.root = new BSTNode(data, null);
			return;
		} else {
			return this.placeNodeOnTree(node, data);
		}
	}
```

Notice here that if there are no nodes in the tree, it automatically sets the root as what is passed in and returns. Otherwise, it uses a second method `placeNodeOnTree` that you see here:

```js
	placeNodeOnTree(node, data) {
		if (data < node.data) {
			if (node.left === null) {
				node.left = new BSTNode(data, node.data);
				return;
			} else if (node.left !== null) {
				return this.placeNodeOnTree(node.left, data);
			}
		} else if (data > node.data) {
			if (node.right === null) {
				node.right = new BSTNode(data, node.data);
				return;
			} else if (node.right !== null) {
				return this.placeNodeOnTree(node.right, data);
			}
		} else {
			return null;
		}
	}
```

So what this method is doing is searching the tree and identifying the logical place to put the node. It uses recursion and:

1. looks at the nodes left child

- if empty, put it there
- if not empty, go to the next left child

2. looks at the nodes right child

- if empty, put it there
- if not empty, go to the next right child

The concept here is using Depth First Search (DFS) as its going as deep as it can to find the specific value first. There are two different implementations that you often hear about being DFS and Breadth First Search (BFS). In our program, we're going to implement BFS at the end, but if you wanted to read a more in depth explanation check out my posts:

- [Depth First Search](https://rhythmandbinary.com/post/Algorithms_How_to_use_Breadth_First_Search)
- [Breadth First Search](https://rhythmandbinary.com/post/Algorithms_How_to_Search_a_Graph_with_Depth_First_Search)

Now that we can add nodes, lets create a find method that traverses through the tree to find a value:

```js
	findNode(data) {
		let current = this.root;
		while (current.data !== data) {
			if (data < current.data) {
				current = current.left;
			} else {
				current = current.right;
			}
			if (current === null) {
				return null;
			}
		}
		return current;
	}
```

This method highlights one of the benefits of the binary search tree because if you notice, the while loop just uses the organized nature of the tree to find the value. It compares the data passed in to what is held at each node. If the value it's looking at is less than what is being looked for it goes left, otherwise it goes right.

In a similar fashion, we can also create a method that checks to see if a node is present. The `findNode` method above returns the node that has the data looked for, an `isPresent` method just returns a boolean value to let you know if the value is there:

```js
	isPresent(data) {
		let current = this.root;
		while (current) {
			if (data === current.data) {
				return true;
			}
			if (data < current.data) {
				current = current.left;
			} else {
				current = current.right;
			}
		}
		return false;
	}
```

The logic here is about the same as the `findNode` method above.

Now, we can add and search the tree for nodes, lets add a method that removes a node:

```js
	removeNode(node, data) {
		if (node == null) {
			return null;
		}
		if (data === node.data) {
			// node has no children
			if (node.left === null && node.right === null) {
				return null;
			}
			// node has no left child
			if (node.left === null) {
				return node.right;
			}
			// node has no right child
			if (node.right === null) {
				return node.left;
			}
			// node has two children
			let tempNode = node.right;
			while (tempNode.left !== null) {
				tempNode = tempNode.left;
			}
			node.data = tempNode.data;
			node.right = this.removeNode(node.right, tempNode.data);
			return node;
		} else if (data < node.data) {
			node.left = this.removeNode(node.left, data);
			return node;
		} else {
			node.right = this.removeNode(node.right, data);
			return node;
		}
	}

	remove(data) {
		this.root = this.removeNode(this.root, data);
	}
```

The method `remove` calls a recursive method `removeNode`. Notice here also that it replaces our instance of our binary search tree with a new one (a version with the specific node removed).

The recursive calls follow the DFS approach by going through all of the nodes until the value is found. By virtue of recursion, the method composes a new tree (hence why the method replaces the instance of the root node.

When the `removeNode` method finds the value, it then responds to three different possibilities:

1. the node has no children (so it returns a null reference as the node that was found
2. the node has no left child, so it returns a reference to the node's right child instead of the node itself
3. the node has no right child, so it returns a reference to the node's left child
4. the node has two children, at which point it stores the right child and then goes down the tree until it finds the leftmost child and places the right node there.

Finally, the last method to add is a simple method that prints out the tree as it is traversed. This is really just a small helper, but helps to visualize and test the algorithm once the rest of the methods are built:

```js
	printTreeBySearch(node) {
		console.log(`node ${node.data} with parent ${node.parent}`);
		if (node.left !== null) {
			this.printTreeBySearch(node.left);
		}
		if (node.right !== null) {
			this.printTreeBySearch(node.right);
		}
		if (node === null) {
			return;
		}
	}

	printTree() {
		this.printTreeBySearch(this.root);
	}
```

This print method `printTree` is recursive and just follows the DFS algorithm to print the tree out as it is traversed.

Now if you want to test it, create a small program that looks like this:

```js
const BSTGraph = require("./BSTGraph");

const graph = new BSTGraph(10);

//            10
//         /      \
//        8        22
//       /  \     /  \
//      5    9   21  24
//              /
//             12

graph.add(10);
graph.add(8);
graph.add(5);
graph.add(9);
graph.add(22);
graph.add(21);
graph.add(12);
graph.add(24);
console.log("print the tree after creation");
graph.printTree();
```

When you run it, your console output should look like the following:

```bash
➜  post git:(master) ✗ node DemoGraph.js
print the tree after creation
node 10 with parent null
node 8 with parent 10
node 5 with parent 8
node 9 with parent 8
node 22 with parent 10
node 21 with parent 22
node 12 with parent 21
node 24 with parent 22
```

## Evaluating Balance

So now that we have our tree built, let's look at methods that can evaluate the overall tree height.

```js
	isBalanced() {
		return this.findMinHeight() >= this.findMaxHeight() - 1;
	}

	findMinHeight(node = this.root) {
		if (node == null) {
			return -1;
		}
		let left = this.findMinHeight(node.left);
		let right = this.findMinHeight(node.right);
		if (left < right) {
			return left + 1;
		} else {
			return right + 1;
		}
	}

	findMaxHeight(node = this.root) {
		if (node == null) {
			return -1;
		}
		let left = this.findMaxHeight(node.left);
		let right = this.findMaxHeight(node.right);
		if (left > right) {
			return left + 1;
		} else {
			return right + 1;
		}
	}
```

Here we have `isBalanced` which returns if the minimum height and maximum height are off by no more than 1 value. The `findMinHeight` and `findMaxHeight` traverse the tree and look for the greatest and least values. If you remember in our earlier discussion about tree heights, this refers to levels of nodes on the tree.

Here's a run with the tree balanced:

```js
const BSTGraph = require("./BSTGraph");

const graph = new BSTGraph(10);

//            10
//         /      \
//        8        22
//       /  \     /  \
//      5    9   21  24
//              /
//             12

graph.add(10);
graph.add(8);
graph.add(5);
graph.add(9);
graph.add(22);
graph.add(21);
graph.add(12);
graph.add(24);
console.log(graph.isBalanced());
```

Here's a run with the tree not balanced (notice we commented out adding "24" at the last line):

```js
const BSTGraph = require("./BSTGraph");

const graph = new BSTGraph(10);

//            10
//         /      \
//        8        22
//       /  \     /
//      5    9   21
//              /
//             12

graph.add(10);
graph.add(8);
graph.add(5);
graph.add(9);
graph.add(22);
graph.add(21);
graph.add(12);
// graph.add(24);
console.log(graph.isBalanced());
```

## In Order Tree Traversal

So now we have a working tree, but we still need to traverse it.

An "in order" traversal of the tree goes smallest to largest and looks like this:

```js
	traverseInOrder(node, result) {
		if (node.left !== null) {
			this.traverseInOrder(node.left, result);
		}

		result.push(node.data);

		if (node.right !== null) {
			this.traverseInOrder(node.right, result);
		}
	}

	// smallest to largest
	inOrder() {
		if (this.root == null) {
			return null;
		} else {
			const result = [];

			this.traverseInOrder(this.root, result);
			return result;
		}
	}
```

Notice here that the Algorithm uses recursion, (1) finds the value to the left, adds it to results, (2) finds value to the right, pushes it to results. The reason we have two here is so that if the root is null we avoid doing the recursive calls with `traversInOrder`.

If we wanted to do a test run, lets see it in action:

```js
const BSTGraph = require("./BSTGraph");

const graph = new BSTGraph(10);

//            10
//         /      \
//        8        22
//       /  \     /  \
//      5    9   21  24
//              /
//             12

graph.add(10);
graph.add(8);
graph.add(5);
graph.add(9);
graph.add(22);
graph.add(21);
graph.add(12);
graph.add(24);

console.log("in order tree traversal");
console.log(graph.inOrder());
```

```bash
➜  post git:(master) ✗ node DemoGraph.js
in order tree traversal
[
   5,  8,  9,
  10, 12, 21,
  22, 24
]
```

## Pre Order Traversal

When we want to go "pre order" traversal we look at the root before the leaves (or really the parents before the child nodes). The method to do this looks like the following:

```js
	traversePreOrder(node, result) {
		result.push(node.data);
		if (node.left !== null) {
			this.traversePreOrder(node.left, result);
		}
		if (node.right !== null) {
			this.traversePreOrder(node.right, result);
		}
	}

	// roots before leaves
	preOrder() {
		if (this.root == null) {
			return null;
		} else {
			const result = [];

			this.traversePreOrder(this.root, result);
			return result;
		}
	}
```

Notice here that the algorithm starts with value of whatever is the parent, adds it to the results, then goes left to right. The key takeaway here is that the recursion starts at the root or parent node first.

If we wanted to see it in action:

```js
const BSTGraph = require("./BSTGraph");

const graph = new BSTGraph(10);

//            10
//         /      \
//        8        22
//       /  \     /  \
//      5    9   21  24
//              /
//             12

graph.add(10);
graph.add(8);
graph.add(5);
graph.add(9);
graph.add(22);
graph.add(21);
graph.add(12);
graph.add(24);

console.log("pre order tree traversal, roots before leaves");
console.log(graph.preOrder());
```

The output should look like:

```bash
➜  post git:(master) ✗ node DemoGraph.js
pre order tree traversal, roots before leaves
[
  10,  8,  5,
   9, 22, 21,
  12, 24
]
```

## Post Order Tree Traversal

When we want to go "post order" traversal of the tree we go for "leaves first". The method looks like this:

```js
	traversePostOrder(node, result) {
		if (node.left !== null) {
			this.traversePostOrder(node.left, result);
		}
		if (node.right !== null) {
			this.traversePostOrder(node.right, result);
		}
		result.push(node.data);
	}

	// leaves before roots
	postOrder() {
		if (this.root == null) {
			return null;
		} else {
			const result = [];

			this.traversePostOrder(this.root, result);
			return result;
		}
	}
```

If you notice here, we traverse the parents first and once we've reached the child nodes, we add them to the results. The recursion here adds the value at the child rather than at the parent.

If we wanted to see it in action:

```js
const BSTGraph = require("./BSTGraph");

const graph = new BSTGraph(10);

//            10
//         /      \
//        8        22
//       /  \     /  \
//      5    9   21  24
//              /
//             12

graph.add(10);
graph.add(8);
graph.add(5);
graph.add(9);
graph.add(22);
graph.add(21);
graph.add(12);
graph.add(24);

console.log("post order tree traversal, leaves before roots");
console.log(graph.postOrder());
```

The output should look like:

```bash
➜  post git:(master) ✗ node DemoGraph.js
post order tree traversal, leaves before roots
[
   5,  9,  8,
  12, 21, 24,
  22, 10
]
```

## Level Order Tree Traversal

Finally, the last way you can traverse the tree would be "level order" or BFS. The method to do this looks like the following:

```js
	// breadth first search
	levelOrder() {
		let result = [];
		let Q = [];
		if (this.root != null) {
			Q.push(this.root);
			while (Q.length > 0) {
				let node = Q.shift();
				result.push(node.data);
				if (node.left != null) {
					Q.push(node.left);
				}
				if (node.right != null) {
					Q.push(node.right);
				}
			}
			return result;
		} else {
			return null;
		}
	}
```

If you notice here, the method removes nodes one by one starting at the parent level. Then anything at that level is added to the results, and then it proceeds to go through the nodes at each level. This might seem a little simplistic, but if you walk through an example tree or two you will see this proves out correct.

If you wanted to see it in action:

```js
const BSTGraph = require("./BSTGraph");

const graph = new BSTGraph(10);

//            10
//         /      \
//        8        22
//       /  \     /  \
//      5    9   21  24
//              /
//             12

graph.add(10);
graph.add(8);
graph.add(5);
graph.add(9);
graph.add(22);
graph.add(21);
graph.add(12);
graph.add(24);

console.log("level order tree traversal, breadth first search");
console.log(graph.levelOrder());
```

The output should look like:

```bash
➜  post git:(master) ✗ node DemoGraph.js
level order tree traversal, breadth first search
[
  10,  8, 22,
   5,  9, 21,
  24, 12
]
```

## Wrapping Up

I hope you've enjoyed my post and learning about binary search trees. In this post I introduced binary search trees and walked through a small implementation with JavaScript.

Binary search trees can be really efficient tools for storing information. The examples we used here were just storing numbers, but when you consider larger applications that can scale you realize the potential.

When you're first learning about binary search trees, they can be difficult to understand. Working through a full implementation helps as you can how each part of the algorithm functions.

I highly recommend working with my sample implementation and watching [the video I shared the YouTube link to earlier](https://www.youtube.com/watch?v=5cU1ILGy6dM).
