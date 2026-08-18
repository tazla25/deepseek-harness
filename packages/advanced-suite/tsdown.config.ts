import { defineConfig } from 'tsdown'
import { typertPlugin } from '../typert/generator/lib/types/tsdown-plugin.js'

export default defineConfig({
  entry: ['src/index.ts', 'src/invariant.ts'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
  plugins: [typertPlugin({ mode: 'package', faces: ['host'] })]
})
