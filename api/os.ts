//@ts-ignore
export default (fastify, _opts, done) => {
  //@ts-ignore
  fastify.get('/data', async (req, reply) => {
    reply.send('data from server')
  })
  done()
}
