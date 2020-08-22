// See <http://en.wikipedia.org/wiki/Kernel_(statistics)>.
function gaussian(u: number) {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
}

// Welford's algorithm.
function mean(x: readonly number[]) {
  if (x.length === 0) {
    return Number.NaN;
  }
  return x.reduce((m, xi, i) => m + (xi - m) / (i + 1), 0);
}

// Also known as the sample variance, where the denominator is n - 1.

function variance(x: readonly number[]) {
  const n = x.length;
  if (n < 1) {
    return Number.NaN;
  }
  if (n === 1) {
    return 0;
  }
  const m = mean(x);
  return x.reduce((acc, x) => acc + (x - m) * (x - m), 0) / (x.length - 1);
}

function nrd(sample: number[], quantiles: (x: number[]) => { q1: number; q3: number }) {
  const q = quantiles(sample);
  const h = (q.q3 - q.q1) / 1.34;
  return 1.06 * Math.min(Math.sqrt(variance(sample)), h) * Math.pow(sample.length, -1 / 5);
}

export function kde(points: number[], sample: number[], quantiles: (x: number[]) => { q1: number; q3: number }) {
  const bw = nrd(sample, quantiles);

  return points.map((v) => {
    const y = sample.reduce((acc, s) => acc + gaussian((v - s) / bw), 0);
    return { v, estimate: y / bw / sample.length };
  });
}
