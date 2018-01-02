const Promise = require('bluebird')
const crypto = require('crypto')
const { BigInteger } = require('jsbn')
const BigInt = BigInteger

const BIG_TWO = new BigInteger('2');
exports.BIG_TWO = BIG_TWO

function trimBigInt(bi, bits) {
    const trimLength = bi.bitLength() - bits;
    return trimLength > 0 ? bi.shiftRight(trimLength) : bi;
}
exports.trimBigInt = trimBigInt

function getRandomNbitBigIntAsync(bits) {
    const buf = crypto.randomBytes(Math.ceil(bits / 8))
    const bi = new BigInteger(buf.toString('hex'), 16);

    return trimBigInt(bi, bits).setBit(bits - 1);
}

exports.getRandomNbitBigIntAsync = getRandomNbitBigIntAsync

function getRandomBigIntAsync (min, max) {
    const range = max.subtract(min).subtract(BigInt.ONE);
  
    let bi;
    do {
      // Generate random bytes with the length of the range
      const buf = crypto.randomBytes(Math.ceil(range.bitLength() / 8));
  
      // Offset the result by the minimum value
      bi = new BigInt(buf.toString('hex'), 16).add(min);
    } while (bi.compareTo(max) >= 0);
  
    // Return the result which satisfies the given range
    return bi;
  }

exports.getRandomBigIntAsync = getRandomBigIntAsync;
  
  /**
   * Returns a random prime BigInt value.
   * @param {number} bits Number of bits in the output.
   * @returns {BigInt}
   */

  function getBigPrimeAsync(bits) {
    // Generate a random odd number with the given length
    let bi = (getRandomNbitBigIntAsync(bits)).or(BigInt.ONE);
  
    while (!bi.isProbablePrime()) {
      bi = bi.add(BIG_TWO);
    }
  
    // Trim the result and then ensure that the highest bit is set
    return trimBigInt(bi, bits).setBit(bits - 1);
  }
  exports.getBigPrimeAsync = getBigPrimeAsync
  
  /**
   * Parses a BigInt.
   * @param {BigInt|string|number} obj Object to be parsed.
   * @returns {?BigInt}
   */

  function parseBigInt(obj) {
    if (obj === undefined) return null;
  
    return obj instanceof Object ? obj : new BigInt(`${obj}`);
  }
  exports.parseBigInt = parseBigInt
  