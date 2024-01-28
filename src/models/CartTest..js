const CartManager = require("./CartManager.js")

// Function to test addToCart
async function testAddToCart() {
    console.log("Adding products to the cart...");
    await CartManager.addToCart(1, 2); // Assuming product ID 1 and quantity 2
    await CartManager.addToCart(2, 1); // Assuming product ID 2 and quantity 1
    console.log("Cart after adding products:", await CartManager.getCart());
}

// Function to test removeFromCart
async function testRemoveFromCart() {
    console.log("Removing a product from the cart...");
    await CartManager.removeFromCart(1); // Assuming product ID 1
    console.log("Cart after removing product:", await CartManager.getCart());
}

// Function to test updateQuantity
async function testUpdateQuantity() {
    console.log("Updating quantity in the cart...");
    await CartManager.updateQuantity(2, 5); // Assuming product ID 2 and max quantity 5
    console.log("Cart after updating quantity:", await CartManager.getCart());
}

// Execute the test functions in order
async function runTests() {
    await testAddToCart();
    await testRemoveFromCart();
    await testUpdateQuantity();
}

// Run the tests
runTests();