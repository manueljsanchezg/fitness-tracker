import { FastifyReply, FastifyRequest } from "fastify"
import { Model } from "mongoose"

export const checkEntiyExists = <T>(model: Model<T>, objectId: string) =>
    async (request: FastifyRequest, reply: FastifyReply) => {
        try {

            const id = (request.params as any)[objectId]

            const entity = await model.findById(id)

            if (!entity) return reply.status(404).send({ message: "Entity not found" })

        } catch (error) {
            return reply.status(500).send(error)
        }
    }