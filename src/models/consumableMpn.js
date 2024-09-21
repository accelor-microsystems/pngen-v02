import mongoose, { Schema } from "mongoose";

const MpnSchema = new Schema(
    {
        category: String,
        description: String,
        unit: String,
        partialPartNumber: Number,
        partNumber: Number,

    },
    {
        timestamps: true,
    }
)

const ConsumableMPN = mongoose.models.ConsumableMPN || mongoose.model("ConsumableMPN", MpnSchema)
export default ConsumableMPN;
