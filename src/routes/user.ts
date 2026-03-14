import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import z from 'zod'
import { randomUUID } from 'node:crypto'
// import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select()

    return { users }
  })

  app.get('/:id', async (request) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const user = await knex('users')
      .where({
        id,
      })
      .first()
    return { user }
  })

  app.post(
    '/create',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createUserBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        birthday: z.string().date(),
      })

      const Userbody = createUserBodySchema.parse(request.body)

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
      }

      await knex('users').insert({
        id: randomUUID(),
        name: Userbody.name,
        email: Userbody.email,
        birthday: Userbody.birthday,
      })
      return reply
        .status(201)
        .send({ message: 'Usuário criado', user: Userbody })
    },
  )

  app.get('/snacks', async (request) => {
    const sessionId = request.cookies.sessionId

    const snacks = await knex('snacks').where('userId', sessionId).select()

    return { snacks }
  })
}
