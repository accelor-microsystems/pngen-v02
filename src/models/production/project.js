import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
    {
        projectNumber: Number,
        name: String,
    },
    {
        timestamps: true,
    }
)

const ProductionProject = mongoose.models.ProductionProject || mongoose.model("ProductionProject", ProjectSchema)
export default ProductionProject;