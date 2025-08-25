import mongoose from "mongoose"
import { MONGO_URI } from "./env"

export const connectDB = async () => {
    if (!MONGO_URI) {
        console.error("MONGO_URI is not defined")
        process.exit(1)
    }
    try {
        await mongoose.connect(MONGO_URI)
        console.log("DB connected")
    } catch (error) {
        console.error("Error connecting to mongodb database: ", error)
        process.exit(1)
    }
}