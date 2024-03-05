const express = require("express");
// const ProductManager = require("../models/ProductManager.js");
const Product = require("../models/MongoModels/Products.js")
const router = express.Router();

// Get All the products (Fs)
// router.get("/" , async (req, res) => {
//     const limit = req.query.limit
//     try{
//         let products = await ProductManager.getProducts(limit)
//         res.status(201).send(products)
//     }catch(err){
//         console.error(`Couldn't get the products: `, err)
//         res.status(500).send("Internal Server Error");
//     }
// })

// Get ID products (Fs)
// router.get("/:pid" , async (req, res) => {
//     const productID = req.params.pid
//     try{
//         let IdProduct = await ProductManager.getProductById(productID)
//         res.status(201).send(IdProduct)
//     }catch(err){
//         console.error(`Error while trying to obtain Id Product: ${productID}` , err)
//         res.status(500).send("Internal Server Error");
//     }
// })

// Post a new product (Fs)
// router.post("/" , async (req, res) => {
//     const newProduct = req.body;
//     try{
//         await ProductManager.addProduct(
//             newProduct.title,
//             newProduct.description,
//             newProduct.category,
//             newProduct.price,
//             newProduct.thumbnail,
//             newProduct.code,
//             newProduct.status,
//             newProduct.stock)
//             res.status(201).send({ message: "Product added successfully", product: newProduct });
//     }catch(err){
//         console.error(`Error while trying to post a new product: ${newProduct}`, err)
//         res.status(500).send("Internal Server Error");
//     }
// })

// Put a product (Update) (Fs)
// router.put("/:pid" , async (req, res) =>{
//     const productId = req.params.pid;
//     const updatedProduct = req.body;
//     try{
//         await ProductManager.updateProduct(
//             productId,             
//             updatedProduct.title,
//             updatedProduct.description,
//             updatedProduct.category,
//             updatedProduct.price,
//             updatedProduct.thumbnail,
//             updatedProduct.code,
//             updatedProduct.status,
//             updatedProduct.stock )
//             res.status(201).send({ message: "Product modified successfully", product: updatedProduct });
//     }catch(err){
//         console.error(`Error while trying to update a new product: ${newProduct}`, err)
//         res.status(500).send("Internal Server Error");
//     }
// })

// Delete a product (Update) (Fs)
// router.delete("/:pid" , async(req, res) => {
//     const productToDelete = req.params.pid;
//     const productDeleted = req.body
//     try{
//         let IdProductDelete = await ProductManager.deleteProduct(productToDelete)
//         res.status(201).send({message: "Product deleted successfully", product: productDeleted})
//     }catch(err){
//         console.error(`Couldn't delete the product with id: ${productToDelete} `, err)
//         res.status(500).send("Internal Server Error");
//     }
// })

// Get users in DB
router.get("/" , async (req,  res ) => {
    try{
        const page = parseInt(req.query.page) || 1; //Setting manually the limits
        const limit = parseInt(req.query.limit) || 10; //Setting manually the limits
        const products = await Product.paginate({}, { page, limit });
        res.status(201).json(products);
    }catch(err){
        console.error(`Error while getting products: ${err}`)
        res.status(500).send("Internal server Error")
    }
})

// Post users in DB
router.post("/", async (req,res)=> {
    const newProduct = req.body;
    try{
        const products = await Product.create(newProduct)
        res.status(201).json(products)
    }catch(err){
        console.error(`Error while trying to post a new product: ${newProduct}`, err)
        res.status(500).send("Internal Server Error");
    }
})

// Put user in a DB
router.put("/:pid" , async(req, res) => {
    const productId = req.params.pid
    const updatedProduct = req.body
    // Check and set the id.
    try{
        const products = await Product.updateOne({ _id: productId }, { $set: updatedProduct })
        res.status(200).json({message: `Product with id: ${productId} updated sucessfully` ,products})
    }catch(err){
        console.error(`Error while trying to update a product: ${productId}`, err)
        res.status(500).send("Internal Server Error");
    }
})

// Delete user in a DB
router.delete("/:pid" , async(req, res) => {
    const productId = req.params.pid
    try{
        const products = await Product.deleteOne({ _id: productId })
        if (products.deletedCount === 1) {
            // Check if a user was deleted (deletedCount should be 1)
            res.status(200).json({ message: 'Product deleted successfully', products});
        } else {
            // If deletedCount is not 1, it means the user was not found
            res.status(404).json({ message: 'Product not found' });
        }
    }catch(err){
        console.error(`Error while trying to delete a product: ${productId}`, err)
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router; 
