import getCpuData from './lib/getData'

//@ts-ignore
export default (fastify, _opts, done) => {

  //@ts-ignore
  fastify.get('/data', async (req, reply) => {
    reply.send(getCpuData())
  })

  //@ts-ignore
  fastify.get('/ws/data', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
    console.log('Websocket called')
    //@ts-ignore
    connection.socket.on('open', () => {
      console.log('socket open')
    })
    // //@ts-ignore
    // connection.socket.onopen = () => {
    //   console.log('socket open')
    //   connection.socket.send('Connected to ws server')
    // }
    //@ts-ignore
    connection.socket.on('message', (message) => {
      console.log(message)
      connection.socket.send('hi from server')
    })
  })

  done()
}
