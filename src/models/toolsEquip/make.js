import mongoose, { Schema } from "mongoose";

const MakeSchema = new Schema(
    {
        name: String,
    },
    {
        timestamps: true,
    }
)

const ToolsMake = mongoose.models.ToolsMake || mongoose.model("ToolsMake", MakeSchema)
export default ToolsMake;