import { FastifyInstance } from "fastify"
import { checkRole } from "../auth/auth.middlewares"
import { createWorkOutLog, deleteWorkOutLog, getMyWorkOutLogs, getWorkOutLog, updateWorkOutLog } from "./workOutLog.controller"
import { createWorkOutLogSchema, deleteWorkOutLogSchema, updateWorkOutLogSchema } from "./workOutLog.schema"
import { checkEntiyExists } from "../utils/entity.middlewares"
import { WorkoutLogModel } from "./workOutLogModel"



export async function workOutLogRoutes(app: FastifyInstance) {

    app.get("/",
        {
            preHandler: [
                checkRole("user")
            ]
        },
        getMyWorkOutLogs)
    
    app.get("/:workOutLogId",
        {
            preHandler: [
                checkRole("user"),
                checkEntiyExists(WorkoutLogModel, 'workOutLogId')
            ]

        },
        getWorkOutLog)

    app.post("/",
        {
            schema: createWorkOutLogSchema,
            preHandler: [
                checkRole("user")
            ]

        },
        createWorkOutLog)

    app.put("/:workOutLogId",
        {
            schema: updateWorkOutLogSchema,
            preHandler: [
                checkRole("user"),
                checkEntiyExists(WorkoutLogModel, 'workOutLogId')
            ]

        },
        updateWorkOutLog)

    app.delete("/:workOutLogId",
        {
            schema: deleteWorkOutLogSchema,
            preHandler: [
                checkRole("user"),
                checkEntiyExists(WorkoutLogModel, 'workOutLogId')
            ]

        },
        deleteWorkOutLog)
}