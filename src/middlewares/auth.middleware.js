import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandeler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")


        if (!token) {
            throw new ApiError(401, "unauthrized user")
        }
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(402, "invalid Accesss token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid accesstoken")

    }





})