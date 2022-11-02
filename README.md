
# Socket.IO Chat Client Certificates

A simple chat demo for Socket.IO using client certificates

## How to use
### start server.js
```
$ npm i
$ node server.js
```
And point your browser to `https://localhost:3000`

Optionally, specify a port by supplying the `PORT` env variable.

### start client.js that connects to server as a echo bot
```
$ npm i
$ node client.js
```
Optionally, specify a port by supplying the `PORT` env variable.






## Features

- Multiple users can join a chat room by each entering a unique username
on website load.
- Users can type chat messages to the chat room.
- A notification is sent to all users when a user joins or leaves
the chatroom.
