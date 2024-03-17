const mongoose = require("mongoose"); 
const Product = require("./Products"); // Adjust the path accordingly

const cartSchema = new mongoose.Schema({
    userId: { type: String, index: true, required: true, unique: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: Product, required: true },
            quantity: { type: Number, default: 1 }
        },
    ]
}, { timestamps: true });


module.exports = mongoose.model("Cart", cartSchema, "Carts");