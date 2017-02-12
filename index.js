var net = require('net');
var _ = require('lodash');
var clients = [];
var io = require('./lib/services')(clients);
var reducer = require('./src/index');

net.createServer(socket => {
  socket.details = {
    address: socket.remoteAddress,
    port: socket.remotePort,
    name: 'Guest' + Math.floor(Math.random() * 20)
  };
  socket.setEncoding("utf8");
  clients.push(socket);
  
  socket.write(`Welcome ${socket.details.address}:${socket.details.port}\n`);
  broadcast(socket.details.address + ":" + socket.details.port + " has joined the chat\n", socket);
  emit('You can change name with name:\n', socket);

  var chunk = "";
  socket.on('data', data => {
    
    chunk = data.trim();
    reducer(chunk, socket);
  });

  socket.on('end', () => {
    clients.splice(clients.indexOf(socket, 1));
    broadcast(`${socket.details.name}:${socket.details.port} has left the game\n`, socket);
  });
}).listen(8000, () => {
  console.log('Port: 8000');
});


