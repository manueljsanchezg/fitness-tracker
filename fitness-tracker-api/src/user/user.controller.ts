import { FastifyRequest, FastifyReply } from "fastify"
import bcrypt from "bcrypt"
import { UserModel } from "./UserModel"
import { Types } from "mongoose"
import { getPaginate } from "../utils/utils"
import { UpdateDTO } from "./user.dtos"

export const getUserProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { userId } = request.user as { userId: Types.ObjectId }

        const user = await UserModel.findById(userId, 'name surname email')

        if (!user) return reply.status(404).send({ message: "User not found" })

        return reply.status(200).send(user)
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { limit, skip } = getPaginate(request.query)
        
        const users = await UserModel.find({}, 'name surname email role')
            .limit(Number(limit))
            .skip(Number(skip))

        return reply.status(200).send(users)
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const updateProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { userId } = request.user as { userId: Types.ObjectId }

        const { name, surname, password } = request.body as UpdateDTO

        const user = await UserModel.findById(userId)

        if (!user) return reply.status(404).send({ message: "User not found" })

        user.name = name ? name : user.name
        user.surname = surname ? surname : user.surname
        
        if(password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword
        }

        await user.save()

        return reply.status(200).send({ message: "Updated succesfully"})
    } catch (error) {
        return reply.status(500).send(error)
    }
}