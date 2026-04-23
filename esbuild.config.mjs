import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  format: 'cjs',
  external: ['node:*'],
  outfile: 'dist/index.js',
});
