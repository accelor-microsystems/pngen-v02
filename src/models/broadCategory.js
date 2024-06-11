import mongoose, { Schema } from "mongoose";

const BroadCategorySchema = new Schema(
    {
        name: String,
        number: Number,
    },
    {
        timestamps: true,
    }
)

const BroadCategory = mongoose.models.BroadCategory || mongoose.model("BroadCategory", BroadCategorySchema)
export default BroadCategory;