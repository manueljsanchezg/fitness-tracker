import { FastifyInstance } from "fastify";
import { loginUser, refreshToken, registerUser } from "./auth.controller";
import { loginUserSchema, registerUserSchema } from "./auth.schemas";

export async function authRoutes(app: FastifyInstance) {

    app.post('/register', { schema: registerUserSchema }, registerUser)

    app.post('/login', { schema: loginUserSchema }, loginUser)

    app.post('/refresh-token', refreshToken)

    app.get('/protected', async function name() {
        return "hola"
    })
}