import mongoose from "mongoose";

export const MongoConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI as string)
    } catch (error) {
        return console.error(error)
    }
}