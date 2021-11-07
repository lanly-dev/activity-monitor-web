import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import fastifyExpress from 'fastify-express'
import fCompress from 'fastify-compress'
import path from 'path'
import { createServer, ViteDevServer} from 'vite'

const fs = require('fs')
const server: FastifyInstance = Fastify({})
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

async function startServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production') {
  //@ts-ignore
  const resolve = (p) => path.resolve(__dirname, p)
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
    //@ts-ignore
    server.use(viteServer.middlewares)
  } else {
    // @ts-ignore
    sever.register(fCompress)
    // @ts-ignore
    // sever.use(
    //   // @ts-ignore
    //   require('serve-static')(resolve('dist/client'), {
    //     index: false
    //   })
    // )
  }

  // @ts-ignore
  server.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template, render
      if (!isProd) {
        // always read fresh template in dev
        // @ts-ignore
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        // @ts-ignore
        template = await viteServer.transformIndexHtml(url, template)
        // @ts-ignore
        render = (await viteServer.ssrLoadModule('/src/entry-server.ts')).render
      } else {
        // @ts-ignore
        template = indexProd
        // @ts-ignore
        render = require('./dist/server/entry-server.ts').render
      }
      // @ts-ignore
      const [appHtml, preloadLinks] = await render(url, manifest, __dirname)

      const html = template.replace(`<!--preload-links-->`, preloadLinks).replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // @ts-ignore
      viteServer && viteServer.ssrFixStacktrace(e)
      // @ts-ignore
      console.log(e.stack)
      // @ts-ignore
      res.status(500).end(e.stack)
    }
  })

  try {
    await server.listen(3000)

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port
    console.log(`App listen at ${address}:${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

startServer()