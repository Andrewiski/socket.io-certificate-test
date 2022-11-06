// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');
const debug = require('debug')("server");

const socketio = require('socket.io');
const port = process.env.PORT || 3000;

const caCertFile = path.join(__dirname, 'ca.cert.pem');

//used for web server to serve up https session
const serverKeyFile = path.join(__dirname, 'ca.key.pem');
const serverCertFile = path.join(__dirname, 'ca.cert.pem');

const io = socketio();




io.on('connection', (socket) => {
  try{
    
    if(socket.client.conn.request.socket.authorized){
      debug("io.onConnection", socket.id, "socket.client.conn.request.socket.authorized is true");
    }else{
      debug("io.onConnection", socket.id, "socket.client.conn.request.socket.authorized is false");
    }

    if(socket.conn.peerCertificate){   //This only works if io.engine.on("connection") assigns the certificate to peerCertificate see below
      let cert = socket.conn.peerCertificate;
      debug("io.onConnection", socket.id, "socket.conn.peerCertificate", cert.subject.CN, " issued by ", cert.issuer.CN );
    }else{
      debug("io.onConnection", socket.id, "socket.conn.peerCertificate is null");
    }
    
    //This always returns null socket.request.client.getPeerCertificate()
    if(socket.request.client.getPeerCertificate) {
      let cert = socket.request.client.getPeerCertificate();
      if (cert){
        debug("io.onConnection", socket.id, "socket.request.client.getPeerCertificate() client certificate was presented use,", cert.subject.CN, " issued by ", cert.issuer.CN );
      }else{
        debug("io.onConnection", socket.id, "socket.request.client.getPeerCertificate() is null this is expected in newer versions of Node.js and socket.io");
      }
    }

    
    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
      // we tell the client to execute 'new message'
      debug("new message", socket.id, data);
      socket.emit('echo', {
        message: data
      });
    });
  }catch(ex){
    debug("io.onConnection", socket.id, "error", ex);
  }
});


var httpsOptions = {
  key: fs.readFileSync(serverKeyFile),
  cert: fs.readFileSync(serverCertFile),
  ca : fs.readFileSync(caCertFile),
  requestCert: true,
  rejectUnauthorized : false
};
const server = https.createServer(httpsOptions, app);
io.attach(server);
//This has to come after the server is attached else io.engine is undefined
io.engine.on('connection', (rawsocket) => {
  try{

    
    if(rawsocket.request.client.getPeerCertificate) {
      let cert = rawsocket.request.client.getPeerCertificate();
      rawsocket.peerCertificate = cert;   //this will make the certificate availble in //io.on("connection", (socket) =>   at socket.conn.peerCertificate 
      if (cert){
        debug("io.engine.onConnection", rawsocket.id, "rawsocket.request.client.getPeerCertificate() client certificate was presented use,", cert.subject.CN, " issued by ", cert.issuer.CN );
      }else{
        debug("io.engine.onConnection", rawsocket.id, "rawsocket.request.client.getPeerCertificate() is null");
      }
    }

    
  }catch(ex){
    debug("io.engine.onConnection", rawsocket.id, "error", ex);
  }
});

server.listen(port, () => {
  console.log('Server listening at port %d for https', port);
});



