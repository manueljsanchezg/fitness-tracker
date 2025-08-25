import { model, Schema, Types } from "mongoose"

interface IRefreshToken {
    userId: Types.ObjectId,
    token: string,
    expiresAt: Date,
    device?: string,
}

const allowedRoles = ["admin", "user"]

const refreshTokenSchema = new Schema<IRefreshToken>(
    {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    device: { type: String }
    },
    { timestamps: true }
)

export const RefreshTokenModel = model<IRefreshToken>('RefreshToken', refreshTokenSchema)