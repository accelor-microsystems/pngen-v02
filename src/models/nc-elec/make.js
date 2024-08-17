import mongoose, { Schema } from "mongoose";

const MakeSchema = new Schema(
    {
        name: String,
    },
    {
        timestamps: true,
    }
)

const NC_Elect_Make = mongoose.models.NC_Elect_Make || mongoose.model("NC_Elect_Make", MakeSchema)
export default NC_Elect_Make;