const mongoose = require("mongoose"); 

const userSchema = new mongoose.Schema(
    {
        full_name: {
            type: String, 
            required: true
        },
        email : {
            type: String, 
            required: true,
            index: true, 
            unique: true
        }, 
        password: {
            type: String, 
            required: true
        },
    },
    {timestamps: true} // This signals the date in which the item is created
)
module.exports = mongoose.model("User", userSchema, "Users")