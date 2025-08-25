import { FastifyInstance } from "fastify"
import { checkRole } from "../auth/auth.middlewares"
import { createExercise, deleteExercise, getAllExercise, updateExercise } from "./exercise.controller"

export async function exerciseRoutes(app: FastifyInstance) {

    app.get("/", { preHandler: [checkRole("admin")]}, getAllExercise)

    app.post("/", { preHandler: [checkRole("admin")]}, createExercise)

    app.put("/:exerciseId", { preHandler: [checkRole("admin")]}, updateExercise)

    app.delete("/:exerciseId", { preHandler: [checkRole("admin")]}, deleteExercise)
    
}