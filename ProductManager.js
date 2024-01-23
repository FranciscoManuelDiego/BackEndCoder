const fs = require("fs");
const { title } = require("process");
//Class and methods
class ProductManager{
    constructor(){
            this.products = [];
            this.productIDCounter= 1;
    }
    
    async addProduct(title, description, price, thumbnail, code){
        if(this.products.some(product => product.code === code)){
            console.log(`This code: ${code} already exists in the array`)
            return 
        }
        const newProduct = {
            id: this.productIDCounter++,
            title,
            description,
            price,
            thumbnail,
            code
        }
        this.products.push(newProduct)
        try{
            fs.promises.writeFile("ProductsList.json", JSON.stringify(this.products , null, 2), "utf-8");
            console.log("Product added successfully.");
        }catch(error){
            console.error("Error writing to file:", error);
        }
    }
    async getProducts(limit){
        try{
            const fileContet = await fs.promises.readFile("ProductsList.json", "utf-8")
            const parsedProducts = JSON.parse(fileContet)
            if(this.products.length === 0) {
                console.log("No items were found")
            }
            const limitedProducts = limit ? parsedProducts.slice(0, limit) : parsedProducts; //Establish limit with the slice method
            return limitedProducts;
        }catch(error){
            console.error("Error while reading the file:" , error)
        }
    }
    async getProductById(id){
        try{
            const fileContent = await fs.promises.readFile("ProductsList.json", "utf-8")
            const parsedProducts = JSON.parse(fileContent)
            const productFound = parsedProducts.find(product =>product.id.toString() === id)
            if(!productFound){
                console.log(`Product with the Id ${id} is not found`)
            } else {
                console.log(`Here is the Id found: ${id}` )
                return productFound
            }
        }catch(error){
            console.error("Error while reading the Id:" , error)
        }
    }
    async updateProduct(id, updatedTitle, updatedDescription, updatedPrice, updatedThumbnail ){
        try{
            const fileContet = await fs.promises.readFile("ProductsList.json", "utf-8")
            const parsedProducts = JSON.parse(fileContet)
            const productIndex = parsedProducts.findIndex(product =>product.id === id)
            if(productIndex === -1){
                console.log(`Product with id: ${id} not found. `)
            }
                // Update the properties of the found product
            parsedProducts[productIndex].title = updatedTitle;
            parsedProducts[productIndex].description = updatedDescription;
            parsedProducts[productIndex].price = updatedPrice;
            parsedProducts[productIndex].thumbnail = updatedThumbnail;
            await fs.promises.writeFile("ProductsList.json", JSON.stringify(parsedProducts, null, 2), "utf-8")
            console.log(`Product with id ${id} updated successfully:`)
            return parsedProducts[productIndex]
        }catch(error){
            console.error(`Error on updating ${id} due to:` , error)
        }
    }
    async deleteProduct(id){
        try{
            const fileContet = await fs.promises.readFile("ProductsList.json", "utf-8")
            const parsedProducts = JSON.parse(fileContet)
            const deletedProduct = parsedProducts.filter(product =>product.id !== id) //Creating a new array without the product 
            await fs.promises.writeFile("ProductsList.json", JSON.stringify(deletedProduct, null, 2), "utf-8")
            console.log(`Product with id ${id} deleted successfully.`);
        }catch(error){
            console.error(`An error occured while deleting product with ${id}: ` , error)
        }   
    }
    //This is to make a dynamic single instance 
    static get instance() {
        if (!this._instance) {
            this._instance = new ProductManager();
        }
        return this._instance;
    }
}

//Executing prompts

async function executePrompts() {
    const productManager = ProductManager.instance;

    await productManager.addProduct("Notebook Compaq", "Suitable", 150, "thumbnail1.jpg", "001");
    await productManager.addProduct("Notebook Asus", "Modern", 250, "thumbnail2.jpg", "002");
    await productManager.addProduct("Notebook HP", "Cool", 300, "thumbnail3.jpg", "003");
    // await productManager.addProduct("Same Code", "Modern", 250, "thumbnail2.jpg", "002");

    // const allProducts = await productManager.getProducts();
    // console.log(allProducts);

    // const productById1 = await productManager.getProductById(1);
    // console.log(productById1);

    // const updateProduct = await productManager.updateProduct(2, "Notebook Toshiba", "Outdated", 300, "updatedThumbnail.jpg");
    // console.log(updateProduct);
    // const productById2 = await productManager.getProductById(5);
    // console.error(productById2);
    // await productManager.deleteProduct(3)

    const updatedProducts = await productManager.getProducts();
    console.log("Here is the list of the updated products:" , updatedProducts);
}

executePrompts();

module.exports = ProductManager.instance;