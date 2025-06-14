import { asyncHandler } from "../utils/asynchandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uplodeoncloudenary } from "../utils/cloudenary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccesandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccestoken()
        const refreshToken = user.generateRefresstoken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(509, "Somthing went rong wile geratin refresh token")
    }
}
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

const loginUser = asyncHandler(async (req, res) => {
    //req.body
    //check user
    //find the user
    //password check
    //access token
    //refresh token
    //send cookies
    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(402, "please enter username")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "plese rejister")
    }

    const ispasswordvalid = await user.ispasswordCorrect(password)

    if (!ispasswordvalid) {
        throw new ApiError(400, "passowrd is not correct")
    }
    const { accessToken, refreshToken } = await generateAccesandRefreshToken(user._id)

    const loggedinuser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: false
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinuser,
                    accessToken,
                    refreshToken,
                },
                "user logged in succesfully"
            )
        );




})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            rerefreshToken: undefined
        }
    }, {
        new: true
    }

    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logout succesfuly"))


})
const refresAccesshToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Unauthroized request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(402, "refresh token is expired")
        }

        const options = {
            httpOnly: true,
            secure: true

        }
        const { accessToken, newrefreshToken } = await generateAccesandRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(
                    201,
                    { accessToken, refreshToken: newrefreshToken },
                    "access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")

    }






})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body


    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.ispasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "invalid old password")
    }
    user.password = new password
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {}, "password changed succesfully"))

})

const getCurrentuser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(new ApiResponse 200, req.user, "current user fetched successfully")

})

const updateAccountdetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required ")
    }
    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }
        },
        { new: true }
    ).select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Accountdetails updated succesfully"))
})

const updateuseravatar = asyncHandler(async (req, res) => {
    const avatarlocalpath = req.file?.path

    if (!avatarlocalpath) {
        throw new ApiError(400, "Aavatra file is missimg")
    }

    const avatra = await uplodeoncloudenary(avatarlocalpath)
    if (!avatra.url) {
        throw new ApiError(400, "Error while uploading on avatra")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatra: avatra.url
            }
        },
        { new: true }
    ).select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200, user, "avatar  updated succesfully"))
})
const updatecoverImage = asyncHandler(async (req, res) => {
    const coverimagelocalpath = req.file?.path

    if (!coverimagelocalpath) {
        throw new ApiError(400, "cover file is missimg")
    }

    const coverImage = await uplodeoncloudenary(coverimagelocalpath)
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on coverimage")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "coverimage updated successfully")
        )
})



// export { loginUser }
export { registerUser, loginUser, logoutUser, refresAccesshToken, changeCurrentPassword, getCurrentuser, updateAccountdetails, updateuseravatar, updatecoverImage }