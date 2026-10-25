import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginSolid } from '@rsbuild/plugin-solid'

export default {
  plugins: [pluginBabel({ include: /\.(?:jsx|tsx)$/ }), pluginSolid()],
  source: { entry: { index: './src/index.jsx' } },
  dev: { lazyCompilation: false, client: { overlay: false } },
  server: { port: 4173, strictPort: true },
}
