import { FastifyReply, FastifyRequest } from "fastify"
import { RoutineModel } from "./routineModel"
import { Types } from "mongoose"

export const checkRoutineOwnership = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { routineId } = request.params as { routineId: string }
        const { userId } = request.user as { userId: Types.ObjectId }

        const routine = await RoutineModel.findById(routineId)

        if(!routine!.user.equals(userId)) return reply.status(403).send({ message: "Unauthorized" })

    } catch (error) {
        return reply.status(500).send(error)
    }
}