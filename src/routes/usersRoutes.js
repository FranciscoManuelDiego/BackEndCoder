const express = require('express');
const router = express.Router();
const User = require("../models/MongoModels/Users.js")
const passport = require("passport");

// Get users in DB
router.get("/" , async (req,  res ) => {
    try{
        const users = await User.find()
        res.status(201).json(users)
    }catch(err){
        console.error(`Error while getting users: ${err}`)
        res.status(500).send("Internal server Error")
    }
})

// Post users in DB
router.post("/", async (req,res)=> {
    const newUser = req.body;
    try{
        const users = await User.create(newUser)
        res.status(201).json(users)
    }catch(err){
        console.error(`Error while trying to post a new user: ${newUser}`, err)
        res.status(500).send("Internal Server Error");
    }
})

// Put user in a DB
router.put("/:pid" , async(req, res) => {
    const userId = req.params.pid
    const updatedUser = req.body
    // Check and set the id.
    try{
        const users = await User.updateOne({ _id: userId }, { $set: updatedUser })
        res.status(200).json({message: `User with id: ${userId} updated sucessfully` , users})
    }catch(err){
        console.error(`Error while trying to update a user: ${userId}`, err)
        res.status(500).send("Internal Server Error");
    }
})

// Delete user in a DB
router.delete("/:pid" , async(req, res) => {
    const userId = req.params.pid
    try{
        const users = await User.deleteOne({ _id: userId })
        if (users.deletedCount === 1) {
            // Check if a user was deleted (deletedCount should be 1)
            res.status(200).json({ message: 'User deleted successfully', users });
        } else {
            // If deletedCount is not 1, it means the user was not found
            res.status(404).json({ message: 'User not found' });
        }
    }catch(err){
        console.error(`Error while trying to delete a user: ${userId}`, err)
        res.status(500).send("Internal Server Error");
    }
})

// Creating the user with Passport
router.post("/", passport.authenticate("register", {failureRedirect: "/failedregister"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status:"error"});

    req.session.user = {
        full_name: req.user.full_name,
        age: req.user.age,
        email:req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
    res.send({error: "Failed register :("});
})

module.exports = router; 