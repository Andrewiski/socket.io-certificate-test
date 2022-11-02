// Setup basic chat bot

const path = require('path');
const fs = require('fs');
const debug = require('debug')("client");
const socketIoClient = require('socket.io-client');
const port = process.env.PORT || 3000;

const clientKeyFile = path.join(__dirname, 'client.localhost.key.pem');
const clientCertFile = path.join(__dirname, 'client.localhost.cert.pem');



var socketClientOptions = {
  key: fs.readFileSync(clientKeyFile),
  cert: fs.readFileSync(clientCertFile),
  secure: true,
  reconnect: true,
  rejectUnauthorized: false,
  //forceNew: true
  //forceNode:true
};


let socketClient = socketIoClient("https://localhost:" + port + "/", socketClientOptions);


socketClient.on('connect', function () {
  try{
    debug("Connected to server");

    socketClient.on('disconnect', function (err) {
      debug("Disconnected socket.io.client connection to server", err);
    });

    socketClient.on('connect_error', function (err) {
      debug( "connect_error toserver", err);
    });
    socketClient.on('connect_timeout', function () {
      debug(  "connect_timeout to Management server");
    });

    socketClient.on('reconnect', function () {
      debug("socketClient", 'info',  "reconnect to Management server");
    });
    
    socketClient.on('reconnect_attempt', function (err) {
      debug(  "reconnect_attempt to Management server");
    });
    
    socketClient.on('reconnecting', function () {
      debug( "reconnecting to Management server");
    });  
    socketClient.on('reconnect_error', function (err) {
      debug(  "reconnect_error to Management server", err);
    });
    
    socketClient.on('reconnect_failed', function (err) {
      debug(  "reconnect_failed to Management server", err);
    });

  
    socketClient.emit('new message', "Hello I am a Node.Js socket.io.client");

    // echo back all that is sent to us

    socketClient.on('echo', function (message) {
      try{
        
        debug(  "new message", "received server echo", message );
      }catch(ex){
        debug("error", "socketClient", ex);
      }
    });
  }catch(ex){
    debug("connect", "Error", ex);
  }
    
});
