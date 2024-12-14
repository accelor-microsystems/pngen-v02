import mongoose, { Schema } from "mongoose";

const CapitalSchema = new Schema(
    {
        capitalNumber: Number,
        capital: String,
    },
    {
        timestamps: true,
    }
)

const ToolsCapital = mongoose.models.ToolsCapital || mongoose.model("ToolsCapital", CapitalSchema)
export default ToolsCapital;