import { model, Schema, Types } from "mongoose"

export interface IRoutine {
    name: string
    exercises: Types.ObjectId[],
    user: Types.ObjectId
}

export interface IRoutineExercise {
    exercise: Types.ObjectId
    sets: number
    reps: number
    duration?: number
}

const routineExerciseSchema = new Schema<IRoutineExercise>(
    {
        exercise: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        duration: { type: Number }
    }, 
    { _id: false })

const routineSchema = new Schema<IRoutine>(
    {
        name: { type: String, required: true, trim: true },
        exercises: [routineExerciseSchema],
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
)

export const RoutineModel = model<IRoutine>("Routine", routineSchema)