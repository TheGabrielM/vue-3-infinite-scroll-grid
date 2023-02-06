import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js' 

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {

  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      cssInjectedByJsPlugin(),
    ],
    root: env.VITE_APP_ROOT,
    build: {
      lib: {
        entry: resolve(__dirname, 'src/components/index.ts'),
        name: 'InfiniteScrollGrid',
        fileName: 'vue-3-infinite-scroll-grid-component'
      },
      rollupOptions: {

        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['vue'],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  }

})
