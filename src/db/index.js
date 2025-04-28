


import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionninstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected!! DB_HOST:${connectionninstance.connection.host}`);

    } catch (error) {
        console.log("mmongooes db error", error)
        process.exit(1)

    }

}
export default connectDB