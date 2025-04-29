

import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videFile: {
        type: String,//clodunary uurl
        required: true,

    },
    thumbnail: {
        type: String,//clodunary uurl
        required: true,
    },
    tittle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duraction: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublised: {

        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"

    }


}, { timestamps: true });
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)