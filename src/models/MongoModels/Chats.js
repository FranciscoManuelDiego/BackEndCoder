const mongoose = require("mongoose")

const messageSchema =  new mongoose.Schema({
    user: {type: String, index:true, required: true},
    email: {type: String, index:true,  required: true},
    message: {type: String , required:true}
},
    {timestamps: true} // This signals the date in which the item is created
)


module.exports = mongoose.model("Chats", messageSchema, "Chats")