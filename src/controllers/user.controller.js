import { asyncHandler } from "../utils/asynchandeler.js";
const rejisterUser=asyncHandler(async(req ,res )=>{
    res.status(200).json({
        message:"Ok"
    })
})
export {rejisterUser}