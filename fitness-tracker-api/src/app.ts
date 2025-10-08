import fastify, { FastifyReply, FastifyRequest } from "fastify"
import fastifyJwt from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie"
import fastifyCors from "@fastify/cors"
import { SECRET_KEY, FRONTEND_ORIGIN } from "./config/env"
import { authRoutes, } from "./auth/auth.routes"
import { UserModel } from "./user/UserModel"
import { userRoutes } from "./user/user.routes"
import { exerciseRoutes } from "./exercise/exercise.routes"
import { routineRoutes } from "./routine/routine.routes"
import { workOutLogRoutes } from "./workoutLog/workOutLog.routes"
import fastifyRateLimit from "@fastify/rate-limit"

export const app = fastify({ logger: true })

app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: String(SECRET_KEY),
  cookie: {
    cookieName: 'accessToken',
    signed: false
  }
})

app.register(fastifyCors, {
  origin: String(FRONTEND_ORIGIN),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
})

app.register(fastifyRateLimit, {
  max: 120,
  timeWindow: '1 minute',
  keyGenerator: (req) => req.ip,
  errorResponseBuilder: (req, context) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Has superado ${context.max} solicitudes por ${context.after}.`
  })
})

const publicRoutes = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh-token"
]

interface JwtPayload {
  email: string
  role: string
}

app.addHook("onRequest", async (request, reply) => {
  try {
    if (publicRoutes.includes(request.url)) return

    const decoded = await request.jwtVerify<JwtPayload>()

    const user = await UserModel.findOne({ email: decoded.email })

    if (!user) return reply.status(404).send({ message: "User not found" })

    request.user = {
      userId: user.id,
      role: user.role
    }
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized" })
  }
})



const GLOBAL_PREFIX = '/api/v1'

app.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send('ok')
})

app.register(authRoutes, { prefix: `${GLOBAL_PREFIX}/auth` })
app.register(userRoutes, { prefix: `${GLOBAL_PREFIX}/users` })
app.register(exerciseRoutes, { prefix: `${GLOBAL_PREFIX}/exercises` })
app.register(routineRoutes, { prefix: `${GLOBAL_PREFIX}/routines` })
app.register(workOutLogRoutes, { prefix: `${GLOBAL_PREFIX}/workoutlogs` })