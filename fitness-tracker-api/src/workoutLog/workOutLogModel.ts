import { Schema, model, Types } from "mongoose"

export interface IWorkoutLog {
    user: Types.ObjectId
    exercise: Types.ObjectId
    sets: number
    reps: number
    weight: number
    date: Date
}

const workoutLogSchema = new Schema<IWorkoutLog>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        exercise: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
        sets: { type: Number, required: true, trim: true },
        reps: { type: Number, required: true, trim: true },
        weight: { type: Number, required: true, trim: true },
        date: { type: Date, default: Date.now }
    }, 
    { timestamps: true })

export const WorkoutLogModel = model<IWorkoutLog>("WorkoutLog", workoutLogSchema)