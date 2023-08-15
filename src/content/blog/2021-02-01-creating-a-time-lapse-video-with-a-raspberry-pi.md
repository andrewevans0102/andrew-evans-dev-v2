---
title: Raspberry Pi Time Lapse
pubDate: 2021-02-01T21:26:11.702Z
snippet: "Time lapse photography has been around for quite some time. With newer
  technology and the internet, making time lapse films has "
heroImage: /images/film-1668918_1920.jpg
tags: ["fun projects", "iot"]
---

> [cover image originally came from here](https://pixabay.com/illustrations/film-negative-photographs-slides-1668918/)

Time lapse photography has been around for quite some time. With newer technology and the internet, making time lapse films has become easier and more popular.

The Raspberry Pi also makes it easy to make time lapse films since with a small amount of configuration you can let it do all the work for you.

With the Rapsberry Pi and a USB Webcam, I recently created the following time lapse:

[![Time Lapse with USB Webcam](https://img.youtube.com/vi/by9RYVOoAqg/0.jpg)](https://www.youtube.com/watch?v=by9RYVOoAqg)

This was a recent snowfall we'd had here in Richmond, Va. I used a [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) and a [USB Webcam](https://www.amazon.com/Logitech-C270-720pixels-Black-webcam/dp/B01BGBJ8Y0/ref=sr_1_12?dchild=1&keywords=logitech+webcam&qid=1612213441&sr=8-12) to take the film over the course of the snowstorm both before and after the snow had fallen. My final project and some supporting materials can be found at my [GitHub repo](https://github.com/andrewevans0102/time-lapse-with-raspberry-pi).

![Hardware Setup](/images/img_24872.jpeg)

> The hardware setup is just a Raspberry Pi Zero W connected to a USB webcam. The nice part about this is that its easy to move around and highly mobile.

After creating the snow fall time lapse I also got a [Raspberry Pi Camera Module](https://www.raspberrypi.org/products/camera-module-v2/). This allowed me to create the following time lapse:

[![Time Lapse with Camera Module](https://img.youtube.com/vi/Z_81Tucolnc/0.jpg)](https://www.youtube.com/watch?v=Z_81Tucolnc)

In this post I'm going to share how I created both of these time lapse videos.

I also have created a [GitHub project](https://github.com/andrewevans0102/time-lapse-with-raspberry-pi) that has all of the instructions on setting this up. I would recommend checking that out as well.

I also created a video on the [Rhythm and Binary YouTube channel](https://www.youtube.com/channel/UCvAKKewP_o2l3XnwDzSxftw) that walks through the same information in this post:

[![Raspberry Pi Time Lapse](https://img.youtube.com/vi/pftSCQCqJi0/0.jpg)](https://www.youtube.com/watch?v=pftSCQCqJi0)

## Some Background

The Raspberry Pi company actually makes an entire camera attachment that you can get and connect to your projects. You can use Python to programmatically capture images and make time lapse films.

If you don't want to use the Camera Module you can use the Linux program [fswebcam](http://manpages.ubuntu.com/manpages/bionic/man1/fswebcam.1.html#:~:text=fswebcam%20is%20a%20small%20and,using%20the%20filename%20%22%2D%22.) to capture pictures with a USB webcam.

I actually did two different projects, one with a USB web cam and another with the Camera Module.

For the USB Webcam setup, the way it basically works is that:

1. The Raspberry Pi takes a picture once a minute (via a cronjob run)
2. After a set time I use the Linux program [mencoder](https://en.wikipedia.org/wiki/MEncoder) to stitch the individual images into one large video
3. To make the video more portable I then use [ffmpeg](https://ffmpeg.org/) to convert the output [AVI](https://en.wikipedia.org/wiki/Audio_Video_Interleave) from mencoder into [MP4](https://en.wikipedia.org/wiki/MPEG-4_Part_14).

For the Camera Module, the way it basically works is that:

1. I use the [PiCamera library](https://picamera.readthedocs.io/en/release-1.13/) to write a simple program that captures pictures at intervals
2. I used [systemd](https://www.raspberrypi.org/documentation/linux/usage/systemd.md) to create a service on the Raspberry Pi to capture the images whenever I wanted
3. I then used `SCP` to copy the files from the Raspberry Pi over to my MacBook
4. I then used `ffmpeg` to convert the images into an MP4 video.

My motivation was a series of YouTube videos I saw and also [Jeff Geerling's post on how to create a time lapse with a Raspberry Pi](https://www.jeffgeerling.com/blog/2017/raspberry-pi-zero-w-headless-time-lapse-camera). Jeff creates a lot of great videos content and I highly recommend watching his YouTube channel at <https://www.youtube.com/c/JeffGeerling>.

## Required Materials

If you want to do the project with only a USB Webcam, at a minimum you should have the following:

- [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/)
- [USB Power Supply for Raspberry Pi](https://www.amazon.com/CanaKit-Raspberry-Supply-Adapter-Listed/dp/B00MARDJZ4/ref=sr_1_3?dchild=1&keywords=raspberry+pi+usb+power+supply&qid=1612213467&sr=8-3)
- [16 GB SD Card](https://www.amazon.com/Gigastone-10-Pack-Camera-MicroSD-Adapter/dp/B089288NQK/ref=sr_1_9?dchild=1&keywords=16gb+micro+sd+card&qid=1612213510&sr=8-9)
- [USB Webcam](https://www.amazon.com/Logitech-C270-720pixels-Black-webcam/dp/B01BGBJ8Y0/ref=sr_1_12?dchild=1&keywords=logitech+webcam&qid=1612213441&sr=8-12)

If you want to do the project with the Camera Module, at a minimum you should have the following:

- [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/)
- [USB Power Supply for Raspberry Pi](https://www.amazon.com/CanaKit-Raspberry-Supply-Adapter-Listed/dp/B00MARDJZ4/ref=sr_1_3?dchild=1&keywords=raspberry+pi+usb+power+supply&qid=1612213467&sr=8-3)
- [16 GB SD Card](https://www.amazon.com/Gigastone-10-Pack-Camera-MicroSD-Adapter/dp/B089288NQK/ref=sr_1_9?dchild=1&keywords=16gb+micro+sd+card&qid=1612213510&sr=8-9)
- [Raspberry Pi Camera Module](https://www.raspberrypi.org/products/camera-module-v2/)
- [Raspberry Pi Zero W Camera Module Cable](https://www.amazon.com/dp/B07SM6JTTM/ref=cm_sw_r_tw_dp_M3GZDDAA80NNZWHY6K8Z?_encoding=UTF8&psc=1)

## Raspberry Pi Headless Setup

To setup my camera and the process of taking the images, I'm using a "headless" Raspberry Pi. This just means that it doesn't have a desktop environment, and is remotely controlled (via SSH). The process to get setup is as follows:

1. install os on SD card [using Raspberry Pi Imager](https://www.raspberrypi.org/software/) (I used Raspberry Pi OS Lite (no desktop))
2. Add WPA_SUPPLICANT and SSH files to the "boot" folder on the SD card (check out the [Raspberry Pi Docs page on this](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md))
3. Find your Raspberry Pis IP address
4. SSH into your Raspberry Pi with `ssh pi@<ip_address>`

## Taking Pictures with the USB Webcam

To get the Raspberry Pi to automatically take pictures SSH into the Pi and do the following:

1. Install `fswebcam` on the Raspberry Pi

```bash
sudo apt install fswebcam
```

2. Install `mencoder` on the Raspberry Pi

```bash
sudo apt install mencoder
```

3. Create Shell script to use `fswebcam` (see <https://www.raspberrypi.org/documentation/usage/webcams/>)

```sh
#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H%M")

fswebcam -r 1280x720 --no-banner /home/pi/webcam/$DATE.jpg
```

4. Setup a cronjob on the Raspberry Pi to run this shell script once a minute with `crontab -e` and the actual cronjob looks like this (note I named my shell script "TAKE_PICTURE.sh"):

```bash
* * * * * /home/pi/TAKE_PICTURE.sh 2>&1
```

## Converting the images into Video

Once your Raspberry Pi has captured several images, you can use `mencoder` to stitch them together into one single video output.

1. Go into the folder that you've stored your pictures and create a map with `ls *.jpg > stills.txt`
2. Run `mencoder` inside the folder where you've saved your files to create a video from the still images

```bash
mencoder -nosound -ovc lavc -lavcopts vcodec=mpeg4:aspect=16/9:vbitrate=8000000 -vf scale=1920:1080 -o timelapse.avi -mf type=jpeg:fps=24 mf://@stills.txt
```

I wrote a helper script that automates this process as you see here (you can also see it in my [GitHub repo](https://github.com/andrewevans0102/time-lapse-with-raspberry-pi/blob/master/shell-scripts/CREATE_VIDEO.sh)).

```bash

#!/bin/bash

rm -rf /home/pi/output

mkdir /home/pi/output

cp -avr /home/pi/webcam /home/pi/output/images

cd /home/pi/output/images

ls *.jpg > stills.txt

# fast
mencoder -nosound -ovc lavc -lavcopts vcodec=mpeg4:aspect=16/9:vbitrate=8000000 -vf scale=1920:1080 -o /home/pi/output/VIDEO_FAST.avi -mf type=jpeg:fps=24 mf://@stills.txt

# slow
mencoder -nosound -ovc lavc -lavcopts vcodec=mpeg4:aspect=16/9:vbitrate=8000000 -vf scale=1920:1080 -o /home/pi/output/VIDEO_SLOW.avi -mf type=jpeg:fps=4 mf://@stills.txt
```

This will create an AVI file that is the combined time lapse video. You can stop here or you can convert and send it somewhere (as you'll see in the next section).

## Converting the USB Webcam Images to Video

To make the videos more portable I decided to convert the AVI files that were generated into MP4 files.

To do this I did the following:

1. Copy the video file over to your primary computer (in my case it was a MacBook)

```bash
scp -r pi@<pi_address>:/home/pi/webcam /Users/<your_username>/webcam
```

2. Install `ffmpeg` to convert AVI file over to MP4 (I used a MacBook so I installed it with [homebrew](https://brew.sh/))

```bash
brew install ffmpeg
```

3. Convert AVI file over to MP4 with ffmpeg

```bash
ffmpeg -i timelapse.avi timelapse.mp4
```

Once you've done that, you now have an MP4 file that you can put on YouTube or just share with friends and family.

I wrote a helper script for this as well that automates pulling the video file from my Raspberry Pi to my MacBook (you can see in my [GitHub repo](https://github.com/andrewevans0102/time-lapse-with-raspberry-pi/blob/master/shell-scripts/COPY_LOCAL.sh)).

```bash

#!/bin/bash

# Modify the variables here based on your username and where you want to store the files
USERNAME="pi"
ADDRESS="camera.local"
OUTPUT_SOURCE="/home/pi/output/"
FOLDERNAME="Snow/"
MACBOOK_USERNAME=$USER
OUTPUT_DESTINATION="/Users/"$MACBOOK_USERNAME"/Pictures/"$FOLDERNAME
DATE=$(date +"%Y-%m-%d_%H%M")

# create folder in pictures for this video
mkdir $OUTPUT_DESTINATION$DATE

# copy the fast video first
scp $USERNAME@$ADDRESS:$OUTPUT_SOURCE"/VIDEO_FAST.avi" $OUTPUT_DESTINATION$DATE"/VIDEO_FAST.avi"

# copy the slow video second
scp $USERNAME@$ADDRESS:$OUTPUT_SOURCE"/VIDEO_SLOW.avi" $OUTPUT_DESTINATION$DATE"/VIDEO_SLOW.avi"

cd $OUTPUT_DESTINATION$DATE

# create the fast video in MP4 format
ffmpeg -i VIDEO_FAST.avi VIDEO_FAST.mp4

# create the slow video in MP4 format
ffmpeg -i VIDEO_SLOW.avi VIDEO_SLOW.mp4
```

## Taking Pictures with the Camera Module

If you want to use the Camera Module instead of a USB Webcam, I did the following:

1. Connect the Raspberry Pi Camera Module to the Raspberry Pi

2. Setup the PiCamera library to run on your Raspberry Pi with [installation instructions](https://picamera.readthedocs.io/en/release-1.13/install.html)

3. Write your first python script that runs the camera (use this to make sure it is working), see [first_picture.py](https://github.com/andrewevans0102/time-lapse-with-raspberry-pi/blob/master/camera-module/first_picture.py)

4. Write your second python script that uses the "capture continuous" method to continually take pictures. see [time_lapse.py](https://github.com/andrewevans0102/time-lapse-with-raspberry-pi/blob/master/camera-module/time_lapse.py)

5. Create a service that will run your python script in the `/home/pi` folder on your Raspberry Pi, see [timeLapse.service](https://github.com/andrewevans0102/time-lapse-with-raspberry-pi/blob/master/systemd/timeLapse.service)

6. Copy your service over to the Raspberry Pi's `etc` folder with

```bash
sudo cp timeLapse.service /etc/systemd/system/timeLapse.service
```

9. Start your service with

```bash
sudo systemctl start timeLapse.service
```

10. Verify that pictures are being written out to the `/home/pi/webcam` folder

11. Wait for however long you want to do the time lapse

12. When you're ready to stop taking the pictures, stop the service with

```bash
sudo systemctl stop timeLapse.service
```

13. Use the helper script [COPY_FILES_BUILD_LOCAL.sh](https://github.com/andrewevans0102/time-lapse-with-raspberry-pi/blob/master/shell-scripts/COPY_FILES_BUILD_LOCAL.sh) to copy the images over to your MacBook and then use `ffmpeg` to convert the images into a video

14. Check out the generated MP4 files and enjoy!

## Closing Thoughts

This project was a fun entry into the world of time lapse photography. After I started playing with this I realized how useful (and fun) it was. You can do time lapse on all kinds of processes and things that we do everyday. I'm planning to do time lapses for 3D printing, Woodworking, gardening, and more in the future.

You could also take this process and incorporate some cloud services to make it even more automated. I had considered sending the files over to AWS and then using lambdas to convert the files and create signed URLs that I could share with friends and family. The cool part is that everything I've covered here is configurable and can be tweaked to fit whatever project you want.

If you check out my GitHub repo, I have a list of [helpful links](https://github.com/andrewevans0102/time-lapse-with-raspberry-pi/blob/master/README.md#helpful-information).
