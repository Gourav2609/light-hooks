const resolve = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const dts = require('rollup-plugin-dts').default;

const packageJson = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

console.log(`🔧 Building in ${isProduction ? 'PRODUCTION' : isDevelopment ? 'DEVELOPMENT' : 'DEFAULT'} mode`);

const baseConfig = {
  input: 'src/index.ts',
  external: ['react'],
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      sourceMap: !isProduction
    })
  ]
};

module.exports = [
  // ES Module build
  {
    ...baseConfig,
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: !isProduction
    }
  },
  // CommonJS build
  {
    ...baseConfig,
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: !isProduction
    }
  },
  // Type definitions
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/]
  }
];
