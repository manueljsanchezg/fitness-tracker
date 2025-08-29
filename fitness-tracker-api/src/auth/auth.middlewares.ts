import { FastifyReply, FastifyRequest } from "fastify"

export const checkRole = (requiredRole: string) => async (request: FastifyRequest, reply: FastifyReply) => {    
    const { role } = request.user as { role: string }
    if(!role || role !== requiredRole) return reply.status(403).send({ message: "Unauthorized" })
}