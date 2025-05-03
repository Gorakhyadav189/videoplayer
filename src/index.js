// require('dotenv').config({ path: './env' })
import dotenv from "dotenv";
import app from './app.js';
import connectDB from "./db/index.js";
dotenv.config({
    path: './env'
})
// const app = express();
// app.use(express.json());

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("app error:", error);
            throw error

        })
        app.listen(process.env.PORT || 8000, () => {

            console.log(`server is running at port :${process.env.PORT}`)
        })

    })
    .catch((error) => {
        console.log("db connection faild", error);
    })
