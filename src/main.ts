import webFontLoader from 'webfontloader'
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import App from './App.vue'
import './index.css'

webFontLoader.load({
  google: {
    families: ['Raleway:100,300,400,500,700,900']
  }
})

export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return { app, router }
}
