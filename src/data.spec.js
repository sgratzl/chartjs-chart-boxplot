import {quantilesType7, fivenum} from './data';

describe('quantiles', () => {
  it('is a function', () => {
    expect(typeof quantilesType7).toBe('function');
  });
});

describe('fivenum', () => {
  it('is a function', () => {
    expect(typeof fivenum).toBe('function');
  });
});
