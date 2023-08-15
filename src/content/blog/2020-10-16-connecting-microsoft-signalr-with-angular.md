---
title: Connecting Microsoft SignalR with Angular
pubDate: 2020-10-16T20:25:54.835Z
snippet: Microsoft's SignalR is a very powerful technology that enables
  websocket connections between clients. The technology has been around for
  quite some time, but now with Azure its even easier to get started.
heroImage: /images/star-wars.jpg
tags: ["angular", "azure"]
---

> _Rey and Kylo Ren use SignalR to communicate with the force. Image was orginally copied from [here](https://www.techradar.com/news/star-wars-2020)_

Microsoft's SignalR is a very powerful technology that enables websocket connections between clients. The technology has been around for quite some time, but now with Azure its even easier to get started.

Microsoft's [@aspnet/signalr](https://www.npmjs.com/package/@aspnet/signalr) package makes it possible to leverage both Azure and Angular to create applications that utilize SignalR. In this post, I'm going to walkthrough setting it up in a chat application and discuss the technology along the way. If you want to follow along, please check out [my sample application GitHub repo](https://github.com/andrewevans0102/azure-signalr2).

## What is the SignalR Service?

SignalR is a technology from Microsoft that provides real time communication between client and server via [WebSockets](https://en.wikipedia.org/wiki/WebSocket). You most often see it used for high frequency applications like chat applications, gaming, dashboards, anything that requires real time updates.

SignalR is offered as either a hosted technology, or you can leverage Azure to use their SignalR service. The Azure SignalR service is very easy to get started with and supports web clients, mobile apps, servers, and IoT devices.

SignalR works for both large and small applications. If you use the SignalR service that Azure provides, you get all of this technology without having to manage the underlying infrastructure.

![](/images/screen-shot-2020-10-16-at-4.36.21-pm.png)

> _image was originally copied from [here](https://docs.microsoft.com/en-us/azure/azure-signalr/signalr-overview)_

Azure's SignalR service provides broad language support to include SDKs for ASP.NET Core, ASP.NET C#, and JavaScript. You can also leverage serverless with Azure Functions to connect to the SignalR service, and also to handle the message negotiation.

SignalR can also deliver messages generically as they are sent to a hub, or it can send messages directly to specific clients.

If you'd like to see more on the SignalR technology, I recommend checking out the [Microsoft page on it here](https://docs.microsoft.com/en-us/azure/azure-signalr/signalr-overview).

## How it works with Angular

So with SignalR you can connect webclients to send and receive messages. It's actually pretty easy to setup with the [@aspnet/signalr](https://www.npmjs.com/package/@aspnet/signalr) package and a custom service.

The basic setup looks like the following:

![](/images/screen-shot-2020-10-16-at-1.11.21-pm.png)

On the left you see the connection process:

1. The client calls a negotiate function to setup the WebSocket connection between the client and the SignalR service.
2. The SignalR service connects and creates a connection through a second function that the webclient listens to
3. The webclient sends messages through the messages function which are then propagated to any other webclients connected to SignalR

On the right you see the end state after the clients have connected. Messages that are sent to the SignalR service are propagated out to the clients in a hub pattern. You can also set messages to only go between specific clients. In the example here and what I'm going to be walking through, I setup a hub whereby all messages are sent to all clients connected to the SignalR service.

This same setup could work with other frameworks than Angular. The key part is just using the [@aspnet/signalr](https://www.npmjs.com/package/@aspnet/signalr) package and coordinating the handshake with the actual SignalR service.

## Setting this up in Azure

So if you want to use the SignalR service with Angular, you first have to setup the infrastructure with Azure. One of the best parts is that Microsoft makes all of this very intuitive with the Azure Portal.

You first just literally create the SignalR service:

![](/images/screen-shot-2020-10-19-at-3.15.03-pm.png)

Then you make sure to go over to Keys and capture the connection string that Azure uses when doing the initial handshake:

![](/images/screen-shot-2020-10-19-at-3.16.35-pm.png)

Then you create two Azure Functions:

1. `negotiate` to handle the initial handshake process
2. `messages` to literally transport messages once the handshake is good

If you use the JavaScript option, the functions are incredibly simple with the `negotiate` looking like this:

![](/images/screen-shot-2020-10-19-at-3.20.10-pm.png)

and then the `messages` looking like this:

![](/images/screen-shot-2020-10-19-at-3.20.51-pm.png)

You also need to add `AzureSignalRConnectionString` as a application setting in your Azure Functions app instance:

![](/images/screen-shot-2020-10-19-at-5.05.46-pm.png)

The last step with regards to infrastructure is just to enable CORS if you're testing with a URL etc. You can do this with the CORS setting in the services.

I also highly recommend using the [Azure Functions VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for developing the Azure Functions. It is super easy to work with, and makes building and deploying just a few steps.

## Building Angular

Once you have your infrastructure setup, now it's time to connect your Angular application.

If you check out my [sample application GitHub repo](https://github.com/andrewevans0102/azure-signalr2) you'll see this in action.

I created a service that wraps the [@aspnet/signalr](https://www.npmjs.com/package/@aspnet/signalr) package with two methods like the following:

```js
export class SignalRService {
  private readonly _http: HttpClient;
  // private readonly _baseUrl: string = "http://localhost:7071/api/";
  private readonly _baseUrl: string = environment.azureConnection;
  private hubConnection: HubConnection;
  messages: Subject<string> = new Subject();

  constructor(http: HttpClient) {
    this._http = http;
  }

  private getConnectionInfo(): Observable<SignalRConnectionInfo> {
    let requestUrl = `${this._baseUrl}negotiate`;
    return this._http.get<SignalRConnectionInfo>(requestUrl);
  }

  init() {
    this.getConnectionInfo().subscribe((info) => {
      let options = {
        accessTokenFactory: () => info.accessToken,
      };

      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(info.url, options)
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.hubConnection.start().catch((err) => console.error(err.toString()));

      this.hubConnection.on("notify", (data: any) => {
        this.messages.next(data);
      });
    });
  }
```

When the service initializes, it gets a reference to the SignalR endpoint that is exposed from the SignalR service and negotiates the handshake. It then leverages an Angular Subject to emit any new messages received from the "notify" event from SignalR.

With regards to the actual messages, I chose to use localStorage to handle the conversation history as you see here:

```js
  send(message: string): Observable<void> {
    console.log("called2");
    let requestUrl = `${this._baseUrl}messages`;
    return this._http.post(requestUrl, message).pipe(map((result: any) => {}));
  }

  receieve(message: Message): Message[] {
    // read in from local strorage
    const messages = this.load();
    messages.unshift(message);
    localStorage.setItem("messages", JSON.stringify(messages));
    return messages;
  }

  load(): Message[] {
    const messagesLocal = localStorage.getItem("messages");
    let messagesResponse = [];
    if (messagesLocal !== null) {
      messagesResponse = JSON.parse(messagesLocal);
    }
    return messagesResponse;
  }

  clear(): Observable<void> {
    const messagesLocal = localStorage.getItem("messages");
    let messagesResponse = [];
    if (messagesLocal !== null) {
      localStorage.setItem("messages", JSON.stringify(messagesResponse));
    }
    return of(null);
  }
```

In the actual components in the Angular application that operate the chat function, I create a reference to the SignalR service and handle the events that come in from the stream accordingly:

```js
this.signalRService.messages.subscribe((message) => {
  // create message
  const result = message.split("|");
  const sendMessage = new Message();
  sendMessage.sender = result[0];
  sendMessage.body = result[1];
  // this.messages.unshift(sendMessage);
  this.store.dispatch(
    MessagesActions.messageRecieved({ message: sendMessage }),
  );
});
```

I'm using [NgRx](https://ngrx.io/) to handle the various flows in the application, and you see this here with the dispatch of the `messageReceived` action.

## Closing Thoughts

So in this post I introduced how you can use Azure's SignalR service with Angular. It is a very powerful service, that you can easily integrate with your frontend applications.

There are a lot of great things you can build with this technology. As I mentioned in the intro, this is great for any application that needs realtime feedback.

I covered Angular here, but there are similar patterns that you could apply to the other major frontend libraries out there. I encourage you to look at my [sample application](https://github.com/andrewevans0102/azure-signalr) to learn more.
