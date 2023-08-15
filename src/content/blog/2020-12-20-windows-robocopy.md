---
title: Windows Robocopy
pubDate: 2021-01-12T16:53:40.071Z
snippet: Even though most of our information is getting migrated to the cloud,
  we still have a need for backups. About 7 years ago a coworker of mine showed
  me
heroImage: /images/hello.jpg
tags: ["windows"]
---

Even though most of our information is getting migrated to the cloud, we still have a need for backups. About 7 years ago a coworker of mine showed me [Microsoft's ROBOCOPY](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy) for making backups. This program is still maintained and available with either batch scripts or even powershell. I still use it today for some things and just wanted to write a quick post on it. Its amazing to me that even today with all of the technology we have, tools like this are still used and very powerful.

## What is a Batch Script?

Similar to Shell Scripts in Linux, Batch Scripts are basically files that can be run inside a device running Windows that can be used to automate commands. Think of things like syncing files or any type of task automation. You could use the Windows GUI for this, but most of the time a Batch Script will save you a lot of hassle.

You can create batch scripts on any windows machine if you save the file as `.bat`. If you google the OS commands in the Microsoft Docs, you'll find a lot of information that will let you quickly and easily run what you need.

Here is a basic Batch Script that does nothing more than write something to the console (command prompt in the Window's world) and then puase.

```bash
echo "hello from a Batch Script"
pause
```

If you save this as `HelloWorld.bat` and then run it on your Windows Machine (double click the file), you should see something like this:

![](/images/hello.jpg)

Check out the Microsoft Documentation for more at <https://docs.microsoft.com/en-us/documentation/>.

## What is Microsoft's ROBOCOPY?

So as I stated in the intro, ROBOCOPY is a great tool that can be used to sync or backup files on your Windows machines. When working with ROBOCOPY I recommend first checking out the Microsoft Docs here <https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy>.

The basic syntax of the command is:

```bash
ROBOCOPY <source> <destination> "options"
```

There are a lot of options that you can choose from, including specifying files and even saving the status of a run to a file.

If you want to mirror two folders, then you will typically do somthing like this:

```bash
ROBCOPY <source> <destination> /MIR
```

I usually like to see the output so I also include a `/v` so I can see what's going on in the console like so:

```bash
ROBCOPY <source> <destination> /MIR /v
```

So if you created a `bat` file with just the one call to ROBOCOPY like so:

```bash
ROBOCOPY "C:\Users\<your_username>\Desktop\Post\source" "C:\Users\<your_username>\Desktop\Post\destination" /MIR /v
```

The output would look something like this:

![](/images/output1.jpg)

> Please note that this just copied two files.

You can also choose to have a report created and saved to a file for you. If you add the "/log:<file>" to the end like so:

```bash
ROBOCOPY "C:\Users\<your_username>\Desktop\Post\source" "C:\Users\<your_username>\Desktop\Post\destination" /MIR /log:output.txt
```

This will write the output from the run of ROBOCOPY to a file called `output.txt` and look similar to the following:

```bash

-------------------------------------------------------------------------------
   ROBOCOPY     ::     Robust File Copy for Windows
-------------------------------------------------------------------------------

  Started : Tuesday, January 12, 2021 11:49:51 AM
   Source : C:\Users\<your_username>\Desktop\Post\source\
     Dest : C:\Users\<your_username>\Desktop\Post\destination\

    Files : *.*

  Options : *.* /S /E /DCOPY:DA /COPY:DAT /PURGE /MIR /R:1000000 /W:30

------------------------------------------------------------------------------

	                   2	C:\Users\<your_username>\Desktop\Post\source\

------------------------------------------------------------------------------

               Total    Copied   Skipped  Mismatch    FAILED    Extras
    Dirs :         1         0         1         0         0         0
   Files :         2         0         2         0         0         0
   Bytes :         0         0         0         0         0         0
   Times :   0:00:00   0:00:00                       0:00:00   0:00:00
   Ended : Tuesday, January 12, 2021 11:49:51 AM
```

> Note that this was a rerun of my first example so if you notice it just "skpped" the two files since there was no change to be done.

## Wrapping Up

So this was a quick post, but I just wanted to share this powerful program. I think its really cool that it is still used today. I've also seen first hand that it is very fast with performance and reliable as well.
