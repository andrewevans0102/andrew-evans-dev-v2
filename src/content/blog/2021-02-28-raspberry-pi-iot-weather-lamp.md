---
title: Raspberry Pi Weather Lamp
pubDate: 2021-03-01T22:35:20.201Z
snippet: "Recently I had a fun idea for an IoT project where I could have a lamp
  tell me what the weather was doing. My basic premise was that the lamp would
  turn different colors based on conditions like Rain, Snow, Clouds, or Sun.
  There are many APIs that can give me forecast information freely, "
heroImage: /images/screen-shot-2021-03-01-at-5.30.10-pm.png
tags: ["fun projects", "iot", "python", "fun projects"]
---

Recently I had a fun idea for an IoT project where I could have a lamp tell me what the weather was doing. My basic premise was that the lamp would turn different colors based on conditions like Rain, Snow, Clouds, or Sun. There are many APIs that can give me forecast information freely, so I just needed to pull together a way to power the lamp and a way to change colors.

In this post, I'm going to walkthrough how I built a weather lamp with a Raspberry Pi and a 3D printed lamp. To run this lamp I'm using Python and you can see a full copy of all the source code I go over at my repo <https://github.com/andrewevans0102/weather-lamp>.

I also created a YouTube video that covers this same project. Check it out at the following:

[![Weather Lamp Raspberry Pi Video](https://img.youtube.com/vi/DegG45uVvhg/0.jpg)](https://www.youtube.com/watch?v=DegG45uVvhg)

## Required Materials

To do this project, you only need some basic materials that you can get either directly off of Amazon or at your local hobby store. If you wanted to 3D print the lamp itself, that would require a 3D printer. However, you can find votive lamps and covers on Amazon that provide the same look and feel and could be used instead.

For the hardware part of the project:

1. [Raspberry Pi Zero W starter kit including power supply and SD card](https://www.amazon.com/CanaKit-Raspberry-Wireless-Complete-Starter/dp/B072N3X39J/ref=sr_1_4?dchild=1&keywords=raspberry+pi+zero+w&qid=1614533683&sr=8-4)
2. [Bread Board](https://www.amazon.com/Breadboards-Solderless-Breadboard-Distribution-Connecting/dp/B07DL13RZH/ref=sr_1_8?dchild=1&keywords=breadboard&qid=1614533748&sr=8-8)
3. [LED lights and resistors](https://www.amazon.com/dp/B01ERP6WL4/ref=cm_sw_em_r_mt_dp_N4KN1CKWQSMCA4KQJ352)
4. [Jumper Wires](https://www.amazon.com/dp/B07GD2BWPY/ref=cm_sw_em_r_mt_dp_QDH5R89007RT4EGHH6Q0)

If you have a 3D printer, you can use the STL and GCODE file that I've included in [my GitHub repo in the "lamp-model" folder](https://github.com/andrewevans0102/weather-lamp). The original file was found at [Thingiverse here](https://www.thingiverse.com/thing:31722).

Some notes on the hardware:

- There are a lot of places to get all of these things.
- The [CanaKit package](https://www.amazon.com/CanaKit-Raspberry-Wireless-Complete-Starter/dp/B072N3X39J/ref=sr_1_4?dchild=1&keywords=raspberry+pi+zero+w&qid=1614533683&sr=8-4) I linked is great and I've used it for several projects. I highly recommend that.
- The `Bread Board`, `Resistors`, `Jumper Wires`, and `LED lights` can be all bought together. I linked them individually just to show what you would need.
- The reason we need a `resistor` is because they are necessary to control the power consumption from the Raspberry Pi. The Raspberry Pi itself can only provide about 60mA but the LEDs will want to pull more. You'll need at least a 330Ω resistor. When setting this all up, I found the [this post on PiHut](https://thepihut.com/blogs/raspberry-pi-tutorials/27968772-turning-on-an-led-with-your-raspberry-pis-gpio-pins) super helpful with explaining why you need this and how it works.
- As I stated in the intro, if you don't have a 3D printer there are a lot of alternatives to the cool lamp cover I printed. I recommend some googling and even other DIY ideas for fun.
- If you notice the Raspberry Pi I'm using already has GPIO pins soldered on board. Usually if you buy a Raspberry Pi Zero W, it doesn't have these. You can solder them yourself very easily, or you could get a kit that has this all connected. You could also get a different Raspberry Pi that has the GPIO pins already onboard. If you want to go the soldering route, check out [this kit on Amazon that has an iron and the necessary equipment](https://www.amazon.com/dp/B07GJNKQ8W/ref=cm_sw_em_r_mt_dp_6ZFC02HM1CNXT7BG7P5B?_encoding=UTF8&psc=1).

## Setting up your Raspberry Pi

Setting up for your Raspberry Pi project only takes a few steps. If this is your first Raspberry Pi project, you should first check out [the Raspberry Pi website](https://www.raspberrypi.org/) because they have some great docs on getting to know your device.

For this project I'm using what is called a "headless" setup where the Raspberry Pi doesn't have a desktop environment, and is controlled via SSH and the terminal. To do this, do the following:

1. Format the SD card of your Pi with the [official Raspberry Pi Imager](https://www.raspberrypi.org/software/). Once you install the imager just choose the 32 bit Raspberry Pi Lite version that you see here:

   ![Raspberry Pi OS Imager](/images/screen-shot-2021-02-28-at-12.59.36-pm.png)

2. Next, once your SD card is formatted, remove and reinsert the SD card into your computer and open the "boot" folder that opens up. This should automatically happen, but if not then just go into your Finder or File Explorer (windows) and navigate into the attached SD card and "boot" folder.
3. In the boot folder add a `WPA_SUPPLICANT.conf` folder that follows [the official Raspberry Pi instructions](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md).
4. Additionally, you need to add an empty file that is just named "SSH" into your boot folder. This is so that when the Raspberry Pi boots up it will automatically turn on SSH, and then you can directly SSH into the machine after seeing its IP address appear on your network. If you have questions or want to know more about this, check out the Raspberry Pi docs at <https://www.raspberrypi.org/documentation/remote-access/ssh/README.md> (look for "Enable SSH on a headless Raspberry Pi" on that webpage).
5. With all of that setup, you can now go ahead and plugin your Raspberry Pi and go to your terminal to get started!

## Wiring up your Pi

So now you've got a Raspberry Pi all connected, but you need to wire it to your LEDs so we can write some code to turn them on and off.

The Raspberry Pi has [GPIO headers](https://www.raspberrypi.org/documentation/usage/gpio/) which are basically several hot "leads" that you can connect wires or other peripherals for creating circuits. This is really intuitive and one of the coolest parts of the Raspberry Pi.

Here is a mapping of the GPIO headers you should have on the Raspberry Pi Zero W:

![Raspberry Pi Zero W GPIO Headers](/images/raspberry-pi-zero-w-gpio.png)

> I copied this diagram at [stack exchange](https://raspberrypi.stackexchange.com/questions/83610/gpio-pinout-orientation-raspberypi-zero-w)

Borrowing this diagram from [the PiHut's post on LED lights](https://thepihut.com/blogs/raspberry-pi-tutorials/27968772-turning-on-an-led-with-your-raspberry-pis-gpio-pins). Your first setup will look something like this:

![Raspberry Pi Connected to LEDs](/images/screen-shot-2021-02-28-at-1.10.09-pm.png)

> this image was copied from [the PiHut post here](https://thepihut.com/blogs/raspberry-pi-tutorials/27968772-turning-on-an-led-with-your-raspberry-pis-gpio-pins).

If you notice, the Raspberry Pi in the picture is a Raspberry Pi 4 (or at least some variation of it). That's fine for our purpose because it still has the same setup for a Raspberry Pi Zero W.

To map the connections on your Raspberry Pi Zero W, I recommend following the above picture and you can use [the diagram available on pinout for a more interactive view](https://pinout.xyz/pinout/3v3_power).

What you see here is:

1. first a `ground connection` from the a ground pin on the Raspberry Pi to the breadboard
2. a `power connection` from one of the Raspberry Pi GPIO power pins to the breadboard
3. a `resistor` that runs between the breadboard connection for the LED light and the Raspberry Pi power source (reduces the energy pull from the Raspberry Pi)

If you're new to breadboards, they function as basically mediums that carry current. You should not two important concepts:

- The two lines on the edge of the breadboard (denoted with the blue and red lines) are considered "rails". Anything you plugin to one of the pins on these "rails" is accessible to anything that connects to the rail. This is super useful if you want to have a ground connection for an array of circuits.
- The vertical lines (that should have numbers next to them) also share a current. So basically because the resistor is plugged into the breadboard between the LED light and the grounded rail, the current is shared along that line in such a way that if you were to move the resistor connection a little farther down the same vertical line you could have a second LED draw power on this line.

If my attempt at explaining breadboards here is confusing, please check out the PiHuts post which also provides a similar (and probably a better) explanation at [this website](https://thepihut.com/blogs/raspberry-pi-tutorials/27968772-turning-on-an-led-with-your-raspberry-pis-gpio-pins).

On my Raspberry Pi Zero W, for my first setup I made the following connections:

1. Jumper Wire from `GND pin on Raspberry Pi (next to pin GPIO 26)` to `blue "rail" on breadboard`
2. Resistor from `blue rail` to `vertical column on bread board (mine had a #2 next to it)`
3. `LED with short leg (no kink)` to `vertical column on bread board (mine had a #2 next to it)
4. Jumper Wire from `GPIO pin 21 on Raspberry Pi` to `vertical column on bread board where LED long leg (no kink) was connected (mine had a #3 next to it)`

So now you should have your Raspberry Pi wired up, so now we can write code to turn on the light!

## First Program

So at this point you should have your Raspberry Pi wired up, and you can go ahead and turn it on. You should look at your router or whatever program you use to see connected IP addresses. Find your Raspberry Pi's IP address and then go to your computers terminal. You can SSH into your pi with `ssh pi@<ip_address>`. Then you should go ahead and run `sudo raspi-config` to change your SSH password, set your timezone, and (if you wanted to) change your hostname. I changed mine to "weatherlight" so I could just ssh into it with `ssh pi@weatherlight.local`. If you have more questions about raspi-config, check out the raspberry pi docs at <https://www.raspberrypi.org/documentation/configuration/raspi-config.md>.

Now we're going to be using Python's `RPI.GPIO` library, check out their page on how to install it at <https://pypi.org/project/RPi.GPIO/>. You should be able to use `pip3` but if that's an issue, install that package with the instructions at <https://www.raspberrypi.org/documentation/linux/software/python.md>.

Once you've go the `RPI.GPIO` library setup, you can run your first program. So When I was just starting out, I followed the [the PiHut post here](https://thepihut.com/blogs/raspberry-pi-tutorials/27968772-turning-on-an-led-with-your-raspberry-pis-gpio-pins). Copying basically the same program they provide there, my first program was this:

```python
import RPi.GPIO as GPIO
import time

white_light=21


GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(white_light,GPIO.OUT)
print("LED on")
GPIO.output(white_light,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(white_light,GPIO.LOW)
```

If you're following along [in my GitHub repo](https://github.com/andrewevans0102/weather-lamp) this is the program `first_light.py`.

All this does is pass the command to turn ON the LED light, wait 1 second, and then turn it off. If you run this, you should see your light turn on, and then off.

For this project, I also needed to connect multiple lights, so I followed the same process and connected several LEDs to my Raspberry Pi. I then extended the `first_light.py` program to include these connections to verify they were running correctly with:

```py
import RPi.GPIO as GPIO
import time

white_light=21
green_light=20
yellow_light=16
blue_light=14
red_light=18
red_2=17
blue_2=27
yellow_2=22
green_2=10
white_2=9

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(white_light,GPIO.OUT)
print("LED on")
GPIO.output(white_light,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(white_light,GPIO.LOW)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(green_light,GPIO.OUT)
print("LED on")
GPIO.output(green_light,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(green_light,GPIO.LOW)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(yellow_light,GPIO.OUT)
print("LED on")
GPIO.output(yellow_light,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(yellow_light,GPIO.LOW)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(blue_light,GPIO.OUT)
print("LED on")
GPIO.output(blue_light,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(blue_light,GPIO.LOW)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(red_light,GPIO.OUT)
print("LED on")
GPIO.output(red_light,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(red_light,GPIO.LOW)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(red_2,GPIO.OUT)
print("LED on")
GPIO.output(red_2,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(red_2,GPIO.LOW)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(blue_2,GPIO.OUT)
print("LED on")
GPIO.output(blue_2,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(blue_2,GPIO.LOW)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(yellow_2,GPIO.OUT)
print("LED on")
GPIO.output(yellow_2,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(yellow_2,GPIO.LOW)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(green_2,GPIO.OUT)
print("LED on")
GPIO.output(green_2,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(green_2,GPIO.LOW)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(white_2,GPIO.OUT)
print("LED on")
GPIO.output(white_2,GPIO.HIGH)
time.sleep(1)
print("LED off")
GPIO.output(white_2,GPIO.LOW)
```

If you're following along [in my GitHub repo](https://github.com/andrewevans0102/weather-lamp) this is the program `verify_lights.py`.

So now I had everything wired and could see everything was working with my program. I now needed to pull in a weather forecast and adjust the lights accordingly.

## Weather Forecast

So in order to get the weather, there are many APIs that provide variations of weather information. I live in the US and decided to go with the (free) NOAA APIs that the National Weather Service provides. In order to use those APIs, you just need a Latitude and Longitude to be able to pass and get the current conditions. I'm not going to go into the ways to use their APIs, but will refer you to my previous post on how to find the weather forecast for your area at <https://rhythmandbinary.com/post/National_Weather_Service_API>. I specifically was looking at the "hourly" forecast endpoint, so I could get the conditions each hour and update my light accordingly.

The URL I ended up getting for my location (Richmond, Va) is <https://api.weather.gov/gridpoints/AKQ/38,80/forecast/hourly>.

Once you've got the URL for your location, you can now write some Python to call the weather service and pull out the necessary information.

I used [Python Requests](https://pypi.org/project/requests/) to make my API call and the basic call and data parsing looked like this:

```py
# weather call
weatherURL = "https://api.weather.gov/gridpoints/AKQ/38,80/forecast/hourly"

# call weather service
response = requests.get(weatherURL)

# parse JSON
hourlyWeather = response.json()
properties = hourlyWeather["properties"]
periods = properties["periods"]
rightNow = periods[0]
weatherCondition = rightNow["shortForecast"]

# log weather condition that was just called
print(weatherCondition)
```

Now I had my weather forecast and current conditions, all I had to do was make a little conditional statement to take in the values and turn on the corresponding light.

I created an array of the lights I had connected, and then added the conditional to "turn on" the appropriate light:

```py
# weather call
weatherURL = "https://api.weather.gov/gridpoints/AKQ/38,80/forecast/hourly"

# call weather service
response = requests.get(weatherURL)

# parse JSON
hourlyWeather = response.json()
properties = hourlyWeather["properties"]
periods = properties["periods"]
rightNow = periods[0]
weatherCondition = rightNow["shortForecast"]

# log weather condition that was just called
print(weatherCondition)

# figure out which light to turn on
if (weatherCondition.find('Sunny')):
    # yellow
    turnOn = light_colors[0]
elif (weatherCondition.find('Clear')):
    # white
    turnOn = light_colors[1]
elif (weatherCondition.find('Cloudy')):
    # green
    turnOn = light_colors[2]
elif (weatherCondition.find('Showers')):
    # blue
    turnOn = light_colors[3]
```

I had that working, and so now I could connect this to my wired up Raspberry Pi. If you're following along [in my GitHub repo](https://github.com/andrewevans0102/weather-lamp) this is the program `local_weather.py`.

## Connecting it all Together

So now I had my wired up Raspberry Pi, my weather forecast, and now I just needed to (in code) connect the two.

At this point I also wanted to add some logging, and error handling since the Weather Service API's occasionally have issues.

I also wanted a way to see if the project was working with some kind of visual indicator. That way I understood if there was no light shown in my little lamp.

All of this ended up with the following:

```py
import RPi.GPIO as GPIO
import time
import logging
import requests

# definition of light object
class light:
    def __init__(self, name, pin):
        self.name = name
        self.pin = pin

# create a list of lights
lights = []
# this covers two LEDs
lights.append( light("blue", 27))
# this covers two LEDs
lights.append( light("white", 14))
# this covers two LEDs
lights.append( light("yellow", 16))
# green lights for sucess indicator
lights.append( light("green_1", 20))
lights.append( light("green_2", 10))
# red lights for error indicator
lights.append( light("red_1", 18))
lights.append( light("red_2", 17))

# logging
logging.basicConfig(filename='/home/pi/weather-lamp/history_daily.log',format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.INFO)

# LED colors
light_colors = ['yellow', 'white', 'blue', 'green', 'red']

# weather call
weatherURL = "https://api.weather.gov/gridpoints/AKQ/38,80/forecast/hourly"

# figure out which light to turn on
turnOn = ''

def turnOffAllLights():
    # loop through the list and turn em all off
    for singleLED in lights:
        logging.info("turning off " + singleLED.name)
        GPIO.output(singleLED.pin, GPIO.LOW)

def turnOnGPIOLight( lightName ):
    logging.info("looking for light name " + lightName)
    for singleLED in lights:
        if(singleLED.name.find(lightName) != -1):
            logging.info("turning on " + singleLED.name)
            GPIO.output(singleLED.pin, GPIO.HIGH)
    return

try:
    # official start of program
    logging.info("starting program")

    # turn on GPIO settings so we can work with the LEDs connected
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)

    # call setup to initialize all the lights
    for singleLED in lights:
        GPIO.setup(singleLED.pin, GPIO.OUT)

    # first turn off all the lights
    logging.info("lets first turn all the lights off")
    turnOffAllLights()

    # call weather service
    logging.info("now lets call the weather service")
    response = requests.get(weatherURL)
    logging.info("weather service API was called with a return status code of " + str(response.status_code))

    # parse JSON
    logging.info("parsing JSON")
    hourlyWeather = response.json()
    properties = hourlyWeather["properties"]
    periods = properties["periods"]
    rightNow = periods[0]
    weatherCondition = rightNow["shortForecast"]

    # log weather condition that was just called
    logging.info("weather condition that was found is " + weatherCondition)

    # figure out which light to turn on
    if (weatherCondition.find('Sunny') != -1) or (weatherCondition.find('Clear') != -1):
        # yellow
        turnOn = light_colors[0]
    elif (weatherCondition.find('Cloudy') != -1):
        # white
        turnOn = light_colors[1]
    elif (weatherCondition.find('Rain') != -1) or (weatherCondition.find('Snow') != -1):
        # blue
        turnOn = light_colors[2]

    # turn on green light to indicate success
    turnOnGPIOLight(light_colors[3])

    # log the output for successful run
    logging.info("color to light has been found to be " + turnOn)
    turnOnGPIOLight(turnOn)
except Exception as error:
    # when error occurs in call, show red light so we know an issue happend
    turnOnGPIOLight(light_colors[4])
    logging.info('exception occured')
    logging.info(error)

logging.info("program finished")
```

If you're following along [in my GitHub repo](https://github.com/andrewevans0102/weather-lamp) this is the program `weather_light.py`.

I also rewired my original breadboard to have a shared connection for the LEDs so two LEDs could share the same power draw from the PI. This looks like the following:

![Weather Lamp](/images/lamp_wiring.jpg)

I had a little wooden box that I had used previously to hide wires, it has some holes cut in the back of it where I can run jumper cables out of. So basically I put my Raspberry Pi and a breadboard in the wooden box. Then I ran a second set of Jumper cables out of the box to a second breadboard that I covered with my lamp.

The end product looked like this:

![Weather Lamp Connected to Raspberry Pi](/images/finished_2.jpg)

The wires and the Raspberry Pi were primarily in the box, and I ran some extra jumper cables out the back to connect to the breadboard under the lamp. The end product hid most of the wires and had a nice finished look in our kitchen like this:

![Weather Lamp and Raspberry Pi on shelf](/images/finished_1.jpg)

## Automating It

So for the last step, I wanted this to run every hour on the hour. To do this I just used a cronjob that runs on the Raspberry Pi. You can do this if you open your terminal (in your SSHed session) and run `crontab -e`.

I also wanted to make sure my log file doesn't get too big. Since the Raspberry Pi has limited file capacity, its important to keep track of how much memory is being used. To that end I wrote a small python program that deletes the logfile I write to when the program runs every hour:

```py
import os
import logging

# logging
logging.basicConfig(filename='/home/pi/weather-lamp/history_delete.log',format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.INFO)

logging.info("program started")

filename="/home/pi/weather-lamp/history_daily.log"

try:
    logging.info("starting the removal of the file")
    os.remove(filename)
    logging.info("file has been deleted successfully")
except Exception as error:
    logging.info('exception occured')
    logging.info(error)

logging.info("program finished")
```

If you're following along [in my GitHub repo](https://github.com/andrewevans0102/weather-lamp) this is the program `cleanup_files.py`.

The end product that I had with both the hourly run of my program running and the cleanup program in crontab looks like this:

```bash
0 * * * * python3 /home/pi/weather-lamp/weather_light.py
30 15 * * * python3 /home/pi/weather-lamp/cleanup_files.py
```

## Closing Thoughts

So I hope you've enjoyed this post and learned something in the process. This project was a lot of fun and has been a fun talking piece in our kitchen. The light also looks really cool at night as the LED and the white fillament make it look like a small votive lamp. I highly recommend trying this project out, and looking [at my GitHub repo](<(https://github.com/andrewevans0102/weather-lamp)>). I also recommend looking at other cool things you can do with GPIO headers and projects on the Raspberry Pi.
