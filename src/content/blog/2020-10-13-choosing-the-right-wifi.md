---
title: Building Your Home Network
pubDate: 2020-10-13T10:35:24.734Z
snippet: Setting up a home network can be daunting if you're not familiar with
  networking and the latest standards. This summer I went through a journey of
  setting up Wifi at our house to account for our work from home needs, and
  increased use of the internet with the quarantine world.
heroImage: /images/antenna-3645119_1920.jpg
tags: ["consumer electronics"]
---

> _[cover image came from here](https://pixabay.com/photos/antenna-sata-tenne-technology-3645119/)_

Setting up a home network can be daunting if you're not familiar with networking and the latest standards. This summer I went through a journey of setting up Wifi at our house to support both working from home and increased use of the internet in the quarantine world.

I wanted to take a second to share some of the things I learned. This post is going to walkthrough my journey, and some things I learned along the way.

The short version of my final solution was to go with [Netgear's Orbi](https://www.netgear.com/orbi/) for a mesh network setup. We have a node on each floor that provides a consistent signal throughout the house. After several weeks of testing, we found this to be optimal and have only had minor issues since.

I'm going to start by discussing some network basics, and then move onto the hardware I chose and my experience.

## Speed

With any Internet Service Provider (ISP), the first thing they ask you is what speed you would like. Most of the time, ISPs throw big numbers at you and make it sound like you have to have Gigabit Ethernet to be able check your gmail account. This is definitely not reality, and most of the time you only require the ISP's base package for most of your needs.

If you check out [Netflix's recommendations](https://help.netflix.com/en/node/306) you'll see the following:

- 0.5 Megabits per second - Required broadband connection speed
- 1.5 Megabits per second - Recommended broadband connection speed
- 3.0 Megabits per second - Recommended for SD quality
- 5.0 Megabits per second - Recommended for HD quality
- 25 Megabits per second - Recommended for Ultra HD quality

Additionally, basic tasks like web searches or email require a minimal internet speed. The FCC posted a set of metrics that you see here:

![](/images/screen-shot-2020-10-13-at-11.23.11-am.png)

> _[original source](https://www.fcc.gov/consumers/guides/broadband-speed-guide)_

As you see with these numbers, your basic everyday tasks really only require a limited connection. If you do things like stream to multiple devices, or do a lot of online gaming, your speed needs will increase. The more folks you have connected to your network, will also increase your speed needs. If you use things like 4K televisions in your house, this also increases as the signal has to be magnified to account for the higher graphics.

If you compare these numbers to the base values in the Verizon Fios plans, you'll see that they more than compensate for what you need without going all the way up to the highest plan they offer:

![](/images/screen-shot-2020-10-13-at-11.27.16-am.png)

When it came to our home network, I originally choose the 100 mbps package, but we've since upgraded since Fios offered a 200 mbps upgrade for free. Several tests I have ran since have proved this was more than enough for us to have multiple devices streaming and working throughout the day.

## Bandwidth

Bandwidth refers to the number of devices on a network. Most of the newer routers now come as "dual band" where they offer `2.4 GHz` and a `5.0 GHz` bands. If they don't market themselves as "dual band" then they will just produce the `2.4 GHz` band. The physics behind `2.4 GHz` and `5.0 GHz` is just in the way that the radio wave is produced. The Higher `5.0 GHz` wave transmits more data at a lower range. While the lower `2.4 GHz` waves transmits less data but over a longer range.

There are multiple variations of the 802.11 standard you see on many consumer routers. If you have a `n` standard that is the most common, and `ac` is the newest standard that you'll see with newer hardware.

The needs that you have with regards to dual band vs single band are going to be based on (1) how many devices you have and (2) how far they are from the Router.

In the case of our home network, I had quite a few devices and as such could make good use of a dual band setup. There are several routers that boast support for multiple users by having several antennas. What I found was that the more robust routers that offered higher speeds internally (you'll see this on the box) could better handle more connections. This also could be impacted by your choice of either `wifi 5` or `wifi 6` devices. I'll explain more on that in the next section.

Additionally, when you go to buy routers you'll see different speeds that they send data across your network. Usually the higher speeds are a higher price. Just like the overall network speed, your needs will depend on what you're doing.

I also should mention that all of this is dependent on what each device has in its own hardware. If you have a laptop that has a network card that only has support for the `n` standard then you'll be limited to what the `n` can do. Additionally, if your device only has an antenna that can connect to the `2.4 GHz` range (i.e. Raspberry Pi Zero W or just an old device), the dual band won't make a difference here.

With regards to our end solution, the [Orbi setup(https://www.netgear.com/orbi/) hides the `2.4 GHz` and `5.0 GHz` behind one central network. This makes it nice since you won't have to navigate between the two, and your device's hardware will determine which one you connect to. Even when devices are connected to different bands, Orbi still successfully negotiates traffic across bands. With the [orbi tri-band](https://www.netgear.com/landings/mesh-network/) setup, Orbi also includes a third channel that is used for Backhaul. This third channel is what the different mesh nodes use to talk to each other (more on that in the next few sections).

## Fios

If you are not using Fios, then this section probably won't be of much value to you. However, I included it since it was a consideration for how I built our home network.

With FIOS, the network is built with fiber optics. This means that you don't have to use a cable modem to translate the signal over to your Router etc. Rather you have a direct connection from the Fios Optical Network Terminal (ONT) box into your home.

FIOS ONTs have a setting where you can go for an `ethernet` or `coax` input. The advantage of the `coax` is that it will feed your cable boxes directly, whereas if you use the `ethernet` input you will have to get adapters for your cable boxes if you want see the TV guide and other Fios features. When the Fios installation guy originally came to our house, he had me setup a `coax` connection with the Fios Router. When I decided I wanted to use my own router, I swapped over to the `ethernet` setup. You can do this with a direct call to Verizon Support.

Since we had a Verizon Cable box, I still had to have some way to convert the `ethernet` signal into a way that could be read in by the cable box. Otherwise, I could get the cable input, but no support for the TV guide etc.

The solution was to get a [Moca Adapter](https://www.amazon.com/MOTOROLA-Adapter-Ethernet-Bonded-MM1000/dp/B077Y3SQXR/ref=pd_lpo_147_t_0/146-2441655-3901409?_encoding=UTF8&pd_rd_i=B077Y3SQXR&pd_rd_r=0c8c0898-51db-476a-8a93-b6c394ec91e5&pd_rd_w=aP3iI&pd_rd_wg=9bwSs&pf_rd_p=7b36d496-f366-4631-94d3-61b87b52511b&pf_rd_r=GD9N4PW281D1E5SX9G44&psc=1&refRID=GD9N4PW281D1E5SX9G44). I routed our network through the ethernet connection, and then used the moca adapter to convert the ethernet signal back into the cable line. When I did this, the Cable box was able to pickup the Fios programming information for the TV guide and other features. Fios does not widely share this information as they want you to purchase their boxes and routers. However, you can have this up and running easily and then you don't have to rent their equipment.

![](/images/screen-shot-2020-10-13-at-4.46.58-pm.png)

## Mesh Networks

So now I get to one of the cooler parts of home networking. It used to be the case that in order to distribute your network across your home you'd have to setup "repeaters" in far reaching areas of the house that literally repeated the original signal from your Router. This works OK, but if you have a narrow home like a townhouse this isn't ideal because you may literally have a Router 4 floors away.

![](/images/repeater.png)

> _Heres an example of a layout with a repeater. Image was [originally copied from here](https://www.signalbooster.com/blogs/news/everything-you-need-to-know-about-wi-fi-boosters)_

Mesh Networks resolve this issue by creating a "mesh" of nodes that all act as duplicates of the original Router. The wireless signal is shared between each of the "nodes" and they act in unison to handle devices that connect. They also exchange messages back and fourth to handle routing and connecting devices as you move closer and farther away from specific nodes on the network (this is the backhaul channel I mentioned earlier). Here's what a mesh network might look like:

![](/images/screen-shot-2020-10-13-at-5.11.30-pm.png)

> _This is an example layout for a mesh network in a home. This image was [copied from this article](https://www.techhive.com/article/3542039/tips-and-best-practices-for-optimizing-your-smart-home.html)._

Mesh networks can self configure and self heal. Meaning that they can determine which node is perfect for a device based on proximity. Even as you walk around your home, your device will reconnect to the node that is closest to it. Thereby ensuring that you have the strongest connection possible.

The idea of "self healing" just means if one of the nodes gets disconnected, the others can recalibrate with what is left. This is good in the case that a breaker trips or something else happens that turns off one of the nodes on the network.

With regards to communication, the backhaul channel in a mesh network makes all of this possible. In some of the [cheaper options like the Asus AiMesh](https://www.asus.com/microsite/AiMesh/en/index.html), you see this where they pick either the `2.4 GHz` or `5.0 GHz` band to do so. In the more [robust solutions like those from Orbi](https://www.netgear.com/orbi/rbk852.aspx), there is a dedicated band outside of the two traditional bands that is used for backhaul functionality. If you look at a distributed system like that of a city or large organization, there are entire nodes dedicated to this purpose.

There are a lot of really cool things you can do with Mesh networks and I encourage you to check out the [howstuffworks.com article here](https://computer.howstuffworks.com/how-wireless-mesh-networks-work.htm#:~:text=In%20a%20wireless%20mesh%20network,connection%20across%20a%20large%20area.&text=Mesh%20nodes%20are%20small%20radio,way%20as%20a%20wireless%20router).

In the case of my home network, we are in a 4 story townhouse and needed to share the signal across all 4 floors. It was a no brainer to go with the Mesh Network as this will enable us to have a good strong signal throughout the house.

## Wifi 5 or 6

So with mesh networks one common choice you see is determining if you should go with `wifi 5` or `wifi 6`.

The first difference is that `wifi 5` has speeds up to 3.5 Gbps, and `wifi 6` you get speeds of near 9.6 Gbps. Speed here is more specifically the device itself, and you will still be capped by whatever the speed choice was you made on your ISP.

The next difference is that `wifi 6` better handles multiple devices on the same network. Specifically this is around `multi user, multiple input, multiple output` or MU-MIMO. This basically is the technology that enables the routers to handle many devices connected at the same time. Routers that use `wifi 6` can communicate with multiple devices at the same time, rather than broadcasting to one device at a time. With `wifi 5` the MU-MIMO technology can connect up to 4 devices, with `wifi 6` this should enable 8.

There are quite a few details of `wifi 6` that make it a very powerful technology. The Verge wrote a nice article that has more details and [can be seen here] (https://www.theverge.com/2019/2/21/18232026/wi-fi-6-speed-explained-router-wifi-how-does-work).

## Routers

So there are several companies that provide Mesh networks. If you google them, you'll find that the leaders are Orbi and Eero. Both provide various implementations of the Mesh setup. Depending on the time of year and location, you may find periodic deals on whole home systems.

I originally started this with the Asus AiMesh that I had mentioned previously. I had [two Asus RT-AC68U routers](https://www.asus.com/Networking/RTAC68U/) that I had connected via the AiMesh setting. It honestly was a good starter setup. We shared two nodes and had the first one on the top floor of the house, and the other on the second floor. Our offices were on the first and third floors respectively so this was a nice distributed setup. It basically looked similar to this:

![](/images/screen-shot-2020-10-13-at-4.03.14-pm.png)

However, as quarantine set in and we started working from home, we found the network to be routinely taxed at peak times during the day. The Asus AiMesh setup allows you to add additional nodes by literally just buying another RT-AC68U and connecting it as a mesh node. Unfortunately, I tried that and realized that we needed something that could handle the heavier traffic. I also did multiple tests along the way, and still found that we had too much hitting the network at the same time.

So I began a review of what was available in the world of Mesh Networks. I eventually settled on [Netgear's Orbi ](https://www.netgear.com/orbi/)for our home setup. It is incredibly easy to install, and they have a nice app that lets you manage devices on your network. At one point I also even had to contact Netgear Support, and they were very easy to deal with.

The solution we ended up with was to have one node on each of the 4 floors of our home. Since my office is on one floor, and my wife's office is on a different floor, we also made sure to place the nodes in the rooms that our respective offices were in. The initial setup was online very quickly, and I had the house connected in a few hours. After a few weeks of testing, I can really attest to it being a great solution. Here is what the final product looked like:

![](/images/screen-shot-2020-10-13-at-4.06.11-pm.png)

The only caveat that I would say to Orbi, is to make sure that you know which wifi standard you are using. I accidentally bought a `wifi 5` satellite, and found that it could not connect to my `wifi 6` setup. It was an easy fix, but I didn't think to check that until afterwards.

## Closing Thoughts

Everyone has a different home, and thus has different network needs. Some folks can make out fine with a basic one band network. You see this with single bedroom apartments where you don't have to worry about signal stretching across the home. Others need a more robust solution like we had.

Either way, home networking doesn't have to be as scary as it sounds. With some basic googling, and a good understanding of the options available, you can pick the best solution for your situation.

Throughout my setup, I had to test my network multiple times. The Asus AiMesh system has a fantastic mobile app for iOS that enabled me to do all kinds of tests with the network I had setup. I also made good use of [ookla's speed test app](https://www.speedtest.net/) to be able to evaluate signal strength at different parts of my network.

The other thing that helps is to regularly update your device firmware. Firmware is just the software that runs the hardware on the device. All of the companies that make these devices regularly push out firmware upgrades for security and performance. Its good to have those regularly updated as it will ensure your network is performing at a top notch.

Thanks for reading my post! Contact me on [andrewevans.dev](https://www.andrewevans.dev) or on Twitter at [@AndrewEvans0102](https://www.twitter.com/andrewevans0102).
