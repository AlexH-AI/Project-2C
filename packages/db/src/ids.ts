/** ULID ids (spec §2): 48-bit time + 80 random bits, Crockford base32, no dependency. */

export const CROCKFORD_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export type RandomFill = (bytes: Uint8Array<ArrayBuffer>) => Uint8Array;

const cryptoFill: RandomFill = (bytes) => crypto.getRandomValues(bytes);

export function ulid(at: Date, random: RandomFill = cryptoFill): string {
  let time = at.getTime();
  let timePart = '';
  for (let i = 0; i < 10; i++) {
    timePart = CROCKFORD_BASE32.charAt(time % 32) + timePart;
    time = Math.floor(time / 32);
  }
  return timePart + encodeBase32(random(new Uint8Array(10)));
}

/** Big-endian base32 of the bytes; 10 bytes → 16 characters. */
export function encodeBase32(bytes: Uint8Array): string {
  let out = '';
  let buffer = 0;
  let bits = 0;
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += CROCKFORD_BASE32.charAt((buffer >> bits) & 31);
    }
    buffer &= (1 << bits) - 1;
  }
  return out;
}
