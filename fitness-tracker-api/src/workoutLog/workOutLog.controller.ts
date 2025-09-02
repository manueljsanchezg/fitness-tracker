import { FastifyReply, FastifyRequest } from "fastify"
import { getPaginate } from "../utils/utils"
import { WorkoutLogModel } from "./workOutLogModel"
import { createWorkOutLogDTO } from "./workOutLog.dtos"
import { Types } from "mongoose"


export const getMyWorkOutLogs = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paginate = getPaginate(request.query)

        if(!paginate) {
            const workOutLogs = await WorkoutLogModel.find()
            .populate("exercise", "name")

        const totalWorkOutLogs = await WorkoutLogModel.countDocuments()

        return reply.status(200).send({ workOutLogs, totalWorkOutLogs })
        }
        
        const workOutLogs = await WorkoutLogModel.find()
            .populate("exercise", "name")
            .limit(paginate.limit)
            .skip(paginate.skip)

        const totalWorkOutLogs = await WorkoutLogModel.countDocuments()

        return reply.status(200).send({ workOutLogs, totalWorkOutLogs })
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const getWorkOutLog= async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { workOutLogId } = request.params as { workOutLogId: string }

        const workOutLog = await WorkoutLogModel.findById(workOutLogId)
                                .populate("exercise", "name")

        //if(!routine) return reply.status(404).send({ message: "Exercise not found"})

        return reply.status(200).send(workOutLog)
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const createWorkOutLog = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { userId } = request.user as { userId: Types.ObjectId }
        const { exerciseId, sets, reps, weight, date } = request.body as createWorkOutLogDTO

        const newWorkOutLog = new WorkoutLogModel({
            user: userId,
            exercise: exerciseId,
            sets,
            reps,
            weight,
            date: new Date(date)
        })

        await newWorkOutLog.save()

        return reply.status(201).send({message: "Workoutlog successfully created"})
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const updateWorkOutLog = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { workOutLogId } = request.params as { workOutLogId: string }
        const { sets, reps, weight, date } = request.body as createWorkOutLogDTO

        const data: any = {}

        if(sets) data.sets = sets
        if(reps) data.reps = reps
        if(weight) data.weight = weight
        if(date) data.date = date

        // const workOutLog = 
        await WorkoutLogModel.findByIdAndUpdate(workOutLogId, data)

        //if(!routine) return reply.status(404).send({ message: "Exercise not found"})

        return reply.status(201).send({message: "Workoutlog successfully created"})
    } catch (error) {
        return reply.status(500).send(error)
    }
}

export const deleteWorkOutLog = async (request: FastifyRequest, reply: FastifyReply) => {
    try {

        const { workOutLogId } = request.params as { workOutLogId: string }

        // const routine = 
        await WorkoutLogModel.findByIdAndDelete(workOutLogId)

        //if(!routine) return reply.status(404).send({ message: "Exercise not found"})

        return reply.status(200).send({message: "WorkOutLog successfully updated"})
    } catch (error) {
        return reply.status(500).send(error)
    }
}