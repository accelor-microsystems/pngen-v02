import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
    {
        project: { type: String, required: true }, // Reference to the project name
        categoryNumber: Number,
        category: String,
    },
    {
        timestamps: true,
    }
);

const ProductionCategory = mongoose.models.ProductionCategory || mongoose.model("ProductionCategory", CategorySchema);
export default ProductionCategory;
