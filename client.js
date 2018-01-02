const { BigInteger } = require('jsbn');
const BigInt = BigInteger

var net = require('net');

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

var client = net.createConnection({ port: 8000 });

client.on('data', (data) => {

    try {

        var l = data.toString();
        var sender = l.substring(0, l.indexOf('>') + 1)
        var k = l.substring(l.indexOf('>') + 1)

        var m = JSON.parse(k.trim())
        var obj = new Object({
            a: new BigInt(m[0]), 
            b: new BigInt(m[1])
        })
        var dec = eg.decryptAsync(obj);
        console.log(sender + dec.toString());
    } catch(e) {
    }
});

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();

    if (chunk !== null) {
    var str = chunk.toString()
    var enc = eg.encryptAsync(str)
    var a = enc.a.toString()
    var b = enc.b.toString()

    client.write(JSON.stringify([a, b]));
    }
  });
  
  process.stdin.on('end', () => {
    process.stdout.write('end');
    client.end();
  });
