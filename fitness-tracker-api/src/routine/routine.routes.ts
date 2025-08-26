import { FastifyInstance } from "fastify"
import { checkRole } from "../auth/auth.middlewares"
import { createRoutine, deleteRoutine, getMyRoutines, getRoutine, updateRoutine } from "./routine.controller"
import { createRoutineSchema, deleteRoutineSchema, updateRoutineSchema } from "./routine.schema"
import { checkRoutineOwnership } from "./routine.middleware"
import { checkEntiyExists } from "../utils/entity.middlewares"
import { RoutineModel } from "./routineModel"

export async function routineRoutes(app: FastifyInstance) {

    app.get("/",
        {
            preHandler: [
                checkRole("user")
            ]
        },
        getMyRoutines)

    app.get("/:routineId",
        {
            preHandler: [
                checkRole("user"),
                checkEntiyExists(RoutineModel, "routineId"),
                checkRoutineOwnership
            ]
        },
        getRoutine)

    app.post("/", { schema: createRoutineSchema, preHandler: [checkRole("user")] }, createRoutine)

    app.put("/:routineId",
        {
            schema: updateRoutineSchema,
            preHandler: [
                checkRole("admin"),
                checkEntiyExists(RoutineModel, "routineId"),
                checkRoutineOwnership
            ]
        },
        updateRoutine)

    app.delete("/:routineId",
        {
            schema: deleteRoutineSchema,
            preHandler: [
                checkRole("admin"),
                checkEntiyExists(RoutineModel, "routineId"),
                checkRoutineOwnership
            ]
        },
        deleteRoutine)

}