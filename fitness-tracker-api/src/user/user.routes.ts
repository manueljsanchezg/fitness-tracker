import { FastifyInstance } from "fastify"
import { getAllUsers, getUserProfile, updateProfile } from "./user.controller"
import { checkRole } from "../auth/auth.middlewares"
import { updateProfileSchema } from "./user.schemas"

export async function userRoutes(app: FastifyInstance) {

    app.get("/", { preHandler: [checkRole("admin")]}, getAllUsers)

    app.get("/profile", getUserProfile)

    app.put("/profile", { schema: updateProfileSchema }, updateProfile)
    
}