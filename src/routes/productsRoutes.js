const express = require("express");
const ProductManager = require("../models/ProductManager.js");
const router = express.Router();

// Middleware to parse JSON requests
router.use(express.json());

// Get All the products
router.get("/" , async (req, res) => {
    const limit = req.query.limit
    try{
        let products = await ProductManager.getProducts(limit)
        res.status(201).send(products)
    }catch(err){
        console.error(`Couldn't get the products: `, err)
        res.status(500).send("Internal Server Error");
    }
})

// Get ID products
router.get("/:pid" , async (req, res) => {
    const productID = req.params.pid
    try{
        let IdProduct = await ProductManager.getProductById(productID)
        res.status(201).send(IdProduct)
    }catch(err){
        console.error(`Error while trying to obtain Id Product: ${productID}` , err)
        res.status(500).send("Internal Server Error");
    }
})

// Post a new product
router.post("/" , async (req, res) => {
    const newProduct = req.body;
    try{
        await ProductManager.addProduct(
            newProduct.title,
            newProduct.description,
            newProduct.category,
            newProduct.price,
            newProduct.thumbnail,
            newProduct.code,
            newProduct.status,
            newProduct.stock)
            res.status(201).send({ message: "Product added successfully", product: newProduct });
    }catch(err){
        console.error(`Error while trying to post a new product: ${newProduct}`, err)
        res.status(500).send("Internal Server Error");
    }
})

// Put a product (Update)
router.put("/:pid" , async (req, res) =>{
    const productId = req.params.pid;
    const updatedProduct = req.body;
    try{
        await ProductManager.updateProduct(
            productId,             
            updatedProduct.title,
            updatedProduct.description,
            updatedProduct.category,
            updatedProduct.price,
            updatedProduct.thumbnail,
            updatedProduct.code,
            updatedProduct.status,
            updatedProduct.stock )
            res.status(201).send({ message: "Product modified successfully", product: updatedProduct });
    }catch(err){
        console.error(`Error while trying to update a new product: ${newProduct}`, err)
        res.status(500).send("Internal Server Error");
    }
})

router.delete("/:pid" , async(req, res) => {
    const productToDelete = req.params.pid;
    const productDeleted = req.body
    try{
        let IdProductDelete = await ProductManager.deleteProduct(productToDelete)
        res.status(201).send({message: "Product deleted successfully", product: productDeleted})
    }catch(err){
        console.error(`Couldn't delete the product with id: ${productToDelete} `, err)
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router; 
