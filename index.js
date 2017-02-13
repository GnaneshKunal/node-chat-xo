var net = require('net');
var _ = require('lodash');
var clients = [];
var players = [];
var io = require('./lib/services')(clients);
var xo = require('./lib/game')(players);
var reducer = require('./src/index');
var gameReducer = require('./src/gameReducer');

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
    if (chunk.includes('game:')) {
      var xo = chunk.split(':');
      xo = xo.length === 2 && (xo[1] === 'x' || xo[1] === 'o' ) ? xo[1] : false;
      if (xo) {
        if (!players.game.active) {
          
        }
      }
    }
    reducer(chunk, socket);
  });

  socket.on('end', () => {
    clients.splice(clients.indexOf(socket, 1));
    broadcast(`${socket.details.name}:${socket.details.port} has left the game\n`, socket);
  });
}).listen(8000, () => {
  console.log('Port: 8000');
});


