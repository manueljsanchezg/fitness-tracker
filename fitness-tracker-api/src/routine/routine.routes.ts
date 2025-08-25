import { FastifyInstance } from "fastify"
import { checkRole } from "../auth/auth.middlewares"
import { createRoutine, deleteRoutine, getMyRoutines, getRoutine, updateRoutine } from "./routine.controller"
import { createRoutineSchema } from "./routine.schema"

export async function routineRoutes(app: FastifyInstance) {

    app.get("/", { preHandler: [checkRole("user")]}, getMyRoutines)

    app.get("/:routineId", { preHandler: [checkRole("user")]}, getRoutine)

    app.post("/", { schema: createRoutineSchema ,preHandler: [checkRole("user")]}, createRoutine)

    app.put("/:routineId", { schema: createRoutineSchema, preHandler: [checkRole("admin")]}, updateRoutine)

    app.delete("/:routineId", { preHandler: [checkRole("admin")]}, deleteRoutine)
    
}