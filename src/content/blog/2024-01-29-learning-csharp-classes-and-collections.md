---
title: Learning C# Classes and Collections
pubDate: 2024-01-29T17:35:47.472Z
snippet: "Continuing from where I left off in my previous post 'Learning C#', I will continue with a walkthrough of classes and collections. In C# classes and collections are an important part of the language, and essential if you are going to build a full application. This post will cover classes and collections through examples. If you'd like to learn more, I recommend reviewing the"
heroImage: /images/CSHARP_POST2.jpg
tags: ["C#", "object oriented", "azure", "microsoft"]
---

Continuing from where I left off in my previous post [Learning C#](https://andrewevans.dev/blog/2024-01-26-learning-csharp/), I will continue with a walkthrough of `classes` and `collections`. In C# `classes` and `collections` are an important part of the language, and essential if you are going to build a full application. This post will cover classes and collections through examples. If you'd like to learn more, I recommend reviewing the official [C# documentation on classes](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/types) and [C# documentation on collections](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/collections). Some of the examples in this post are taken from the official documentation, and are attributed as such. To make this more fun, I made the rest of the examples reference various Star Wars characters and vehicles.

## What are Classes in C#?

Every programming language has a concept of types. There are primitive types that are included in a language like `integer` or `string`. There are also custom types that can be defined for use in programs. C# is an [object-oriented](https://en.wikipedia.org/wiki/Object-oriented_programming) language and supports concepts like polymorphism, inheritance, and encapsulation. When writing programs with C#, you'll typically create a class which is in itself a type of object that can be created. C# also supports `structs` which are lightweight classes that do not fully support inheritance.

Classes have `constructors` which can have some or no `fields` to define objects made with the class. Classes contain `fields` which contain state and also `methods` which provide actions that the class can do.

An example of a class with some `fields` and `methods` could be the following:

```cs
public class SpaceShip
{
    public bool SupportEmpire { get; }
    public bool HasHyperdrive { get; }

    public Spaceship(bool supportEmpire, bool hasHyperdrive) =>
        (SupportEmpire, HasHyperdrive) = (supportEmpire, hasHyperdrive);
}
```

If you notice in the class, there are fields `SupportEmpire` and `HasHyperdrive` which are defined as `public` and have a `get` associated with them to be able to retrieve the value. The constructor is defined with the following:

```cs
    public Spaceship(bool supportEmpire, bool hasHyperdrive) =>
        (SupportEmpire, HasHyperdrive) = (supportEmpire, hasHyperdrive);
```

The constructor takes in a value for `SupportEmpire` and `HasHyperdrive` and sets it when objects are created.

You can create `Spaceship` objects like the following:

```cs
var ImperialCruiser = new Spaceship(true, true);
var XWingFighter = new Spaceship(false, true);
```

In C#, there is a concept of `base classes` which is where any class is derived. Unless specified, any class in C# has a base class of `object`.

We could extend the `Spaceship` class above like the following:

```cs
public StarFighter: Spaceship
{
    public int WingSpan { get; set; }

    public StarFighter(int wingSpan, bool supportEmpire, bool hasHyperdrive) : base(supportEmpire, hasHyperdrive)
    {
        WingSpan = wingSpan;
    }
}
```

Classes `inherit` members from the base class. Classes can add members, but not removed those inherited.

Just as with any object-oriented programming language, the inheritance in C# allows for you to have the following:

```cs
Spaceship Millennium Falcon = new(false, true);
Spaceship YWingFighter = new StarFighter(200, false, true);
```

## Generic Classes

It is possible to use [generics](https://en.wikipedia.org/wiki/Generic_programming) in C#. With generic classes, you first define types as parameters (similar to the way that fields are defined).

Consider the following program:

```cs
public class RebelVehicle<TWeapon, TMaxSpeed>
{
    public TWeapon Weapon { get; }
    public TMaxSpeed MaxSpeed { get; }

    public RebelVehicle(TWeapon weapon, TMaxSpeed maxSpeed) =>
        (Weapon, MaxSpeed) = (weapon, maxSpeed);
}
```

In this program the parameters `TWeapon` and `TMaxSpeed` allow you to define the type of data input for the `RebelVehicle` constructor when the object is created. So with the above code you could define generic objects like the following:

```cs
var snowspeeder = new RebelVehicle<string, bool>("blaster", 200);
string weaponName = snowspeeder.Weapon;
int maxSpeed = snowSpeeder.MaxSpeed;
```

## Interfaces

Many times in complex C# applications, you will see `interfaces`. In C# interfaces define a contract for the rest of the program to follow. Interfaces can contain methods and properties that a class will use.

An example of an interface with a class implementation would be the following:

```cs
interface IWalker
{
    void WalkSpeed(int speed);
}

public class ImperialWalker: IWalker
{
    public void WalkSpeed(int speed) { }
}
```

Interfaces can have a concept of `multiple inheritance` where one interface can inherit from others. I recommend checking out the [official documentation](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/types#interfaces) for more on multiple inheritance.

## Additional Concepts with C# Language and Classes

Beyond the basic object-oriented concepts, classes also include the normal basic parts of any language including:

- Nullable Types
- Tuples
- Members (constants, fields, properties, properties, etc.)
- Accessibility Settings (public, private, protected, etc.)
- Method Overloading
- Static vs. Instance methods
- Control Statements (do, while, for, foreach, etc.)
- much more

The [official documentation has an entire page](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/program-building-blocks) devoted to specifying the ins and outs of the language specification.

## Exception Handling

As with the "C" style programming languages, exception handling is basically the same syntax as one would expect in C#.

You can just catch an exception to gracefully handle program flow:

```cs
// copied from the official documentation
// https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/

public class ExceptionTest
{
    static double SafeDivision(double x, double y)
    {
        if (y == 0)
            throw new DivideByZeroException();
        return x / y;
    }

    public static void Main()
    {
        // Input for test purposes. Change the values to see
        // exception handling behavior.
        double a = 98, b = 0;
        double result;

        try
        {
            result = SafeDivision(a, b);
            Console.WriteLine("{0} divided by {1} = {2}", a, b, result);
        }
        catch (DivideByZeroException)
        {
            Console.WriteLine("Attempted divide by zero.");
        }
    }
}
```

Note that this example includes both a `try/catch` block over a function that can potentially throw an exception. This allows the application to continue running, even when an exception occurs.

You can also have a `finally` block in your code that runs whether or not an exception occurs:

```cs
// copied from the original documentation
// https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/exception-handling

try
{
    // Code to try goes here.
}
catch (SomeSpecificException ex)
{
    // Code to handle the exception goes here.
}
finally
{
    // Code to execute after the try (and possibly catch) blocks
    // goes here.
}
```

You can also explicitly `throw` an exception:

```cs
// copied from the official documentation
// https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/creating-and-throwing-exceptions

public class ProgramLog
{
    FileStream logFile = null!;
    public void OpenLog(FileInfo fileName, FileMode mode) { }

    public void WriteLog()
    {
        if (!logFile.CanWrite)
        {
            throw new InvalidOperationException("Logfile cannot be read-only");
        }
        // Else write data to the log and return.
    }
}
```

Exceptions include a [StackTrace](https://learn.microsoft.com/en-us/dotnet/api/system.exception.stacktrace?view=net-8.0) object that includes the callstack when the exception occurred. Exceptions also include a [Message](https://learn.microsoft.com/en-us/dotnet/api/system.exception.message?view=net-8.0) object that includes a string with information that could be used in an error message.

The way you handle exceptions in your programs is important because it can control the user experience. If you throw an exception, you should also catch that somewhere else so the program does not "blow up" and gracefully handles the issue.

## Delegates

A really nice feature of C# is the use of [delegates](https://learn.microsoft.com/en-us/dotnet/csharp/delegates-overview). In the context of event programming, `delegates` allow you to pass a method definition as a parameter or variable as well as dynamically invoking them. Where this is valuable is if you want to have something run with a handler. It's easier to see this in an example like the following:

```cs
using System;

// define an initial structure that can be used as a delegate
public delegate void ExampleDelegate(string message);

class Program
{
    static void Main()
    {
        // delegate instance associated with the ShowMessage method
        ExampleDelegate firstInstance = new ExampleDelegate(ShowMessage);

        // invoke method that just shows a message
        firstInstance("hello this is the first delegate");

        // create another delegate instance with a different method
        ExampleDelegate secondDelegate = new ExampleDelegate(ShowCaps);

        // invoke method that shows message in all caps
        secondDelegate("hello this is the second delegate");
    }

    // just show a message
    static void ShowMessage(string message)
    {
        Console.WriteLine($"Original Message: {message}");
    }

    // show a message in all caps
    static void ShowCaps(string message)
    {
        Console.WriteLine($"Caps Message: {message.ToUpper()}");
    }
}
```

In this example, a structure was first defined for the actual delegate (note the `delegate` keyword was used). Then the `firstDelegate` and `secondDelegate` objects control execution of the `ShowMessage` and `ShowCaps` methods. You could directly call the `ShowMessage` or `ShowCaps` methods by themselves, but by using a `delegate` you can pass the execution of those functions somewhere else in a project. The biggest thing about this concept is `that you can encapsulate a method and then pass it somewhere else in your project`. If you'd like to learn more about delegates, the official C# documentation also provides [more examples and more information](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/).

## Async Programming

Many times in applications you have needs that can be done in parallel without necessarily needing to wait for each step to be fully done before starting the other. [Microsoft has a great overview of utilizing asynchronous behaviors in programming](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/task-asynchronous-programming-model) that explains the approach. It helps to understand async behaviors with examples. Borrowing from the [breakfast example in the official documentation](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/), you typically do not cook a meal synchronously. An example being cooking a dinner with the following:

- steamed brocoli
- roasted chicken
- mashed potatoes
- macaroni and cheese

You would cook each of those items alongside one another and not one at a time. If you cooked them one at a time, some would grow cold and it would be a poor dinner experience.

Following an `async/await` model, we could do those same tasks by controlling each task as a thread running in parallel.

So consider an initial program like the following:

```cs
static async Task Main(string[] args)
{
    Brocoli brocoli = await SteamBrocoli();
    Console.WriteLine("brocoli is ready");

    RoastedChicken roastedChicken = await CookRoastedChickenAsync();
    Console.WriteLine("roasted chicken is ready");

    MashedPotatoes mashedPotatoes = await CookMashedPotatoesAsync();
    Console.WriteLine("mashed potatoes is ready");

    MacAndCheese macAndCheese = await CookMacAndCheeseAsync();
    drainWater(macAndCheese);
    AddCheese(macAndCheese);
    AddMilk(macAndCheese);
    MixContents(macAndCheese);

    Console.WriteLine("mac and cheese is ready");
}
```

In C# (similar to JavaScript), you just add `async` to a function declaration where you will have statements that need to be waited on. The `await` keyword blocks the main thread to wait for execution of that method before continuing. Even though we've lined up all of our dinner steps here, the above program still would do each task one after the other.

Now lets do some refactoring, first we group each work item as a [Task](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task?view=net-8.0).

```cs
static async Task Main(string[] args)
{
    Task<Brocoli> brocoliTask = SteamBrocoliAsync();
    Brocoli brocoli = await brocoliTask;
    Console.WriteLine("brocoli is ready");

    Task<RoastedChicken> roastedChickenTask = CookRoastedChickenAsync();
    RoastedChicken roastedChicken = await roastedChickenTask();
    Console.WriteLine("roasted chicken is ready");

    Task<MashedPotatoes> mashedPotatoesTask = CookMashedPotatoesAsync();
    MashedPotatoes mashedPotatoes = await mashedPotatoesTask();
    Console.WriteLine("mashed potatoes is ready");

    Task<MacAndCheese> macAndCheeseTask = CookMacAndCheeseAsync();
    MacAndCheese macAndCheese = await macAndCheeseTask();
    drainWater(macAndCheese);
    AddCheese(macAndCheese);
    AddMilk(macAndCheese);
    MixContents(macAndCheese);
    Console.WriteLine("mac and cheese is ready");
}
```

With the way the steps are laid out now, we are still doing everything one at a time. However, offloading this into tasks allows us to initiate processes and continue doing other things instead of having to do things one at a time. Consider the step where we are cooking the mac and cheese:

```cs
Task<MacAndCheese> macAndCheeseTask = CookMacAndCheeseAsync();
MacAndCheese macAndCheese = await macAndCheeseTask();
drainWater(macAndCheese);
AddCheese(macAndCheese);
AddMilk(macAndCheese);
MixContents(macAndCheese);
Console.WriteLine("mac and cheese is ready");
```

What if we were able to do the other tasks alongside this task, and so while everything else was cooking, we could mix the mac and cheese and save some time? We can do this with refactoring the main method:

```cs
static async Task Main(string[] args)
{
    // start the tasks that can be done in parallel
    Task<Brocoli> brocoliTask = SteamBrocoliAsync();
    Task<RoastedChicken> roastedChickenTask = CookRoastedChickenAsync();
    Task<MashedPotatoes> mashedPotatoesTask = CookMashedPotatoesAsync();
    Task<MacAndCheese> macAndCheeseTask = CookMacAndCheeseAsync();

    // wait for the mac and cheese while the other tasks are still running
    MacAndCheese macAndCheese = await macAndCheeseTask();
    drainWater(macAndCheese);
    AddCheese(macAndCheese);
    AddMilk(macAndCheese);
    MixContents(macAndCheese);
    Console.WriteLine("mac and cheese is ready");

    // now with the mac and cheese done call await to finish up anything else still in process
    Brocoli brocoli = await brocoliTask;
    Console.WriteLine("brocoli is ready");
    RoastedChicken roastedChicken = await roastedChickenTask();
    Console.WriteLine("roasted chicken is ready");
    MashedPotatoes mashedPotatoes = await mashedPotatoesTask();
    Console.WriteLine("mashed potatoes is ready");

}
```

If we notice in the example, for Mac and Cheese we additionally do a few steps. We can improve this code by wrapping all of these into an asynchronous method that does those steps creating cleaner code:

```cs
static async Task Main(string[] args)
{
    // start the tasks that can be done in parallel
    Task<Brocoli> brocoliTask = SteamBrocoliAsync();
    Task<RoastedChicken> roastedChickenTask = CookRoastedChickenAsync();
    Task<MashedPotatoes> mashedPotatoesTask = CookMashedPotatoesAsync();
    // define wrapped steps for mac and cheese
    TAsk<MacAndCheese> macAndCheeseTask = await MakeAndMixMacAndCheese();

    // await the mac and cheese to be done before the others
    var macAndCheese = await macAndCheeseTask();
    Console.WriteLine("mac and cheese is ready");
    Brocoli brocoli = await brocoliTask;
    Console.WriteLine("brocoli is ready");
    RoastedChicken roastedChicken = await roastedChickenTask();
    Console.WriteLine("roasted chicken is ready");
    MashedPotatoes mashedPotatoes = await mashedPotatoesTask();
    Console.WriteLine("mashed potatoes is ready");
}

static async Task<MacAndCheese> MakeAndMixMacAndCheese()
{
    // call async behavior first
    var macAndCheese = await CookMacAndCheeseAsync();

    // do additional steps
    drainWater(macAndCheese);
    AddCheese(macAndCheese);
    AddMilk(macAndCheese);
    MixContents(macAndCheese);

    // return finished value
    return macAndCheese;
}
```

Now with the mac and cheese task being wrapped, we have a set of tasks that we can manage cleanly.

You can also group the asynchronous tasks and allow the [Task Class](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task?view=net-8.0) to wait for everything to be done with a `Task.WhenAll` like the following:

```cs
static async Task Main(string[] args)
{
    // start the tasks that can be done in parallel
    Task<Brocoli> brocoliTask = SteamBrocoliAsync();
    Task<RoastedChicken> roastedChickenTask = CookRoastedChickenAsync();
    Task<MashedPotatoes> mashedPotatoesTask = CookMashedPotatoesAsync();
    // define wrapped steps for mac and cheese
    TAsk<MacAndCheese> macAndCheeseTask = await MakeAndMixMacAndCheese();

    // await the mac and cheese to be done before the others
    await Task.WhenAll(brocoliTask, roastedChickenTask, mashedPotatoesTask, macAndCheeseTask);
    Console.WriteLine("mac and cheese is ready");
    Console.WriteLine("brocoli is ready");
    Console.WriteLine("roasted chicken is ready");
    Console.WriteLine("mashed potatoes is ready");
}

static async Task<MacAndCheese> MakeAndMixMacAndCheese()
{
    // call async behavior first
    var macAndCheese = await CookMacAndCheeseAsync();

    // do additional steps
    drainWater(macAndCheese);
    AddCheese(macAndCheese);
    AddMilk(macAndCheese);
    MixContents(macAndCheese);

    // return finished value
    return macAndCheese;
}
```

There is also a `Task.WhenAny` which will return if any of the tasks complete. For an example of this, [check out the Microsoft docs](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/#await-tasks-efficiently).

Handling exceptions in async code is also fairly straightforward. You throw exceptions and catch exceptions the same way you would in other C# programs. When wrapping async calls in Tasks, the [Task.Exception](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task.exception?view=net-8.0#system-threading-tasks-task-exception) object holds the result. If you have multiple things that could throw exceptions, you can check the `Task.Exception` property for more information when handling errors in your programs.

## C# Collections

The term `collections` in C# covers how the language organizes groups of items. There are a lot of different built in data types for collections including Arrays, Lists, Dictionaries, Stacks, and others.

One cool part about C# collections is how it includes support for [LINQ queries](https://learn.microsoft.com/en-us/dotnet/csharp/linq/get-started/introduction-to-linq-queries). LINQ queries are expressions that retrieve data from a source. Instead of having specific queries for different data sources, LINQ queries in C# provides a common method of writing searchable expressions.

According to the [official documentation](https://learn.microsoft.com/en-us/dotnet/csharp/linq/get-started/introduction-to-linq-queries), LINQ queries will usually have the following pattern:

1. Obtain or define a data source
2. Create a query statement
3. Execute the query statement you created

A great example of a LINQ query is the following:

```cs
// define a data source
string[] spaceVehicles = ["XWing Fighter", "YWing Fighter", "Tie Fighter", "Imperial Cruiser"];

// create a query on the data source
var vehicleQuery =
    from vehicle in spaceVehicles
    where vehicle.Contains("Fighter")
    select vehicle;

// run the query you defined
foreach (string vehicle in vehicleQuery)
{
    Console.Write(vehicle);
}
// expected to write
// XWing Fighter
// YWing Fighter
// Tie Fighter
```

> There is also support in [EntityFramework](https://learn.microsoft.com/en-us/ef/core/) for LINQ with the `IQueryable` return type.

The execution of a LINQ query occurs only when the program iterates over a query. So in the above example, the `foreach` loop is where the query is actually ran.

You can also combine LINQ queries into [lambda expressions](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/lambda-expressions). Lambda expressions in C# allow you to write code in shorthand similar to the following:

```cs
// originally copied from the official docs
// https://learn.microsoft.com/en-us/dotnet/csharp/linq/get-started/write-linq-queries#standard-query-operator-extension-methods

int[] numbers = [ 5, 10, 8, 3, 6, 12 ];

// Query syntax:
IEnumerable<int> numQuery1 =
    from num in numbers
    where num % 2 == 0
    orderby num
    select num;

// Method syntax:
// note the lambda query is num => num % 2 == 0
IEnumerable<int> numQuery2 = numbers.Where(num => num % 2 == 0).OrderBy(n => n);

foreach (int i in numQuery1)
{
    Console.Write(i + " ");
}
Console.WriteLine(System.Environment.NewLine);
foreach (int i in numQuery2)
{
    Console.Write(i + " ");
}
```

In C# there is a lot of different options for how you would handle iterating through data. There are the standard built in methods like `for` and `foreach`. There is also a way to define a [custom iteration](https://learn.microsoft.com/en-us/dotnet/csharp/iterators#enumeration-sources-with-iterator-methods) of values.

## Common things you see with Classes and Collections

What I've covered so far in the above sections is a high level of what the C# language looks like when considering Classes and Collections. Every project is different, and certain teams will choose to do things with different styles. The important part is to understand how to think of data for your applications.

If you are building something like a Web API with C#, it may be good to define `interfaces` for methods that your endpoints use. Typically you would do something like have a class that defines your endpoints, then have an orchestration class that does the actual business logic. The orchestration class will probably have an interface that can be followed.

Interfaces are great assets to any project because it abstracts implementations and provides a set model for pieces of your application. In unit testing C#, interfaces are also great because many of the popular C# unit testing frameworks (topic for a future post) support injecting values using an interface vs. full implementation.

Interfaces also help a great deal with dependency injection, as you can have different implementations that you can swap out within parts of your application.

LINQ queries and collections are also really powerful to use in any C# application. I did not mention it in the section on collections, but use of the [List Class](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1?view=net-8.0) in C# is great because of the built in ways it handles groups of items.

Each team that does a C# project may favor specific features over others. The official documentation provides some guidance in the form of [naming](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/identifier-names) and [conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions).

## Wrapping Up

In this post I touched on the larger concepts in both classes and collections in C#. I walked through how `classes`, `exception handling`, `delegates`, and `async programming` works. I also discussed `collections` with `LINQ queries` and `Lambda Expressions`. What I've covered here is just a high level of all of these concepts. C# is a very robust language and there are many more features available. There are more advanced features like `Reflection` and `Attributes` as well as much more in the [advanced topics part of the official documentation](https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/reflection-and-attributes/). As I've stated throughout the post, I generally recommend reviewing the [official documentation](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/) for a more in depth review of everything. I'll be writing some more posts on C# soon covering Web API projects, please check back when they'll be available. Thanks for reading my post!
