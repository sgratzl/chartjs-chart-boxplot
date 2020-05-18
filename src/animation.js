const interpolators = {
  number(from, to, factor) {
    if (from === to) {
      return to;
    }
    return from + (to - from) * factor;
  },
};

export function interpolateNumberArray(from, to, factor) {
  if (typeof from === 'number' && typeof to === 'number') {
    return interpolators.number(from, to, factor);
  }
  if (Array.isArray(from) && Array.isArray(to)) {
    return from.map((f, i) => interpolators.number(f, to[i], factor));
  }
  return to;
}
