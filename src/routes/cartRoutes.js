const express = require("express");
// const CartManager = require("../models/CartManager.js");
const Cart = require("../models/MongoModels/Carts.js")
const router = express.Router();

// // Create a new cart (fs)
// router.post("/", async (req, res) => {
//     try {
//         const newCartId = await CartManager.createCart();
//         res.status(201).json({ message: "Cart created successfully!", cartId: newCartId });
//     } catch (err) {
//         console.error("Error while creating a new cart:", err);
//         res.status(500).send("Internal Server Error");
//     }
// });

// // Get cart by Id (fs)
// router.get("/:cid", async (req, res) => {
//     const cartId = req.params.cid;
//     try {
//         const cart = await CartManager.getCart(cartId);
//         if (cart) {
//             res.status(200).json(cart);
//         } else {
//             res.status(404).send("Cart not found");
//         }
//     } catch (err) {
//         console.error(`Error while getting cart with ID ${cartId}:`, err);
//         res.status(500).send("Internal Server Error");
//     }
// });

// // Add a product to a specific cart (fs)
// router.post("/:cid/product/:pid", async (req, res) => {
//     const cartId = req.params.cid;
//     const productId = req.params.pid;
//     const { quantity } = req.body;

//     try {
//         await CartManager.addToCart(cartId, productId, quantity);
//         res.status(201).json({message: "Product added to cart successfully"});
//     } catch (err) {
//         console.error(`Error while adding product to cart:`, err);
//         res.status(500).send("Internal Server Error");
//     }
// });

// Get carts in DB
router.get("/" , async (req,  res ) => {
    try{
        const carts = await Cart.find()
        res.status(201).json(carts)
    }catch(err){
        console.error(`Error while getting carts: ${err}`)
        res.status(500).send("Internal server Error")
    }
})

// Post carts in DB
router.post("/", async (req, res) => {
    const { userId, products } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            // If the cart doesn't exist, create a new one
            const newCart = new Cart({
                userId,
                products,
            });
            await newCart.save();
            res.status(201).json({ message: 'Cart created successfully', cart: newCart });
        } else {
            // If the cart exists, update the quantity or add a new product
            for (const productItem of products) {
                const existingProductIndex = cart.products.findIndex(item => item.productId.equals(productItem.productId));

                if (existingProductIndex !== -1) {
                    // If the product exists in the cart, update the quantity
                    cart.products[existingProductIndex].quantity += productItem.quantity;
                } else {
                    // If the product is not in the cart, add it
                    cart.products.push({ productId: productItem.productId, quantity: productItem.quantity });
                }
            }
            //Saving the cart into the array
            await cart.save();
            res.status(200).json({ message: 'Cart updated successfully', cart });
        }
    } catch (err) {
        console.error(`Error while trying to post a new cart: ${err}`);
        res.status(500).send("Internal Server Error");
    }
});

// Put carts in a DB
router.put("/:cid" , async(req, res) => {
    const cartId = req.params.cid
    const updatedCart = req.body
    // Check and set the id.
    try{
        const carts = await Cart.updateOne({ _id: cartId }, { $set: updatedCart })
        res.status(201).json(carts)
        if (result.nModified === 1) {
            // Check if a user was updated (nModified should be 1)
            res.status(200).json({ message: 'Cart updated successfully' });
        } else {
            // If nModified is not 1, it means the user was not found
            res.status(404).json({ message: 'Cart not found' });
        }
    }catch(err){
        console.error(`Error while trying to update a cart with ID: ${cartId}`, err)
        res.status(500).send("Internal Server Error");
    }
})

// Delete carts in a DB
router.delete("/:cid" , async(req, res) => {
    const cartId = req.params.cid
    try{
        const carts = await Cart.deleteOne({ _id: cartId })
        if (carts.deletedCount === 1) {
            // Check if a user was deleted (deletedCount should be 1)
            res.status(200).json({ message: 'Cart deleted successfully', carts });
        } else {
            // If deletedCount is not 1, it means the user was not found
            res.status(404).json({ message: 'Cart not found' });
        }
    }catch(err){
        console.error(`Error while trying to delete a user: ${cartId}`, err)
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router; 
