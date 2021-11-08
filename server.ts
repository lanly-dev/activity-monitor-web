import { createServer, ViteDevServer } from 'vite'
import Fastify, { FastifyInstance } from 'fastify'
import fastifyExpress from 'fastify-express'
import fCompress from 'fastify-compress'
import fs from 'fs'
import path from 'path'

import addRoute from  './app'

const server: FastifyInstance = Fastify({})
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

async function startServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production') {
  const resolve = (p: string) => path.resolve(__dirname, p)
  const manifest = isProd ? require('./dist/client/ssr-manifest.json') : {}
  await server.register(fastifyExpress)

  let viteServer: ViteDevServer

  if (!isProd) {
    viteServer = await createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: 'ssr',
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100
        }
      }
    })
    // use vite's connect instance as middleware
    server.use(viteServer.middlewares)
  } else {
    // @ts-ignore
    // server.register(fCompress)
    // @ts-ignore
    // server.use(
    //   // @ts-ignore
    //   require('serve-static')(resolve('dist/client'), {
    //     index: false
    //   })
    // )
  }

  //@ts-ignore
  server.use('*', async (req, res, next) => {
    try {
      const url = req.originalUrl
      if (url.includes('/api/')) return next()
      let template, render
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await viteServer.transformIndexHtml(url, template)
        render = (await viteServer.ssrLoadModule('/client/entry-server.ts')).render
      } else {
        template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        render = require('./dist/server/entry-server.ts').render
      }
      const [appHtml, preloadLinks] = await render(url, manifest, __dirname)

      const html = template.replace(`<!--preload-links-->`, preloadLinks).replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (err) {
      // @ts-ignore
      viteServer && viteServer.ssrFixStacktrace(err)
      // @ts-ignore
      console.log(err.stack)
      // @ts-ignore
      res.status(500).end(err.stack)
    }
  })

  try {
    const address = await addRoute(server).listen(3000)
    console.log(server.printRoutes())
    console.log(`App is listening at ${address}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

startServer()
