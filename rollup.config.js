import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/core/index.ts',
    output: [
      {
        file: 'dist/core/index.cjs.js',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'dist/core/index.esm.js',
        format: 'esm',
      },
    ],
    external: ['tslib'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfigOverride: {
          compilerOptions: { declaration: true, outDir: 'dist/core' },
        },
        useTsconfigDeclarationDir: true,
      }),
    ],
  },
  {
    input: 'src/react/index.ts',
    external: ['react', 'react-dom', 'tslib'],
    output: [
      {
        file: 'dist/react/index.cjs.js',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'dist/react/index.esm.js',
        format: 'esm',
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfigOverride: {
          compilerOptions: { declaration: true, outDir: 'dist/react' },
        },
        useTsconfigDeclarationDir: true,
      }),
    ],
  },
];
