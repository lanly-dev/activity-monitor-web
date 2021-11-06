import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import webFontLoader from 'webfontloader'
import App from './App.vue'


webFontLoader.load({
  google: {
    families: ['Raleway:100,300,400,500,700,900']
  }
})

createApp(App).use(createVuetify()).mount('#app')
