import mongoose, { Schema } from "mongoose";

const MpnSchema = new Schema(
    {
        mpn: String,
        make: String,
        category: String,
        subcategory: String,
        description: String,
        unit: String,
        partialPartNumber: Number,
        partNumber: Number,

    },
    {
        timestamps: true,
    }
)

const NC_Mech_MPN = mongoose.models.NC_Mech_MPN || mongoose.model("NC_Mech_MPN", MpnSchema)
export default NC_Mech_MPN;
