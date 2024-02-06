const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs"); 

router.get("/realtimeproducts", (req, res) => {
    try {
        const productListPath = path.join(__dirname, '..', 'json', 'ProductsList.json'); //Creating an Absolute path to read the ProductList
        const productListRaw = fs.readFileSync(productListPath)
        const productList = JSON.parse(productListRaw)
        res.render("realtimeproducts", { title: "Test BackEnd" , productList})
    } catch (error) {
        console.error("Error rendering realtimeproducts view:", error)
        res.status(500).send("Internal Server Error")
    }
});

module.exports = router;