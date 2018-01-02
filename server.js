var net = require('net');
var _ = require('lodash');
var clients = [];
var game = {};
var io = require('./lib/services')(clients);
var xo = require('./lib/game')(game);
var reducer = require('./src/index');
var gameReducer = require('./src/gameReducer');

const { BigInteger } = require('jsbn');
const BigInt = BigInteger


const utils = require('./elgamal/utils')
const ElGamal = require('./elgamal')

let vector = {
    p: 'ba4caeaaed8cbe952afd2126c63eb3b345d65c2a0a73d2a3ad4138b6d09bd933',
    g: '05',
    y: '60d063600eced7c7c55146020e7a31c4476e9793beaed420fec9e77604cae4ef',
    x: '1d391ba2ee3c37fe1ba175a69b2c73a11238ad77675932',
    k: 'f5893c5bab4131264066f57ab3d8ad89e391a0b68a68a1',
    m: '48656c6c6f207468657265',
    a: '32bfd5f487966cea9e9356715788c491ec515e4ed48b58f0f00971e93aaa5ec7',
    b: '7be8fbff317c93e82fcef9bd515284ba506603fea25d01c0cb874a31f315ee68',
}

const eg = new ElGamal(
    new BigInt(vector.p, 16),
    new BigInt(vector.g, 16),
    new BigInt(vector.y, 16),
    new BigInt(vector.x, 16)
);

function doEncrpyt(chunk) {
    return JSON.stringify(eg.encryptAsync(chunk))
}

function doDecrypt(chunk) {
    return eg.decryptAsync(JSON.parse(chunk))
}

function encMsg(str) {
  var enc = eg.encryptAsync(str)
  var a = enc.a.toString()
  var b = enc.b.toString()
  return JSON.stringify([a, b])
}

net.createServer(socket => {
  socket.details = {
    address: socket.remoteAddress,
    port: socket.remotePort,
    name: 'Guest' + Math.floor(Math.random() * 20)
  };
  socket.setEncoding("utf8");
  clients.push(socket);
  // var str = chunk.toString()
  //   console.log(str)
  //   var enc = eg.encryptAsync(str)
  //   var a = enc.a.toString()
  //   var b = enc.b.toString()

  var details = `${socket.details.address}:${socket.details.port}`;
  var broadcastMessage = `${socket.details.name} has joined`;
  var message = `Welcome ${details}\n`;
  // var broadcaseMessage = `${socket.details.address}:${socket.details.port} has joined the chat\n`;
  var emitMessage = 'You can change name with name:\n';
  socket.write(encMsg(message));
  emit(encMsg(emitMessage), socket);
  broadcast(encMsg(broadcastMessage), socket);
  // socket.write(`Welcome ${socket.details.address}:${socket.details.port}\n`);
  // broadcast(socket.details.address + ":" + socket.details.port + " has joined the chat\n", socket);
  // emit('You can change name with name:\n', socket);

  var chunk = "";
  socket.on('data', data => {

    chunk = data.trim();
    
    gameReducer(game, chunk, socket);
    if (!game.isActive) {
        reducer(chunk, socket);
    }
  });

  socket.on('end', () => {
    clients.splice(clients.indexOf(socket, 1));
    var endMessage = `${socket.details.name}:${socket.details.port} has left the game\n`
    broadcast(encMsg(endMessage), socket);
  });
}).listen(8000, () => {
  console.log('Port: 8000');
});


