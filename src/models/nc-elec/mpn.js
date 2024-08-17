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

const NC_Elec_MPN = mongoose.models.NC_Elec_MPN || mongoose.model("NC_Elec_MPN", MpnSchema)
export default NC_Elec_MPN;