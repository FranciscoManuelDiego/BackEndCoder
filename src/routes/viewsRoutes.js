const express = require("express");
const Product = require("../models/MongoModels/Products")
const handlebarsConfig = require("../../public/js/handlebarsConfig")
const router = express.Router();

// const path = require("path");
// const fs = require("fs"); 

// Rendering realtime products with fs 
// router.get("/realtimeproducts", (req, res) => {
//     try {
//         const productListPath = path.join(__dirname, '..', 'json', 'ProductsList.json'); //Creating an Absolute path to read the ProductList
//         const productListRaw = fs.readFileSync(productListPath)
//         const productList = JSON.parse(productListRaw)
//         res.render("realtimeproducts", { title: "Test BackEnd" , productList})
//     } catch (error) {
//         console.error("Error rendering realtimeproducts view:", error)
//         res.status(500).send("Internal Server Error")
//     }
// });

//Using the  method directly from the products
router.get('/realtimeproducts', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;

        // Check if a sorting parameter is present in the request
        let sortQuery = { price: 1};
        if (req.query.sort === 'price-asc') {
             sortQuery = { price: 1 }; // Sort by price in ascending order
        } else if (req.query.sort === 'price-desc') {
            sortQuery = { price: -1 }; // Sort by price in descending order
        }
        
        // Directly call Product.paginate within the route handler
        const products = await Product.paginate({}, { page, limit, sort:sortQuery });
        const viewData = {
            title: 'Realtime Products',
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            prevPage: products.prevPage,
            hasNextPage: products.hasNextPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            handlebarsConfig: handlebarsConfig // Pass the Handlebars configuration to view the products from the database
        };
        // console.log("Rendering realtimeproducts view with data:", viewData);
        res.render('realtimeproducts', viewData);
    } catch (error) {
        console.error("Error rendering products view:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/chats", (req, res) => {
    try {
        res.render("chats", { title: "Test BackEnd Chats"})
    } catch (error) {
        console.error("Error rendering chats view:", error)
        res.status(500).send("Internal Server Error")
    }
});

module.exports = router;