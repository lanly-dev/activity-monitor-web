import { FastifyInstance } from 'fastify'
import websocketPlugin from 'fastify-websocket'
import osRoute from './api/os'

export default function addRoute(app: FastifyInstance){
  app.register(websocketPlugin)
  app.register(osRoute, { prefix: '/api' })

  return app
}

