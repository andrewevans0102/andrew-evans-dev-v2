---
title: Christmas fun with a Raspberry Pi
pubDate: 2019-12-02T16:23:38.000Z
snippet: "I had some time off with the holidays, and also recently purchased Canna Kit's Raspberry Pi Zero W starter kit. Putting the two together, I thought it'd be fun to do something Christ"
heroImage: /images/relaxing-1979674_1920.jpg
tags: ["fun projects", "iot"]
---

I had some time off with the holidays, and also recently purchased [Canna Kit’s Raspberry Pi Zero W starter kit](https://www.microcenter.com/product/510647/canakit-starter-kit-with-premium-black-case-for-raspberry-pi-zero-w). Putting the two together, I thought it’d be fun to do something Christmasy with my Raspberry Pi!

This post is going to cover how I was able to create a fireplace display with my Raspberry Pi. Note I’m using a Raspberry Pi Zero W.

## Background

The motivation for this project came from seeing fun fireplace displays in the past. There are apps that you can install on your phone or TV, and there are also lots of YouTube videos available.

I thought it’d be fun to do something similar, but with a Raspberry Pi. It’d be a chance to learn a little more about the Raspberry Pi, and have fun too.

After some googling I ran across several different variations this project. I first saw this [one on the Adafruit Site](https://blog.adafruit.com/2017/12/08/raspberry-pi-perpetual-yule-log-raspberry_pi-piday-raspberrypi/), but after playing with the python scripts realized I wanted a more simple solution if possible. I also saw this [post about using some autoconfiguration](https://www.balena.io/blog/electronjs-the-ultimate-guide/) to play a youtube video on loop. Ultimately, I realized that I could just as easily run an MP4 file on loop with a simple shell command.

In order to do this, I only needed a Raspberry Pi and something that I could connect the display. I already had an old monitor, and just purchased the [Canna Kit’s Raspberry Pi Zero W starter kit](https://www.microcenter.com/product/510647/canakit-starter-kit-with-premium-black-case-for-raspberry-pi-zero-w).

## Final Product

So with my project planned out, I next needed to actually configure the Raspberry Pi and hook everything up. Here’s how I put it all together:

1. First I installed the [Raspian OS](https://www.raspberrypi.org/downloads/raspbian/) on my Raspberry PI Zero W’s SD card.
2. Next I [setup SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/) so I could login to the Pi from my MacBook.
3. Once I was able to connect to my Pi over my network, I then went looking for an MP4 file. I found one that was free on [Pixabay here](https://pixabay.com/videos/fireplace-fire-flames-warmth-warm-1971/).
4. Then I [used SCP](https://unix.stackexchange.com/questions/106480/how-to-copy-files-from-one-machine-to-another-using-ssh) to copy the file from my desktop over to the Pi via SSH (super cool). I put the file in my `/home/pi` folder since I wasn’t doing anything fancy.
5. After some googling I found out that the Raspbian OS comes with omxplayer which is a tool that can run videos on your Pi. I found the command line syntax, and a nice discussion in the [raspberry pi forum thread here](https://www.raspberrypi.org/forums/viewtopic.php?t=191942).
6. I tested omxplayer first directly from the commandline in my SSH terminal. Once that was running, I wanted to set it up to come on automatically so I modified the `/etc/rc.local` file [similar to how it was ran here](https://learn.sparkfun.com/tutorials/how-to-run-a-raspberry-pi-program-on-startup/all).
7. Then I just did a `sudo reboot` and woohoo! I have a fireplace display!

Here’s what the final product looked like:

![](/images/yulelog.jpg)

As you can see, it was fun since I could put it right in a bookshelf in my office. Additionally, since I got the Pi to run it automatically I didn’t need to do any configuration if I needed to restart it.

This was a super simple little project that I learned from and had fun too. It’s really amazing what you can do with the Raspberry Pi line of devices. The best part was that I learned something, and brought enjoyment for my family as well. Hope you enjoyed this post, Merry Christmas!
