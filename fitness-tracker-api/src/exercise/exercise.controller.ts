import { FastifyReply, FastifyRequest } from "fastify"
import { getPaginate } from "../utils/utils"
import { ExerciseModel } from "./exerciseModel"
import { CreateExerciseDTO } from "./exercise.dtos"

export const getAllExercise = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { limit, skip } = getPaginate(request.query)

        if (Number(limit) === 0 || Number(skip) === 0) {
             const exercises = await ExerciseModel.find()

            const totalExercises = await ExerciseModel.countDocuments()

            return reply.status(200).send({ exercises, totalExercises })
        }

        const exercises = await ExerciseModel.find()
            .limit(Number(limit))
            .skip(Number(skip))

        const totalExercises = await ExerciseModel.countDocuments()

        return reply.status(200).send({ exercises, totalExercises })
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const getExercise = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { exerciseId } = request.params as { exerciseId: string }

        const exercise = await ExerciseModel.findById(exerciseId)

        return reply.status(200).send(exercise)
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const createExercise = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { name, muscles_involved } = request.body as CreateExerciseDTO

        const newExercise = new ExerciseModel({
            name,
            muscles_involved
        })

        await newExercise.save()

        return reply.status(201).send({ message: "Exercise successfully created" })
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const updateExercise = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { exerciseId } = request.params as { exerciseId: string }

        const { name, muscles_involved } = request.body as CreateExerciseDTO

        const data: any = {}

        if (name) data.name = name
        if (muscles_involved) data.exercises = muscles_involved

        const exercise = await ExerciseModel.findByIdAndUpdate(exerciseId, data)

        if (!exercise) return reply.status(404).send({ message: "Exercise not found" })

        return reply.status(200).send({ message: "Exercise successfully updated" })
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const deleteExercise = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { exerciseId } = request.params as { exerciseId: string }

        const exercise = await ExerciseModel.findByIdAndDelete(exerciseId)

        if (!exercise) return reply.status(404).send({ message: "Exercise not found" })

        return reply.status(200).send({ message: "Exercise successfully deleted" })
    } catch (error) {
        return reply.status(500).send(error)
    }
}