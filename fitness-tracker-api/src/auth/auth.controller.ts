import { FastifyReply, FastifyRequest } from "fastify"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { LoginDTO, RegisterDTO } from "./auth.dto"
import { UserModel } from "../user/UserModel"
import { SECRET_KEY } from "../config/env"
import { RefreshTokenModel } from "../user/RefreshTokenModel"

export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { name, surname, email, password } = request.body as RegisterDTO

        const existingUser = await UserModel.findOne({ email })

        if (existingUser) return reply.status(400).send({ message: "This email is already in use" })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new UserModel({
            name,
            surname,
            email,
            password: hashedPassword,
            role: "user"
        })

        await newUser.save()

        return reply.status(201).send({ message: "User registered succesfully" })
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { email, password } = request.body as LoginDTO

        const user = await UserModel.findOne({ email })

        if (!user) return reply.status(404).send({ message: "User not found" })

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) return reply.status(403).send({ message: "Wrong credentials" })

        const accessToken = jwt.sign({ email: user.email, role: user.role }, String(SECRET_KEY), { expiresIn: "15m" })

        const refreshToken = jwt.sign({ email: user.email, role: user.role }, String(SECRET_KEY), { expiresIn: "7d" })

        await RefreshTokenModel.deleteMany({ userId: user._id })
        const newRefreshToken = new RefreshTokenModel({
            userId: user._id,
            token: refreshToken
        })

        await newRefreshToken.save()

        reply.cookie(
            'accessToken',
            accessToken,
            {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                path: "/",
                maxAge: 15 * 60
            }
        )

        reply.cookie(
            'refreshToken',
            refreshToken,
            {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                path: "/",
                maxAge: 7 * 24 * 60 * 60
            }
        )

        return reply.status(200).send({ message: "User logged succesfully", email: user.email, role: user.role, expiresIn: 900 })
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies['refreshToken']
    if (!token) return reply.status(401).send({ message: "No refresh token" })

    try {
        jwt.verify(token, String(SECRET_KEY))

        const existingToken = await RefreshTokenModel.findOne({ token }).populate('userId')
        if (!existingToken) return reply.status(401).send({ message: "Refresh token not found" })

        const user = existingToken.userId as typeof UserModel.prototype

        const newAccessToken = jwt.sign({ email: user.email, role: user.role }, String(SECRET_KEY), { expiresIn: "15m" })

        reply.cookie(
            'accessToken',
            newAccessToken,
            {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                path: "/",
                maxAge: 15 * 60
            }
        )

        return reply.status(200).send({ message: "Access token refreshed", email: user.email, role: user.role, expiresIn: 900 })
    } catch (err) {
        return reply.status(401).send({ message: "Invalid refresh token" })
    }
}

export const validateRequest = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { role } = request.user as { role: string }
        const { roles } = request.body as { roles?: string[] }

        if (roles && !roles.includes(role)) {
            return reply.status(403).send({ message: "Invalid role" })
        }

        return reply.send({ success: true })
    } catch (error) {
        return reply.status(500).send({ message: "Server error" })
    }
}
