import mongoose, { Schema } from "mongoose";

const MakeSchema = new Schema(
    {
        name: String,
    },
    {
        timestamps: true,
    }
)

const NC_Mech_Make = mongoose.models.NC_Mech_Make || mongoose.model("NC_Mech_Make", MakeSchema)
export default NC_Mech_Make;