import { describe, expect, it } from 'vitest';
import { ulid } from './ids';

const CROCKFORD = /^[0-9A-HJKMNP-TV-Z]{26}$/;

describe('ulid', () => {
  it('is 26 Crockford base32 characters', () => {
    expect(ulid(new Date())).toMatch(CROCKFORD);
  });

  it('encodes the time in the first 10 characters', () => {
    // Reference value from the ulid README: 1469918176385 ms → 01ARYZ6S41.
    expect(ulid(new Date(1469918176385)).slice(0, 10)).toBe('01ARYZ6S41');
  });

  it('sorts by creation time', () => {
    const earlier = ulid(new Date(1_000_000));
    const later = ulid(new Date(2_000_000));
    expect(earlier < later).toBe(true);
  });

  it('uses the random source for the last 16 characters', () => {
    const zeros = ulid(new Date(0), (bytes) => bytes.fill(0));
    const ones = ulid(new Date(0), (bytes) => bytes.fill(255));
    expect(zeros).toBe('0'.repeat(26));
    expect(ones.slice(10)).toBe('Z'.repeat(16));
  });

  it('gives different ids within the same millisecond', () => {
    const at = new Date();
    expect(ulid(at)).not.toBe(ulid(at));
  });
});
