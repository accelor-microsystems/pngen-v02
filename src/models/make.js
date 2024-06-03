import mongoose, { Schema } from "mongoose";

const MakeSchema = new Schema(
    {
        name: String,
    },
    {
        timestamps: true,
    }
)

const Make = mongoose.models.Make || mongoose.model("Make", MakeSchema)
export default Make;