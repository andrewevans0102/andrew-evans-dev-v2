---
title: Checksums
pubDate: 2017-11-28T04:09:55.000Z
snippet: "I find a lot of times with my day-to-day work that I have to download files and then verify their checksums to ensure their integrity etc. This made me consider what is a checksum? Quoting Wikipedia"
heroImage: home.jpg
tags: ["algorithms"]
---

I find a lot of times with my day-to-day work that I have to download files and then verify their checksums to ensure their integrity etc. This made me consider what is a checksum?

Quoting [Wikipedia](https://en.wikipedia.org/wiki/Checksum)

> A **checksum** is a small-sized [datum](https://en.wikipedia.org/wiki/Datum "Datum") derived from a block of [digital data](https://en.wikipedia.org/wiki/Digital_data "Digital data") for the purpose of [detecting errors](https://en.wikipedia.org/wiki/Error_detection "Error detection") which may have been introduced during its [transmission](https://en.wikipedia.org/wiki/Telecommunication "Telecommunication") or [storage](https://en.wikipedia.org/wiki/Computer_storage "Computer storage"). It is usually applied to an installation file after it is received from the download server. By themselves, checksums are often used to verify data integrity but are not relied upon to verify data [authenticity](https://en.wikipedia.org/wiki/Authentication "Authentication").

Quoting [Google Dictionary](https://www.google.com/search?q=what+is+a+checksum&oq=what+is+a+checksum&aqs=chrome..69i57.1687j0j7&sourceid=chrome&ie=UTF-8)

> a digit representing the sum of the correct digits in a piece of stored or transmitted digital data, against which later comparisons can be made to detect errors in the data.

So basically a checksum is a way to verify a files integrity after you recieve it (usually download).

I often did this before when I would get an ISO file to install Linux or some other similar task.

This is very powerful because you consider how often we exchange files in our day to day business. Not even considering technical professions, regular businesses can use checksums in their day to day work as well. Consider a business that’s exchanging a contract. The way you can verify that you have received the correct (and not tampered with) version is to use a checksum on the file received.

Network protocols typically use checksums to verify transmissions when they are sent and received. Software Engineers use checksums to verify files that are downloaded and data that is transmitted as well.

There are also several variations in checksum algorithms, but some of the most common include MD5 and SHA256.

If you’d like to create your own checksums they are super easy on both Windows and Mac platforms.

On the Mac you can generate a checksum with the following

- To create an md5 checksum, open the terminal and enter:

```bash
md5 fileName
```

- To create a SHA256 checksum, open the terminal and enter:

```bash
shasum -a 256
```

On Windows you can create checksums with several programs, but you can also use a cert utility in the command prompt that will do this.

- Open Command Prompt and enter:

```bash
certutil -hashfile SHA256
```

- This also works for the algorithms MD2, MD4, MD5, SHA1, SHA384, SHA512. You just replace "SHA256" from the earlier example with the associated algorithm from the list:

```bash
certutil -hashfile MD2
certutil -hashfile MD4
certutil -hashfile MD5
certutil -hashfile SHA1
certutil -hashfile SHA384
certutil -hashfile SHA512
```
