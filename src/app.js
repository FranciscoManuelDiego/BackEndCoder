const express = require("express");
const session = require("express-session");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const productsRoutes = require("./routes/productsRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const usersRoutes = require("./routes/usersRoutes.js")
const viewsRoutes = require("./routes/viewsRoutes.js");
const sessionRoutes = require("./routes/sessionRoutes.js") ;
const Msg = require("./models/MongoModels/Chats"); 
const socket = require("socket.io")
const dotenv = require("dotenv")
const initializePassport = require("./config/passportconfig.js");
const passport = require("passport")
const app = express();
const handlebars = require(".././public/js/handlebarsConfig.js")
const PORT = 4000;

// Using the method to parse the config
dotenv.config();

// To manage multiple dynamic requests Middleware
app.use(express.urlencoded({extended:true}));
// Use express.json() middleware to parse JSON requests
app.use(express.json());

//Static Resource for the HTML
app.use(express.static("public"))
// HBS config and view of it is HBS with its views
app.engine("handlebars", handlebars.engine)
app.set("view engine", "handlebars")
app.set("views", "./src/views")

// Adding CookieParser Middleware
app.use(cookieParser());

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_CONNECTION);
        console.log('Connected to MongoDB database');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the application on connection error
    }
}

connectDB();

// Adding MongoStore connection
app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true,   
    store: MongoStore.create({
        mongoUrl: process.env.MONGOOSE_CONNECTION, ttl: 100
    }) 
}))

// Adding Passport to the app
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Consuming Routes
app.use("/api/products", productsRoutes)
app.use("/api/users", usersRoutes)
app.use("/", sessionRoutes);
app.use("/api/carts", cartRoutes)
app.use("/", viewsRoutes)

// Creating an instance of the port
const httpServer = app.listen(PORT , 
    ()=>console.log(`Server running on port: ${PORT}🏃`))

// Establishing socket.io
const io = socket(httpServer)
// Socket.io handling
io.on("connection", async socket => {
    console.log("A client has connected!");

      // Fetch previous messages from the database
    try {
    const previousMessages = await Msg.find().sort({ createdAt: 1 }).exec();
    socket.emit('previousMessages', previousMessages);
    } catch (error) {
    console.error('Error fetching previous messages:', error);
    }
    // Send a welcome message to the client
    socket.emit("message", "Hi Client. How is it going?");

    // Emit existing chat messages when a client connects
    Msg.find().then(result => {
        socket.emit("output-message", result);
    });

    // Handle chat message event
    socket.on("chatmessage", msg => {
        const message = new Msg({ user: "username", email: "user@example.com", message: msg });
        message.save().then(() => {
        io.emit("message", msg);
        });
    });
});


// io.on('connection', (socket) => {
//     console.log('A client has connected!');

//     // Send a welcome message to the client
//     socket.emit('Message', "Hi Client. How is it going?");

//     // Handle addToCart event
//     socket.on('addToCart', async data => {
//         try {
//             const { productId, title, quantity } = data;
//             await CartManager.addToCart(/* cartId */ productId, title, quantity);
//             // Send acknowledgment back to the client if needed
//             socket.emit('addedToCart', { productId, title, quantity });
//         } catch (error) {
//             console.error('Error adding to cart:', error);
//             // Handle error if needed
//         }
//     });
// });

