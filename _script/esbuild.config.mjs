import { build, context } from 'esbuild'
import { rmSync } from 'node:fs'
rmSync('dist', { recursive: true, force: true })
const isProd = process.argv.includes('--prod')
const commonOptions = {
  entryPoints: ['./src/404/index.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'browser',
  format: 'esm',
  target: ['es2022'],
  sourcemap: !isProd,
  minify: isProd,
  treeShaking: true,
  legalComments: 'none',
  metafile: isProd,
  logLevel: 'info',
  splitting: true,
  chunkNames: 'chunks/[name]-[hash]',
  assetNames: 'assets/[name]-[hash]',
  loader: {
    '.svg': 'dataurl',
    '.png': 'dataurl',
    '.jpg': 'dataurl',
    '.jpeg': 'dataurl',
    '.gif': 'dataurl',
    '.webp': 'dataurl',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
  },
  jsx: 'automatic',
  jsxImportSource: 'react',
}
if (isProd) {
  await build(commonOptions)
  console.log('✅ Build selesai (production)')
} else {
  const ctx = await context(commonOptions)
  await ctx.watch()
  console.log('👀 Watching for changes...')
}
