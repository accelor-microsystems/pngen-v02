import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
    {
        categoryNumber: Number,
        category: String,
    },
    {
        timestamps: true,
    }
)

const ProductionCategory = mongoose.models.ProductionCategory || mongoose.model("ProductionCategory", CategorySchema)
export default ProductionCategory;