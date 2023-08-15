---
title: Frontend Downloads with Azure Functions
pubDate: 2021-05-18T02:46:04.381Z
snippet: Recently I worked on a project that used an Azure Function to download
  a file. This was really unique (to me) because basically the frontend
  application basically just did the whole thing with a GET call. I've written
  many applications
heroImage: /images/documents.jpg
tags: ["azure"]
---

Recently I worked on a project that used an Azure Function to download a file. This was really unique (to me) because basically the frontend application basically just did the whole thing with a GET call. I've written many applications where I had to literally code around a file download scenario. This involved creating a hidden input element, and was messy at best. The Azure implementation was nice and clean. I wanted to share this for other folks that might be interested.

The source code I'll be sharing [can be reached on GitHub](https://www.github.com/andrewevans0102/getting-started-with-azure-functions).

## Setting up the Azure Function

The app that does the download basically is just a simple weather app. You give it latitude and longitude, and then it calls weather APIs to get the conditions.

![Weather App](/images/screen-shot-2021-05-18-at-9.18.42-am.png)

To see this in action, run the app locally ([instructions in the GitHub repo](https://www.github.com/andrewevans0102/getting-started-with-azure-functions)) and then click the "save file" button.

![Save File](/images/screen-shot-2021-05-18-at-9.20.52-am.png)

If you don't pass the `output=file` parameter to the function, it just returns a JSON response. If you pass the `output=file` parameter it generates a JSON file and returns it to you.

This basically just looks like this:

```js
    if (req.query.output === "file") {
      // followed basic outline at
      // https://medium.com/@hosarsiph.valle/download-files-with-azure-functions-node-js-35d4f8d08cb8
      let fileBuffer = Buffer.from(JSON.stringify(weatherDisplay, null, 4));
      const fileName = "output.json";
      context.res = {
        status: 202,
        body: fileBuffer,
        headers: {
          "Content-Disposition": `attachment; filename=${fileName}`,
        },
      };
      context.done();
```

If you notice I'm creating the blob to send back with a `Buffer`. I'm also setting the return body as that same Buffer. The process of creating the file could include loading a local file or using a different package to generate the binary output. Either way the result is that it comes back with the file payload when it is called.

## Setting up the Frontend

In order for the frontend to consume this setup, it just needs to basically open a new tab with the address of your Azure Function. This looks like the following:

```js
  saveFile() {
    try {
      const url = `${environment.weatherAzure}?lat=${this.lat}&long=${this.long}&output=file`;
      window.open(url, '_blank');
    } catch (error: any) {
      alert(error);
    }
  }
```

When you call this, the browser recognizes the return payload and does a file "save as" and you are done.

## Closing Thoughts

So I was really surprised by how easy this was to do. If you wanted to lock it down further, you could pass a token with the GET request. You also could generate the actual file in multiple ways. I also spent a little bit of time figuring out how to create the file serverside because NodeJS does not support Blobs by default. However, using the Buffer approach above basically tricks it into working as the browser recognizes what it is getting on the return value.
