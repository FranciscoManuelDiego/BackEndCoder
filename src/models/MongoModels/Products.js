const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2"); 


const productSchema = new mongoose.Schema(
    {
        title:{ type: String, index: true, required: true, unique: true},
        description: {type: String, required: true},
        category: {type: String, required: true },
        price: {type: Number, required: true },
        thumbnail: {type: String, required: true },
        code: {type: String, required: true, unique: true },
        status: {type: Boolean},
        stock: {type: Number, required: true},
    },
    {timestamps: true} // This signals the date in which the item is created
)

productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Products", productSchema, "Products")