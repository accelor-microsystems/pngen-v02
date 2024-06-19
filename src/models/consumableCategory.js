import mongoose, { Schema } from "mongoose";

const ConsumableCategorySchema = new Schema(
    {
        categoryNumber: Number,
        category: String,

    },
    {
        timestamps: true,
    }
)

const ConsumableCategory = mongoose.models.ConsumableCategory || mongoose.model("ConsumableCategory", ConsumableCategorySchema)
export default ConsumableCategory;