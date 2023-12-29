# WTF Chat

 A CLI chat developed in NodeJS, using native modules to build web socket connections instead of Socket.io dependency. It also uses JS event emitter to notify when a messages comes, and when a user join or leave a room.  

## How it works

Project was decoupled into two componentes:
- CLI: developed inside */client* folder, this component uses library [blessed](https://www.npmjs.com/package/blessed) to build all the app UI. 
- Server: developed inside */server* folder, this component uses **http** and **https** modules to create web socket connections with CLI.

## How to run?

- Starting from root folder, type `cd server` and then `npm start`. It will start the server.
- Starting from root folder, type `cd client` and then `npm install` to install all dependencies. Inside *package.json* file, you can find some examples of how to join a room with an username and a host. The parameter **hostUri** should be filled with server host and port.
