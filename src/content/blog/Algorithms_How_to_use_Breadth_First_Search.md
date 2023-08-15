---
title: Algorithms How to use Breadth First Search
pubDate: 2019-04-23T10:26:56.000Z
snippet: "In my previous post I had covered Depth First Search (DFS) to search a graph. Here I'd like to cover Breadth First Search (BFS) and show the difference. Please note my code "
heroImage: /images/world-1264062_960_720.jpg
tags: ["algorithms"]
---

> [cover image was originally copied from here](https://pixabay.com/photos/world-europe-map-connections-1264062/)

In my previous post I had covered Depth First Search (DFS) to search a graph. Here I’d like to cover Breadth First Search (BFS) and show the difference. Please note my code and examples will be in Java.

Depth First Search goes as far as possible into a tree or graph when iterating through. An example would be the following tree:

```java
        4
       / \
      2   5
     / \   \
    0   1   8
       /   /
      7   10
```

A DFS algorithm would go all the way to node 7 in the tree first before iterating through the rest of the nodes. DFS goes to the deepest part of the tree on each iteration.

A BFS algorithm first reviews the children of a tree node or the adjacent nodes in a graph. Then after reviewing those goes deeper into the tree or graph to the next level etc. This is particularly beneficial when you consider algorithms for social media sites. Many times on social media sites, people want to see if someone is within their friend’s friends. A DFS approach would go all the way through each friend relationship one by one and this could potentially be very time consuming. A BFS approach would walk through a friend list and after looking at every friend, go the next level down. Typically social groups etc. are well connected so chances are your friends or friends of friends are only one or two groups away.

So how does this work?

Typically a BFS algorithm will make use of a queue. It walks through a tree or graph, starting with a root node. Then it looks at the children or adjacent nodes to that root, then it looks at their children or adjacent nodes, etc. and so on.

To show this process, you typically start with an implementation of a Node class. The code here is assuming a tree structure, but you could just as easily store an adjacency list if you were to search a graph.

```java
public class Node {
    int value;
    Node left;
    Node right;

    public Node(int v) {
        value = v;
    }
}
```

Then you would build connections through either the children or adjacent nodes. Since I’m going with the tree based structure I’m going to create children nodes (this matches the tree I showed above):

```java
// create nodes
Node root = new Node(4);
Node child2 = new Node(2);
Node child5 = new Node(5);
Node child0 = new Node(0);
Node child1 = new Node(1);
Node child8 = new Node(8);
Node child7 = new Node(7);
Node child10 = new Node(10);

// establish relationships
root.left = child2;
root.right = child5;
child2.left = child0;
child2.right = child1;
child5.right = child8;
child1.left = child7;
child8.left = child10;
```

Now if you wanted to search this tree using DFS you would do something like the following:

```java
public static void printDFS(Node root) {
    if(root == null) {
        return;
    }

    System.out.println(root.value);
    if(root.left != null) {
        printDFS(root.left);
    }
    if(root.right != null) {
        printDFS(root.right);
    }
}
```

the output of a run of this on the tree I created looks like the following:

```bash
4
2
0
1
7
5
8
10
```

If you notice, node 7 was printed before node 10 because the algorithm went all the way down the tree on each run. It should also be noted that this approach could be done iteratively instead of recursively. I’m going with the recursive implementation because I think its easier and more elegant.

So now if you take that same tree but want to search it using BFS, you’d do something like the following:

```java
public static void printBFS(Node root) {
    LinkedList<Node> queue = new LinkedList<Node>();
    queue.add(root);

    while(queue.size() > 0) {
        Node node = queue.remove();
        System.out.println(node.value);
        if(node.left != null) {
            queue.add(node.left);
        }
        if(node.right != null) {
            queue.add(node.right);
        }
    }
}
```

An output from a run of this method would look like the following:

```bash
4
2
5
0
1
8
7
10
```

If you notice, nodes 7 and 10 are now shown at the end. The children of each level are printed first before going all the way down the tree.

One additional trick that you could do would be to print these values in place. Essentially printing at each level. This is fairly easy to do, you just have to keep track of the size of the queue every time you add children like you see in the following:

```java
public static void printBFSTreeLevel(Node root) {
    LinkedList<Node> queue = new LinkedList<Node>();
    queue.add(root);

    while(queue.size() > 0) {
        int queueSize = queue.size();
        for(int i = queueSize; i > 0; i--) {
            Node node = queue.remove();
            System.out.print(node.value + " ");
            if(node.left != null) {
                queue.add(node.left);
            }
            if(node.right != null) {
                queue.add(node.right);
            }
        }
        System.out.println();
    }
}
```

An output of this method would look like the following:

```bash
4
2 5
0 1 8
7 10
```

If you notice, the tree nodes are printed at each level here.

So I hope this post has shown you the basics of BFS vs DFS. I hope it’s also shown you how BFS can be beneficial in some cases depending on your data and use case.
