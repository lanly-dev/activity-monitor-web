import './index.css'
import { createApp } from './main'
import webFontLoader from 'webfontloader'

const { app, router } = createApp()

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  webFontLoader.load({
    google: {
      families: ['Raleway:100,300,400,500,700,900']
    }
  })
  app.mount('#app')
})
