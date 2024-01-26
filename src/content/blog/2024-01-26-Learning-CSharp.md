---
title: Learning C#
pubDate: 2024-01-26T19:09:56.028Z
snippet: "C# is one of the most popular programming languages today. As part of the .NET Framework, C# has developed with each release of .NET and provides a fairly robust set of features. I wanted to put together a few posts walking through building a Web API with C#, and also providing some examples of "
heroImage: /images/C_Sharp_Logo_2023.jpg
tags: ["C#", "object oriented", "azure", "microsoft"]
---

C# is one of the most popular programming languages today. As part of the [.NET Framework](https://en.wikipedia.org/wiki/.NET_Framework), C# has developed with each release of .NET and provides a fairly robust set of features. I wanted to put together a few posts walking through building a Web API with C#, and also providing some examples of how to build projects with it. The purpose of this post is to start a series of posts I will be writing on how to use C# from project start to finish. This initial post will provide some general background of C#, and also create simple console application to get started.

## A History of C#

C# (pronounced as "C Sharp") was originally developed by [Anders Hejlsberg, Scott Wiltamuth, and Peter Golde](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/introduction). The first release was done by Microsoft in 2000, and has been gradually added to with releases since.

The intention of C# is for it to be a general purpose language that supports object oriented programs. The language follows the "C Type" languages, and is familiar to individuals that have worked with C or C++ in the past.

C# can be used to develop everything from desktop apps to web APIs. C# is also supported beyond just Microsoft as you can use [C# with AWS Lambdas](https://docs.aws.amazon.com/lambda/latest/dg/lambda-csharp.html). There is a strong community behind C#, and a wealth of information available directly from Microsoft as well as most learning platforms.

C# has garbage collection, nullable types, exception handling, and lambda expressions. The language also includes all of the traditional pieces of a higher level language like conditional statements, object support, primitive data types, and much more.

Since it is part of the .NET framework, you can use the [dotnet CLI](https://learn.microsoft.com/en-us/dotnet/core/tools/) or IDEs like [Visual Studio](https://visualstudio.microsoft.com/) to create C# projects.

C# programs run in the common language runtime (CLR), and compiled into an intermediate language (IL) that complies with the common language infrastructure (CLI) international standard. When programs run they are loaded into the CLR, and the CLR uses Just-In-Time compilation to convert the IL code into machine instructions. There is quite a bit more (and a better explanation) in the [Microsoft Docs on this same topic](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/).

A typical C# program includes a `main` method and looks like the following:

```cs
// originally copied from the Microsoft docs at
// https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/
using System;

class Hello
{
    static void Main()
    {
        // This line prints "Hello, World"
        Console.WriteLine("Hello, World");
    }
}

// when you run the above program, you should see the following:
// Hello, World
```

In C# programs you typically specify a `namespace` which provides a way of organizing C# programs and libraries that a program would use. In the above example, you'll notice the `using System;` as that is saying use the `system` namespace. Having that namespace defined enables you to use `Console.WriteLine` instead of `System.Console.WriteLine`.

C# programs can run with a `main` method as above, or have a `top level` file which runs before any other files in a project. This allows you to run a C# program as a few lines of code without needing to instantiate objects.

With C# you can also define classes and interfaces just like any other [object oriented programming language](https://en.wikipedia.org/wiki/Object-oriented_programming). C# programs allow you to implement polymorphism and inheritance.

C# also supports `generics` and `anonymous types`. Generics and anonymous types give you more power over when you want to define a class type or object in your programs.

C# also supports `exception handling`, and allows you to wrap statements in the traditional `try` and `catch` blocks like the following:

```cs
// example originally copied from
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

As I stated in the introduction, in this post I will be using C# to build a sample console application. In the next section, I'll walkthrough setting up the console application.

If you are interested in learning more about C#, I recommend checking out the following:

- [A tour of the C# Language](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/)
- [Official C# Language Specification](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/introduction)

## Creating a C# .NET Project

When you want to create a C# project, you first have to setup your local environment. How your environment is setup depends on what Operating System you are using.

If you work on a Windows machine, [you should check out the Visual Studio instructions in this tutorial on the Microsoft Docs](https://learn.microsoft.com/en-us/visualstudio/get-started/csharp/tutorial-console?view=vs-2022).

If you work on a Mac, first install the [DotNet SDK](https://learn.microsoft.com/en-us/dotnet/core/install/macos). The DotNet SDK install includes the DotNet CLI so you can create applications with `dotnet new` in a terminal session. On a Mac, you should also use [VSCode](https://code.visualstudio.com/) with the [C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit). The C# Dev Kit extension provides ways to manage your code similar to Visual Studio on windows. There was previously a Visual Studio for Mac, but that is being retired later this year (2024).

I work on a Mac, so I did the above steps and am using VSCode. To create my sample console application, I used the DotNet CLI with the following command:

```bash
dotnet new console -o learn-csharp
```

I then opened the `learn-csharp` project in VSCode and saw the following:

![CSharp 01](/images/CSharp_01.jpg)

To run this, you can use the debugger in VSCode and just click the small icon with the arrow in the left pane. Then click the default configuration and it should start:

![CSharp 02](/images/CSharp_02.jpg)

Given that this is a super simple program and only outputs "Hello World" the following was the result:

```bash
Hello, World!
```

This is a very simple program, but it does show you the basic pieces of what any C# program would look like.

![CSharp 04](/images/CSharp_04.jpg)

First notice the `Program.cs` file. This `Program.cs` file can be thought of as the entry point for the project, and is where your "main" code will run. Since this is a console app, this is considered "top level" code so there is no "main" method like I had alluded to before.

Also notice the `learn-csharp.csproj` file. This `learn-csharp.csproj` file is basically a list of files and assemblies for the .NET runtime to read and follow how to run the project. If you included other libraries like [NuGet Packages](https://learn.microsoft.com/en-us/nuget/what-is-nuget), you would add values here.

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <RootNamespace>learn_csharp</RootNamespace>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>
```

Additionally, you'll notice that there is a `learn-csharp.sln` file. This `learn-csharp.sln` file is basically what guides the Visual Studio IDE on how to run the project. It is not meant to be edited by hand, but there is a format. If you'd like to see the format, [check out the Microsoft Docs](https://learn.microsoft.com/en-us/visualstudio/extensibility/internals/solution-dot-sln-file?view=vs-2022).

Finally, we also have an `obj` folder and a `bin` folder. The `bin` folder stores the compiled binary files that run your project. The `obj` folder holds the intermediate files used by the compiler when generating the solution.

Just to show an example of the code doing more than just outputting a statement, lets change the program to do some basic math. Modify the `Program.cs` file to the following:

```cs
Console.WriteLine("Let's do some math today!");

int value1 = 5;
int value2 = 4;

var answer = value1 + value2;

Console.WriteLine($"5 + 4 is {answer}");
```

When you run this new code, you should see the following:

```bash
Let's do some math today!
5 + 4 is 9
```

This example program first defines two integer values:

```cs
int value1 = 5;
int value2 = 4;
```

Next the program adds the two values and stores the result:

```cs
var answer = value1 + value2;
```

Finally, using [string interpolation](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/interpolated) it outputs the value with a statement:

```cs
Console.WriteLine($"5 + 4 is {answer}");
```

## Wrapping Up

In this post I introduced C# and provided a few fundamentals to get started. I created a sample console project that demonstrated C# in action, and provided some context to create bigger programs. As I stated in the post, C# is a very robust language and can do many things. Teams build C# to build both small and large applications. In my next set of posts I'll be building more things with C# going over advanced concepts. Check back soon on my site for my next C# post. Thanks for reading my post!
