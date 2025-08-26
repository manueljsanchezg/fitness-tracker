import { FastifyInstance } from "fastify"
import { checkRole } from "../auth/auth.middlewares"
import { createExercise, deleteExercise, getAllExercise, updateExercise } from "./exercise.controller"
import { createExerciseSchema, deleteExerciseSchema, updateExerciseSchema } from "./exercise.schema"
import { ExerciseModel } from "./exerciseModel"
import { checkEntiyExists } from "../utils/entity.middlewares"

export async function exerciseRoutes(app: FastifyInstance) {

    app.get("/",
        {
            preHandler: [
                checkRole("admin")
            ]
        },
        getAllExercise)

    app.post("/",
        {
            schema: createExerciseSchema,
            preHandler: [
                checkRole("admin")
            ]
        },
        createExercise)

    app.put("/:exerciseId",
        {
            schema: updateExerciseSchema,
            preHandler: [
                checkRole("admin"),
                checkEntiyExists(ExerciseModel, "exerciseId")
            ]
        },
        updateExercise)

    app.delete("/:exerciseId",
        {
            schema: deleteExerciseSchema,
            preHandler: [
                checkRole("admin"),
                checkEntiyExists(ExerciseModel, "exerciseId")
            ]
        },
        deleteExercise)

}