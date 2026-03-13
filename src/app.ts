import fastify = require('fastify')
import cookie from '@fastify/cookie'
import { userRoutes } from './routes/user'
import { snackRoutes } from './routes/snack'
import { loginRoutes } from './routes/login'

export const app = fastify()

app.register(cookie)

app.register(loginRoutes, {
  prefix: 'login',
})

app.register(userRoutes, {
  prefix: 'users',
})

app.register(snackRoutes, {
  prefix: 'snack',
})
