import { model, Schema } from "mongoose"

interface IUser {
    name: string,
    surname: string,
    email: string,
    password: string,
    role: string,
}

const allowedRoles = ["admin", "user"]

const userSchema = new Schema<IUser>(
    {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: allowedRoles, trim: true },
    },
    { timestamps: true }
)

export const UserModel = model<IUser>('User', userSchema)