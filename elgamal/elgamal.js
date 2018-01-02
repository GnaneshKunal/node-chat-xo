// import { BIG_TWO } from './utils';

// import { BigInteger as BigInt } from 'jsbn';
// import DecryptedValue from './models/decrypted-value';
// import EncryptedValue from './models/encrypted-value';
// import * as Errors from './errors';
// import * as Utils from './utils';

const { BIG_TWO } = require('./utils');
const { BigInteger } = require('jsbn')
const DecryptedValue = require('./models/decrypted-value')
const EncryptedValue = require('./models/encrypted-value')
const Utils = require('./utils');
const BigInt = BigInteger

module.exports = Elgamal

function Elgamal(p, g, y, x) {
        this.p = Utils.parseBigInt(p);
        this.g = Utils.parseBigInt(g);
        this.y = Utils.parseBigInt(y);
        this.x = Utils.parseBigInt(x);
}

Elgamal.prototype.getP = function() {
    return this.p
}

Elgamal.prototype.decryptAsync = function(m) {
    if (!this.x)
        throw new Error("No Private Key")
    const p = this.p;
    const r = Utils.getRandomBigIntAsync(
        Utils.BIG_TWO,
        this.p.subtract(BigInt.ONE)
    );
    const aBlind = this.g.modPow(r, p).multiply(m.a).remainder(p);
    const ax = aBlind.modPow(this.x, p);

    const plaintextBlind = ax.modInverse(p).multiply(m.b).remainder(p);
    const plaintext = this.y.modPow(r, p).multiply(plaintextBlind).remainder(p);

    return new DecryptedValue(plaintext);
}

Elgamal.prototype.encryptAsync = function(m, k) {
    const tmpKey = Utils.parseBigInt(k) || Utils.getRandomBigIntAsync(
      BigInt.ONE,
      this.p.subtract(BigInt.ONE)
    );
    const mBi = new DecryptedValue(m).bi;
    const p = this.p;

    const a = this.g.modPow(tmpKey, p);
    const b = this.y.modPow(tmpKey, p).multiply(mBi).remainder(p);

    return new EncryptedValue(a, b);
  }

  Elgamal.prototype.generateAsync = function(primeBits = 2048) {
    let q;
    let p;
    do {
      q = Utils.getBigPrimeAsync(primeBits - 1);
      p = q.shiftLeft(1).add(BigInt.ONE);
    } while (!p.isProbablePrime()); // Ensure that p is a prime

    let g;
    do {
      // Avoid g=2 because of Bleichenbacher's attack
      g = Utils.getRandomBigIntAsync(new BigInt('3'), p);
    } while (
      g.modPowInt(2, p).equals(BigInt.ONE) ||
      g.modPow(q, p).equals(BigInt.ONE) ||
      // g|p-1
      p.subtract(BigInt.ONE).remainder(g).equals(BigInt.ZERO) ||
      // g^(-1)|p-1 (evades Khadir's attack)
      p.subtract(BigInt.ONE).remainder(g.modInverse(p)).equals(BigInt.ZERO)
    );

    // Generate private key
    const x = Utils.getRandomBigIntAsync(
      Utils.BIG_TWO,
      p.subtract(BigInt.ONE)
    );

    // Generate public key
    const y = g.modPow(x, p);
    // console.log(p, g, y, x);
    return new Elgamal(p, g, y, x);
  }