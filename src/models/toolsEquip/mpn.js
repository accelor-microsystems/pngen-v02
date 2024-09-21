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

const ToolsMPN = mongoose.models.ToolsMPN || mongoose.model("ToolsMPN", MpnSchema)
export default ToolsMPN;
