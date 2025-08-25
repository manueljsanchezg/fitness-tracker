import fastify, { FastifyReply, FastifyRequest } from "fastify"
import fastifyJwt from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie"
import { SECRET_KEY } from "./config/env"
import { authRoutes, } from "./auth/auth.routes"

export const app = fastify({ logger: true })

app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: String(SECRET_KEY),
  cookie: {
    cookieName: 'accessToken',
    signed: false
  }
})

const publicRoutes = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh-token"
]

app.addHook("onRequest", async (request, reply) => {
  try {
    console.log(request.url)
    console.log(request.cookies)
    if (publicRoutes.includes(request.url)) return

    const decoded = await request.jwtVerify()

    request.user = decoded
  } catch (error) {
    return reply.status(401).send(error)
  }
})

const GLOBAL_PREFIX = '/api/v1'

app.register(authRoutes, { prefix: `${GLOBAL_PREFIX}/auth` })