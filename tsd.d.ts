declare module '@sgratzl/science/src/stats/kde' {
  function kde(): {
    sample(arr: number[]): (samples: number[]) => [number, number][];
  };
  export default kde;
}
