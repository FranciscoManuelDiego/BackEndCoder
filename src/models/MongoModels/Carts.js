const mongoose = require("mongoose"); 

const cartSchema = new mongoose.Schema(
    {
    userId:{ type:String, index: true, required: true, unique: true },
    products: [
        {
        productId: {type: String, ref: 'Product', required: true },
        quantity: {type: Number, default: 1}
        },
    ]
    },
    {timestamps: true} // This signals the date in which the item is created
)
module.exports = mongoose.model("Cart", cartSchema, "Carts")