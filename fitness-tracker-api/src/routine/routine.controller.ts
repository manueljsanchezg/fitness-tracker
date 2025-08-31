import { FastifyReply, FastifyRequest } from "fastify"
import { getPaginate } from "../utils/utils"
import { RoutineModel } from "./routineModel"
import { Types } from "mongoose"
import { CreateRoutineDTO } from "./routine.dtos"

export const getMyRoutines = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { userId } = request.user as { userId: Types.ObjectId }
        const { limit, skip } = getPaginate(request.query)
        
        const routines = await RoutineModel.find({ user: userId })
            .populate("exercises.exercise", "name")
            .limit(Number(limit))
            .skip(Number(skip))

        const totalRoutines = await RoutineModel.countDocuments()

        return reply.status(200).send({ routines, totalRoutines })
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const getRoutine = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { routineId } = request.params as { routineId: string }

        const routine = await RoutineModel.findById(routineId)
                            .populate("exercises.exercise", "name")

        //if(!routine) return reply.status(404).send({ message: "Exercise not found"})

        return reply.status(200).send(routine)
    } catch (error) {
        return reply.status(500).send(error)
    }
}


export const createRoutine = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { userId } = request.user as { userId: Types.ObjectId }
        const { name, exercises } = request.body as CreateRoutineDTO
        
        const newRoutine = new RoutineModel({
            name,
            exercises,
            user: userId
        })

        await newRoutine.save()

        return reply.status(200).send({ message: "Routine created succesfully"})
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const updateRoutine = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { routineId } = request.params as { routineId: string }

        const { name, exercises } = request.body as CreateRoutineDTO

        const data: any = {}

        if(name) data.name = name
        if(exercises) data.exercises = exercises

        //const routine = 
        await RoutineModel.findByIdAndUpdate(routineId, data)

        //if(!routine) return reply.status(404).send({ message: "Exercise not found"})

        return reply.status(200).send({message: "Exercise successfully updated"})
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const deleteRoutine = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { routineId } = request.params as { routineId: string }

        // const routine = 
        await RoutineModel.findByIdAndDelete(routineId)

        //if(!routine) return reply.status(404).send({ message: "Exercise not found"})

        return reply.status(200).send({message: "Exercise successfully updated"})
    } catch (error) {
        return reply.status(500).send(error)
    }
}