import mongoose, { Schema } from "mongoose";

const MpnSchema = new Schema(
    {
        mpn: String,
        make: String,
        category: String,
        subcategory: String,
        description: String,
        partialPartNumber: Number,
        partNumber: Number,

    },
    {
        timestamps: true,
    }
)

const MechanicalMPN = mongoose.models.MechanicalMPN || mongoose.model("MechanicalMPN", MpnSchema)
export default MechanicalMPN;