
# Socket.IO Certificate Test

A simple Socket.IO using client certificates highlighting getpeercertificate() === null bug

## How to use
### start server.js
```
$ npm i
$ npm run winserver
```
### start client.js that connects to server as a echo bot
```
$ npm i
$ npm run winclient
```

## Toggle Between Andrewiski/socket.io and socket.io in server.js
```

const socketio = require('@andrewiski/socket.io');

const socketio = require('socket.io');

```

