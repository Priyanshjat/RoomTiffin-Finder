import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/roomtiffin-finder"
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 3000
        })
        console.log(`DB CONNECTION SUCCESS : ${conn.connection.name}`.bgGreen.black)
    } catch (error) {
        console.log(`DB CONNECTION FAILED : ${error.message} (Running with in-memory resilient mock store)`.bgYellow.black)
    }
}

export default connectDB
