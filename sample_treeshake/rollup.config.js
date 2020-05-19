// rollup.config.js
import pnp from 'rollup-plugin-pnp-resolve';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'build/index.js',
      name: 'BoxPlotExample',
      format: 'umd',
    },
    external: [],
    plugins: [commonjs(), pnp(), resolve(), babel({ babelHelpers: 'runtime' })],
  },
];
