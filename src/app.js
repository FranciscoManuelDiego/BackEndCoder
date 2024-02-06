const express = require("express");
const productsRoutes = require("./routes/productsRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const viewsRoutes = require("./routes/viewsRoutes.js")
const CartManager = require('./models/CartManager'); 
const socket = require("socket.io")
const app = express();
const exphbs = require("express-handlebars");
const PORT = 4000;

// To manage multiple dynamic requests
app.use(express.urlencoded({extended:true}));

//Static Resource for the HTML
app.use(express.static("public"))
// HBS config and view of it is HBS with its views
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

// Consuming Routes
app.use("/api/products", productsRoutes)
app.use("/api/cart", cartRoutes)
app.use("/", viewsRoutes)

// Creating an instance of the port
const httpServer = app.listen(PORT , 
    ()=>console.log(`Server running on port: ${PORT}🏃`))

// Establishing socket.io
const io = socket(httpServer)
io.on('connection', (socket) => {
    console.log('A client has connected!');

    // Send a welcome message to the client
    socket.emit('Message', "Hi Client. How is it going?");

    // Handle addToCart event
    socket.on('addToCart', async data => {
        try {
            const { productId, title, quantity } = data;
            await CartManager.addToCart(/* cartId */ productId, title, quantity);
            // Send acknowledgment back to the client if needed
            socket.emit('addedToCart', { productId, title, quantity });
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Handle error if needed
        }
    });
});