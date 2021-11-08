import { FastifyInstance } from 'fastify'
import osRoute from './api/os'

export default function addRoute(app: FastifyInstance){
  app.register(osRoute, { prefix: '/api' })
  return app
}

