const express = require("express");
const productsRoutes = require("./routes/productsRoutes.js")
const app = express();
const PORT = 4000;

// To manage multiple dynamic requests
app.use(express.urlencoded({extended:true}));

// Consuming Routes
app.use("/api/products", productsRoutes)

app.listen(PORT , 
    ()=>console.log(`Server running on port: ${PORT}🏃`))