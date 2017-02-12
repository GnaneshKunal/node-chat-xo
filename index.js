var net = require('net');
var _ = require('lodash');
var clients = [];
var io = require('./lib/services')(clients);

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
    if (chunk === 'options') {
      return options(socket);
    }
    if (chunk === 'myname') {
      return emit('---' + socket.details.name + '---\n', socket);
    }
    if (chunk.includes('name:')) {
      if (chunk.split(':')[1] == '') return;
      var oldName = (socket.details.name == 'no name' ? socket.details.address : socket.details.name) + ":" + socket.details.port;
      var newName = chunk.split(':')[1].trim();
      if (!changeName(newName, socket)) return;
      emit("---name has been changed---\n", socket);
      return broadcast(`${oldName} has changed to ${newName}:${socket.details.port}\n`, socket);
    }
    return broadcast(socket.details.name + ":" + socket.details.port + "> " + chunk + '\n', socket);
  });

  socket.on('end', () => {
    clients.splice(clients.indexOf(socket, 1));
    broadcast(`${socket.details.name}:${socket.details.port} has left the game\n`, socket);
  });
}).listen(8000, () => {
  console.log('Port: 8000');
});


