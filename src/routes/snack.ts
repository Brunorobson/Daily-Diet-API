import { FastifyInstance } from 'fastify'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function snackRoutes(app: FastifyInstance) {
  app.post('/create', async (request, reply) => {
    const createSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateTime: z.coerce.date(),
      diet: z.boolean(),
    })

    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(203).send('Faça login')
    }

    const snackBody = createSnackBodySchema.parse(request.body)

    await knex('snacks').insert({
      id: randomUUID(),
      userId: sessionId,
      name: snackBody.name,
      description: snackBody.description,
      dateTime: snackBody.dateTime,
      diet: snackBody.diet,
    })

    return reply
      .status(201)
      .send({ message: 'Refeição salva com sucesso', user: snackBody })
  })
}
