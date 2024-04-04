const express = require("express");
const Product = require("../models/MongoModels/Products")
const Cart = require("../models/MongoModels/Carts")
const handlebarsConfig = require("../../public/js/handlebarsConfig")
const router = express.Router();


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

// Chats view.
router.get("/chats", (req, res) => {
    try {
        res.render("chats", { title: "Test BackEnd Chats"})
    } catch (error) {
        console.error("Error rendering chats view:", error)
        res.status(500).send("Internal Server Error")
    }
});

//Cart view.
router.get('/viewcart', async (req, res) => {
    try {
        // Assuming you retrieve the cart based on the user ID
        // const userId = req.params.userId;
        // console.log('User ID from params:', userId);
        const carts = await Cart.find().populate('products.productId');
        console.log(carts)
        // Check if there are carts
        if (carts.length > 0) {
            res.render('viewcart', { title: 'User Carts', carts, handlebarsConfig });
        } else {
            res.render('viewcart', { title: 'User Carts', carts: null, handlebarsConfig });
        }
    } catch (error) {
        console.error('Error rendering viewcart view:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Login and Register view.
router.get("/register", (req, res) => {
    if (req.session.login) {
        return res.redirect("/profile");
    }
    res.render("register");
});

router.get("/login", (req, res) => {
    if (req.session.login) {
        return res.redirect("/profile");
    }
    res.render("login");
});

// Profile view
router.get("/profile", (req, res) => {
    res.render("profile");
})

module.exports = router;