import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDENARY_API_KEY,
    api_secret: process.env.CLOUDENARY_API_SECREATE
});


const uplodeoncloudenary = async (localfilepath) => {
    try {
        if (!localfilepath) return null
        //uplode the file on cloudenary
        const responce = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })
        //fillhas been uplodeded successfuly

        // console.log("file is uploded on cloudenary", responce.url)
        fs.unlinkSync(localfilepath)
        return responce


    } catch (error) {
        console.log("this is clodunary error")
        fs.unlinkSync(localfilepath)//remove the locally saved temporary file as uplode operationgot faild

    }
}

export { uplodeoncloudenary }
