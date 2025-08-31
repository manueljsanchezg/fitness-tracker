import "dotenv/config"
import { app } from "./app"
import { PORT } from "./config/env"
import { connectDB } from "./config/db"

async function start() {
    try {
        await connectDB()
        await app.listen({port: Number(PORT), host: '0.0.0.0'})
        console.log(`Server running on PORT: ${PORT}`)
    } catch (error) {
        console.log("Error initializing the server")
        process.exit(1)
    }
}

start()