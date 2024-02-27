const socket = io();

// Handle outgoing chat message
document.getElementById("chatForm").addEventListener("submit", e => {
    e.preventDefault()
    const messageInput = document.getElementById("messageInput")
    const message = messageInput.value
    socket.emit("chatmessage", message)
    messageInput.value = ""
})

// Handle incoming chat message
socket.on("message", msg => {
    const messageList = document.getElementById("messageList")
    const newMessage = document.createElement("li")
    newMessage.textContent = msg
    messageList.appendChild(newMessage)
})

socket.on('previousMessages', messages => {
    const messageList = document.getElementById('messageList')
    messages.forEach(msg => {
    const newMessage = document.createElement('li')
    newMessage.textContent = msg.message // Adjust based on your message structure
    messageList.appendChild(newMessage)
    })
})