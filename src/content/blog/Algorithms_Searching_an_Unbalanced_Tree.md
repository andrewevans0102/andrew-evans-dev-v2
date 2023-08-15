---
title: Algorithms Searching an Unbalanced Tree
pubDate: 2019-05-01T14:19:05.000Z
snippet: "I worked through a recent code challenge and wanted to write about it. The challenge was to evaluate a tree and identify nodes that don't have parents or only have 1 parent. "
heroImage: /images/montenegro-599232_1920.jpg
tags: ["algorithms"]
---

> [cover image was originally copied from here](https://pixabay.com/photos/montenegro-hiking-hiker-black-599232/)

I worked through a recent code challenge and wanted to write about it. The challenge was to evaluate a tree and identify nodes that don’t have parents or only have 1 parent. The data would be presented to you as a 2D array and be similar to the following:

         1   4   8   10
          \ / \ / \ /
           3   5   2
          /     \
         7       9

In this example nodes 1, 4, 8, and 10 have no parents. Nodes 7 and 9 have only one parent.

So how would we do this?

There are many approaches, but a simple approach would be to just use a HashMap to map the tree and the number of parents. Then use that HashMap to understand situations when you have 1 parent vs no parents.

Here’s the total code (including a main method):

```java
public static void main(String [] args) {

    int[][] children = new int[][]{
        {1, 3}, {3, 7}, {4,3}, {4, 5},
        {8, 5}, {8, 2}, {5, 9}, {10, 2}
    };

    Map<String, List<Integer>> oneZero = findParents(children);

    for(Map.Entry<String, List<Integer>> entry: oneZero.entrySet()) {
        System.out.println(entry.getKey());
        for(int value: (ArrayList<Integer>) entry.getValue()) {
            System.out.print(value + " ");
        }
        System.out.println();
        System.out.println();
    }

}

public static Map<String, List<Integer>> findParents(int[][] parentsChild) {

    HashMap<String, List<Integer>> output = new HashMap<String, List<Integer>>();

    HashMap<Integer, Integer> parentsList = new HashMap<Integer, Integer>();

    // capture parent numbers into a HashMap
    for(int row = 0; row < parentsChild.length; row++) {
        if(!parentsList.containsKey(parentsChild[row][1])) {
            parentsList.put(parentsChild[row][1], 1);
        } else {
            parentsList.put(parentsChild[row][1], 2);
        }
    }

    // compare parentslist to original tree to find where there are no parents
    ArrayList<Integer> zeroParent = new ArrayList<Integer>();
    for(int row = 0; row < parentsChild.length; row++) {
        if(!parentsList.containsKey(parentsChild[row][0])) {
            if(!zeroParent.contains(parentsChild[row][0])) {
                zeroParent.add(parentsChild[row][0]);
            }
        }
    }

    // consult the values in the parent list to identify where there is only 1 parent
    ArrayList<Integer> oneParent = new ArrayList<Integer>();
    for(Map.Entry<Integer, Integer> value: parentsList.entrySet()) {
        if((Integer)value.getValue() == 1) {
            oneParent.add(value.getKey());
        }
    }

    // capture output in output
    // these will be printed to the console
    output.put("Zero Parent", zeroParent);
    output.put("One Parent", oneParent);

    return output;
}
```

If you notice, the data is passed in as a 2D array. The 2D array is always only going to be of depth 2, so this code takes advantage of that in the initial for loop where it adds a value to the HashMap with a parent total of 1 the first time its found, then makes it a total of 2 if its found again:

```java
for(int row = 0; row < parentsChild.length; row++) {
    if(!parentsList.containsKey(parentsChild[row][1])) {
        parentsList.put(parentsChild[row][1], 1);
    } else {
        parentsList.put(parentsChild[row][1], 2);
    }
}
```

The code here is fairly self explanatory, but the approach of using a HashMap enables you to capture the tree’s relations in a way that answers the original problem. HashMaps are very powerful and I recommend using them for many different problems.

This code shows you one method of using a HashMap, but many times specific languages offer customized classes that force order or other useful mechanisms. Check out this code yourself and google Java HashMaps for some other cool articles on this topic.
