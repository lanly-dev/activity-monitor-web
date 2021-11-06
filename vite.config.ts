import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from '@vuetify/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: true
    })
  //   {
  //     name: 'import-checking',
  //     transform(src, id) {
  //       if (/.vue/.test(id)) {
  //         console.log('\n\n')
  //         console.log('$$$$', id)
  //         for (const i of src.split('\n')) {
  //           if (i.startsWith('import')) console.log('--->', i)
  //         }
  //         console.log('\n\n')
  //         return { code: src }
  //       }
  //     }
  //   }
  // ],
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src')
  //   }
  // }
})
