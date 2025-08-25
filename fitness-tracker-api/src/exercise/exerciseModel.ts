import { model, Schema } from "mongoose"

interface IExercise {
    name: string,
    muscles_involved: string[]
}

const exerciseSchema = new Schema<IExercise>(
    {
    name: { type: String, required: true, trim: true },
    muscles_involved: [{ type: String, required: true, trim: true }],
    },
    { timestamps: true }
)

export const ExerciseModel = model<IExercise>('Exercise', exerciseSchema)