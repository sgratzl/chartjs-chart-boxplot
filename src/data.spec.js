import {quantilesType7, fivenum} from './data';

function asc(a, b) {
  return a - b;
}

const closeTo = (expected, precision = 2) => ({
  asymmetricMatch: (actual) => Math.abs(expected - actual) < Math.pow(10, -precision) / 2
});

function asB(min, q1, median, q3, max) {
  return {
    min: closeTo(min),
    q1: closeTo(q1),
    median: closeTo(median),
    q3: closeTo(q3),
    max: closeTo(max)
  };
}

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

describe('quantiles and fivenum', () => {
  describe('11', () => {
    const arr = [-0.4022530, -1.4521869, 0.1352280, -1.8620118, -0.5687531,
      0.4218371, -1.1165662, 0.5960255, -0.5008038, -0.3941780, 1.3709885].sort(asc);
    it('type7', () => {
      expect(quantilesType7(arr)).toEqual(asB(-1.8620118, -0.84265965, -0.4022530, 0.27853255, 1.3709885));
    });
    it('fivenum', () => {
      expect(fivenum(arr)).toEqual(asB(-1.8620118, -0.84265965, -0.4022530, 0.27853255, 1.3709885));
    });
  });
  describe('12', () => {
    const arr = [1.086657167, 0.294672807, 1.462293013, 0.485641706, 1.577482640,
      0.827809286, -0.397192557, -1.222111542, 1.071236583, -1.182959319, -0.003749222, -0.360759239].sort(asc);
    it('type7', () => {
      expect(quantilesType7(arr)).toEqual(asB(-1.222111542, -0.3698675685, 0.3901572565, 1.075091729, 1.577482640));
    });
    it('fivenum', () => {
      expect(fivenum(arr)).toEqual(asB(-1.222111542, -0.378975898, 0.3901572565, 1.078946875, 1.577482640));
    });
  });

  describe('5', () => {
    const arr = [0, 25, 51, 75, 99].sort(asc);
    it('type7', () => {
      expect(quantilesType7(arr)).toEqual(asB(0, 25, 51, 75, 99));
    });
    it('fivenum', () => {
      expect(fivenum(arr)).toEqual(asB(0, 25, 51, 75, 99));
    });
  });


  describe('strange', () => {
    const arr = [18882.492, 7712.077, 5830.748, 7206.05].sort(asc);
    it('type7', () => {
      expect(quantilesType7(arr)).toEqual(asB(5830.748, 6862.2245, 7459.0635, 10504.68075, 18882.492));
    });
    it('fivenum', () => {
      expect(fivenum(arr)).toEqual(asB(5830.748, 6518.398999999999, 7459.0635, 13297.2845, 18882.492));
    });
  });


});
