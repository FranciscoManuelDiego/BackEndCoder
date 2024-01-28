const express = require("express");
const CartManager = require("../models/CartManager.js");
const router = express.Router();

// Create a new cart
router.post("/", async (req, res) => {
    try {
        const newCartId = await CartManager.createCart();
        res.status(201).json({ message: "Cart created successfully!", cartId: newCartId });
    } catch (err) {
        console.error("Error while creating a new cart:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Get cart by Id
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await CartManager.getCart(cartId);
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).send("Cart not found");
        }
    } catch (err) {
        console.error(`Error while getting cart with ID ${cartId}:`, err);
        res.status(500).send("Internal Server Error");
    }
});

// Add a product to a specific cart
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        await CartManager.addToCart(cartId, productId, quantity);
        res.status(201).json({message: "Product added to cart successfully"});
    } catch (err) {
        console.error(`Error while adding product to cart:`, err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router; 
