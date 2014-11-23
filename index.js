var WebSocketServer = require('websocket').server;
var http = require('http');

var clients = [];

var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});

var socket = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

socket.on('request', function(request) {
  var connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' New peer connected:', connection.remoteAddress);

  clients.push(connection);

  connection.on('message', function(message) {
    var messageText = message.utf8Data;
    console.log((new Date()) + ' Received message:', messageText, 'from', connection.remoteAddress);

    clients.forEach(function(client) {
      client.send(messageText);
    });
  });

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer disconnected:', connection.remoteAddress);
  });
});

