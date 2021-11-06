import { createApp } from 'vue'
import webFontLoader from 'webfontloader'
import App from './App.vue'
import './index.css'

webFontLoader.load({
  google: {
    families: ['Raleway:100,300,400,500,700,900']
  }
})

createApp(App).mount('#app')
