import { FastifyInstance } from "fastify"
import { getAllUsers, getUserProfile, updateProfile } from "./user.controller"
import { checkRole } from "../auth/auth.middlewares"
import { getUsersSchema, updateProfileSchema } from "./user.schemas"

export async function userRoutes(app: FastifyInstance) {

    app.get("/",
        {
            schema: getUsersSchema,
            preHandler: [
                checkRole("admin")
            ]
        },
        getAllUsers)

    app.get("/profile", getUserProfile)

    app.put("/profile",
        {
            schema: updateProfileSchema

        },
        updateProfile)

}