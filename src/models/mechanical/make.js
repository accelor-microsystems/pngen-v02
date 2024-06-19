import mongoose, { Schema } from "mongoose";

const MakeSchema = new Schema(
    {
        name: String,
    },
    {
        timestamps: true,
    }
)

const MechanicalMake = mongoose.models.MechanicalMake || mongoose.model("MechanicalMake", MakeSchema)
export default MechanicalMake;