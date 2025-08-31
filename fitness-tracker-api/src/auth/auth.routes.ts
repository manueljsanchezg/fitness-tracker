import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { loginUser, refreshToken, registerUser, validateRequest } from "./auth.controller"
import { loginUserSchema, registerUserSchema } from "./auth.schemas"

export async function authRoutes(app: FastifyInstance) {

    app.post(
        '/register',
        {
            schema: registerUserSchema,
            config: {
                rateLimit: {
                    max: 10,
                    timeWindow: '1 minute'
                }
            }
        },
        registerUser
    )

    app.post(
        '/login',
        {
            schema: loginUserSchema,
            config: {
                rateLimit: {
                    max: 10,
                    timeWindow: '1 minute'
                }
            }
        },
        loginUser
    )

    app.post(
        '/refresh-token',
        {
            config: {
                rateLimit: {
                    max: 10,
                    timeWindow: '1 minute'
                }
            }
        },
        refreshToken
    )

    app.post('/validate', validateRequest)

    app.get('/protected', async () => "hola")
}