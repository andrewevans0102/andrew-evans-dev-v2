---
title: Algorithms How to use Binary Search
pubDate: 2019-04-23T10:46:20.000Z
snippet: "Previously I've written posts on both Depth First Search (DFS) and Breadth First Search (BFS) algorithms. I also wanted to write a brief post on Binary Search. Please note t"
heroImage: /images/work-731198_960_720.jpg
tags: ["algorithms"]
---

> [cover image was originally copied from here](https://pixabay.com/photos/work-typing-computer-notebook-731198/)

Previously I’ve written posts on both Depth First Search (DFS) and Breadth First Search (BFS) algorithms. I also wanted to write a brief post on Binary Search. Please note that I’m going to be sharing code in Java.

Binary Search is an optimized search algorithm that takes advantage of the case when data is sorted. Whenever you see code challenges or academic problems that mention sorted lists, you usually should go for Binary Search.

The algorithm itself is incredibly simple and just focuses on the lowest value, highest value, and midpoint of a data set. The basic algorithm walks through a data set and does the following:

1.  Calculate the midpoint as the low + ( (high- low) / 2).
2.  If the midpoint value is less than the target (what you’re looking for) make your low equal to your midpoint + 1.
3.  If the midpoint value is greater than the target (what your’e looking for) make your high equal to your midpoint – 1.
4.  If the value at the midpoint is what you are looking for, return that.

The reason Binary Search is a good choice is when you consider trying to loop through all the data in a set. If you have a very long data set, binary search could potentially cut down the runtime drastically. Only subsets of the data have to be considered as the algorithm parses the data. This prevents having to have your algorithm look at each specific value.

So in code this would look like the following algorithm. Note that this algorithm is just returning the index where the target occurs.

```java
public static String helper(int[] nodes, int low, int high, int target) {
    while(low <= high){
        int mid = low + ((high - low) / 2);
        System.out.println("low: " + low + " high: " + high + " mid: " + mid + " target: " + target);
        if (nodes[mid] < target) {
            low = mid + 1;
        } else if(nodes[mid] > target) {
            high = mid - 1;
        } else {
            return "value was found at index " + mid;
        }
    }

    return "Value was not found";
}
```

This method takes in an array of integers that represent nodes. You could first create the data set and call this same method with the following:

```java
int[] nodes = new int[5];
nodes[0] = 10;
nodes[1] = 20;
nodes[2] = 30;
nodes[3] = 40;
nodes[4] = 50;

System.out.println(helper(nodes, 0, nodes.length - 1, 20));
```

The output from this method call would look like the following (the target was the value 20):

```java
low: 0 high: 4 mid: 2 target: 20
low: 0 high: 1 mid: 0 target: 20
low: 1 high: 1 mid: 1 target: 20
value was found at index 1
```
