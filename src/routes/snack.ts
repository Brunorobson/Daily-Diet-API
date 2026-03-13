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

  app.put('/:id', async (request, reply) => {
    const getSnackBodySchema = z.object({
      id: z.string().uuid(),
    })
    const updateSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateTime: z.coerce.date(),
      diet: z.boolean(),
    })

    const paramSnack = getSnackBodySchema.parse(request.params)
    const bodySnack = updateSnackBodySchema.parse(request.body)

    const sessionId = request.cookies.sessionId

    if (sessionId !== paramSnack.id || !sessionId) {
      return reply.status(404).send('Deu errado')
    }
    await knex('snacks').update({
      name: bodySnack.name,
      description: bodySnack.description,
      dateTime: bodySnack.dateTime,
      diet: bodySnack.diet,
    })
    return reply.status(201).send('Parabens cara')
  })

  app.delete('/delete/:id', async (request, reply) => {
    const getSnackBodySchema = z.object({
      id: z.string().uuid(),
    })

    const paramSnack = getSnackBodySchema.parse(request.params)

    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send('sem permissao')
    }

    const snack = await knex('snacks').where({ id: paramSnack.id }).first()

    if (!snack) {
      return reply.status(404).send('refeicao nao encontrada')
    }

    if (snack.userId !== sessionId) {
      return reply.status(401).send('sem permissao')
    }

    await knex('snacks').where({ id: paramSnack.id }).delete()
    return reply.status(204).send()
  })
}
