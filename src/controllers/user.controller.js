import { asyncHandler } from "../utils/asynchandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplodeoncloudenary } from "../utils/cloudenary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {

    //get user detail from frontend
    //validation
    //chek of user alardey exist=name/email
    //check  for images an d avatar
    //uplode them clodenary
    //create user object because we send data to mongodb-craete entry in db
    // rmove password abd refrersh token field from responce
    //chek for user creation
    // return response
    //tsk+>consol body,avatrlocalpath,


    const { fullname, email, username, password } = req.body
    // console.log("email", email);

    if ([fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields required")
    }

    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existUser) {
        throw new ApiError(409, "UserAlardey exist")
    }
    // console.log(req.files)
    const avatarlocalpath = req.files?.avatar[0]?.path;
    // const coverlocalpath = req.files?.coverImage[1]?.path;

    let coverlocalpath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverlocalpath = req.files.coverImage[0].path


    }

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar fielse is require")
    }
    const avatar = await uplodeoncloudenary(avatarlocalpath);
    const coverimage = await uplodeoncloudenary(coverlocalpath);
    if (!avatar) {
        throw new ApiError(400, "Avatar fielse is require")

    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverimage?.url || "",
        email,
        password,
        username: username.toLowerCase()


    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"

    )
    if (!createdUser) {
        throw new ApiError(500, "somthing went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registerd successfully")
    )

})
export { registerUser }