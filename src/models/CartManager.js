const fs = require("fs");

class CartManager {
    constructor(){
        this.cart = [],
        this.cartIDCounter = 1;
    }

    async createCart(){
        try {
            const newCartId = this.cartIDCounter++ 
            const newCart = {
                cartId: newCartId,
                items: [] // Initialize an empty array for items in the cart
            };
            this.cart.push(newCart);
            await this.saveCartToFile();
            return newCartId; // Return the ID of the newly created cart
        } catch (error) {
            console.error("Error while creating a new cart:", error);
        }
    }
    async addToCart(cartId, productId, quantity) {
        try {
            const productsToLoad = await this.loadProducts(); // Load the JSON products file
            const product = productsToLoad.find((product) => parseInt(product.id) === parseInt(productId)); // Finding a product with the given ID
    
            if (product) {
                // Check if the cart exists
                const existingCartIndex = this.cart.findIndex((cart) => cart.cartId === parseInt(cartId));
    
                if (existingCartIndex !== -1) {
                    // Check if the product exists in the cart
                    const existingCartItemIndex = this.cart[existingCartIndex].items.findIndex(
                        (item) => item.productId === parseInt(productId)
                    );
    
                    // If it does exist, update the quantity of the items
                    if (existingCartItemIndex !== -1) {
                        this.cart[existingCartIndex].items[existingCartItemIndex].quantity =
                            (this.cart[existingCartIndex].items[existingCartItemIndex].quantity || 0) + parseInt(quantity);
                    } else {
                        // If it doesn't exist, add the product to the cart
                        this.cart[existingCartIndex].items.push({
                            productId: parseInt(productId),
                            quantity: parseInt(quantity),
                        });
                    }
                } else {
                    // If the cart doesn't exist, create a new cart
                    const newCartId = this.cartIDCounter++;
                    const newCart = {
                        cartId: newCartId,
                        items: [
                            {
                                productId: parseInt(productId),
                                quantity: parseInt(quantity),
                            },
                        ],
                    };
    
                    this.cart.push(newCart);
                }
    
                // Saving the updated cart to the JSON file
                await this.saveCartToFile();
            } else {
                console.log(`Product with ID ${productId} was not found.`);
            }
        } catch (error) {
            console.error("Error while adding to cart:", error);
        }
    }
    

    async getCart(){
        try{
            const fileContet = await fs.promises.readFile("./src/json/Cart.json", "utf-8")
            const parsedCart = JSON.parse(fileContet)
            if(parsedCart === 0) {
                console.log("No items in the cart were found")
            } else {
                return parsedCart
            }
        }catch(error){
            console.error("Error while reading the file:" , error)
        }
    }
    async saveCartToFile() {
        try {
            // Save the cart to a JSON file (you can customize the file path)
            await fs.promises.writeFile("./src/json/Cart.json", JSON.stringify(this.cart, null, 2), "utf-8");
        } catch (error) {
            console.error("Error while saving cart to file:", error);
        }
    }

    async loadProductIds() {
        try {
            // Load only the product IDs from the JSON file
            const fileContent = await fs.promises.readFile("./src/json/ProductsList.json", "utf-8");
            const products = JSON.parse(fileContent);
            
            // Extract and return only the product IDs
            return products.map(product => product.id);
        } catch (error) {
            console.error("Error while loading product IDs:", error);
            return [];
        }
    }
    async loadProducts(getIds) {
        //Looks for the list of ids inside the cart. 
        if (!getIds) {
            console.error("Ids were not found" , getIds)
        }else {
            return this.loadProductIds();
        }
    
        try {
            // Load the products from the JSON file
            const fileContent = await fs.promises.readFile("./src/json/ProductsList.json", "utf-8");
            return JSON.parse(fileContent);
        } catch (error) {
            console.error("Error while loading products:", error);
            return [];
        }
    }

    //This is to make a dynamic single instance 
    static get instance() {
        if (!this._instance) {
            this._instance = new CartManager();
        }
        return this._instance;
    }
};


module.exports = CartManager.instance;