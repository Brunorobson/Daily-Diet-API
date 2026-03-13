import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'

export async function loginRoutes(app: FastifyInstance) {
  app.get('/:email', async (request, reply) => {
    const getLoginParamsSchema = z.object({
      email: z.string().email(),
    })

    const { email } = getLoginParamsSchema.parse(request.params)

    const login = await knex('users').where('email', email).select().first()

    const sessionId = login.id

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return reply.status(202).send('Logado')
  })
}
