const socket = io(); 

//Creating the Connection

socket.emit("Message", "Hello World! I'm a client" );
//Sending the Message. 

//Getting the message from sv: 
socket.on("Message", (data) => {
    console.log(data);
})

document.querySelectorAll('.addToCartBtn').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.dataset.productId;
        const title = this.dataset.title;
        const quantity = 1; // Assuming a quantity of 1 for now

        // Emit an event to the server with product data
        socket.emit('addToCart', { productId, title, quantity });
    });
});