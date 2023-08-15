---
title: Hosting a Website with AWS Cloudfront
pubDate: 2018-10-20T11:50:55.000Z
snippet: "So I recently hosted a site using AWS S3 and Cloudfront and wanted to write a post on it. If you don't use Cloudfront or Firebase or one of the other many cloud options, you would normally host"
heroImage: home.jpg
tags: ["aws"]
---

So I recently hosted a site using AWS S3 and Cloudfront and wanted to write a post on it.

If you don’t use Cloudfront or Firebase or one of the other many cloud options, you would normally host your site with a web server. This often would be a nightmare because you’d end up having to monitor the server in some way and basic “patches” or updates could bring down your server whenever you’d do routine maintenance. If you host your site using Cloudfront it alleviates a lot of this headache because it makes it so that you don’t have to maintain a server, and you can basically let AWS handle all of the details. All you have to do is have a Cloudfront instance setiup and point it to either an S3 bucket or an EC2 instance to be able to display your content.

Cloudfront is the AWS service that enables the creation of a content delivery network. You can also use Cloudfront for basic hosting which is what I’m going to talk about here.

For much more on Cloudfront check out the AWS pages here [https://aws.amazon.com/cloudfront/](https://aws.amazon.com/cloudfront/).

So for the purposes of this post I’m just going to walkthrough the basic deployment of an Angular site to Cloudfront. I also want to point out that if you are just hosting strictly static content on your site, AWS S3 also has an option and you can read more about it here [https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).

So for my example today I’m going to be hosting my content in an S3 bucket and then connect Cloudfront to it.

Since I’m doing an angular app, I have already created my production ready site using the Angular CLI “ng build –prod” and saved it to the “dist” folder. I’ve then uploaded this content to an S3 bucket. I used Circle Ci which makes the whole process automated and is really cool. Check out my Circle Ci post here [](https://rhythmandbinary.com/2018/10/19/circle-ci/).

Now that I have my content in S3 I have to make it publicly accessible with a bucket policy. So here’s an example policy that enables this:

```json
{
  "Version": "2012-10-17",
  "Id": "Policy12345",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<your_bucket_name_goes_here>/*"
    }
  ]
}
```

Once you’ve added the above policy, your bucket contents are publicly accesible and can be reached by Cloudfront.

Now you need to go over to the AWS console and create a Cloudfront distribution.

There are many options with your distribution. You can setup redirects and custom messages and behaviors. For the purposes of this post I’m just going to setup the basics. I just want Cloudfront to serve up my S3 content.

If you walk through the dialog of creating a Cloudfront distribution the two most important things are to (1) set the origin as your S3 bucket (there is a dropdown), and (2) set the origin path to the directory in your bucket that you want served up. The origin path is important if you have your content stored in specific folders in your bucket etc.

Once you do that then go back to the “General” tab and look for “Domain Name”. This address will be the location that is serving up your content. You may have to wait about 15 minutes for the initial setup, and you can monitor this in the Cloudfront console. As soon as your distribution is ready it will show a status of “Enabled” and the little progress arrows will have stopped. As soon as you are in “Enabled” status open up your browser and go to the domain that is listed and you’re good to go!

Hope this helped and gave you a good intro into the potential of hosting in Cloudfront!
