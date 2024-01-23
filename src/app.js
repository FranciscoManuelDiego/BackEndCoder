const express = require("express");
const ProductManager = require("../ProductManager.js");
const app = express();
const PORT = 4000;

// To manage multiple dynamic requests
app.use(express.urlencoded({extended:true}))

// Get all products
app.get("/products" , async (req, res) => {
    const limit = req.query.limit
    try{
        let products = await ProductManager.getProducts(limit)
        res.send(products)
    }catch(err){
        console.error(err)
    }
})
// Get ID products
app.get("/products/:pid" , async (req, res) => {
    const productID = req.params.pid
    try{
        let IdProduct = await ProductManager.getProductById(productID)
        res.send(IdProduct)
    }catch(err){
        console.error(`Error while trying to obtain Id Product: ${productID}` , err)
    }
})

app.listen(PORT , 
    ()=>console.log(`Server running on port: ${PORT}🏃`))