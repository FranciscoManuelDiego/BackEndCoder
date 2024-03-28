const passport = require("passport");
const local = require("passport-local");

//Taking userModel and bcrypt
const UserModel = require("./../models/MongoModels/Users.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

const LocalStrategy = local.Strategy; 

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        //Getting the requested object
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        console.log(req.body)
        const {full_name, email } = req.body;

        try {
            //Checking if the register exists with that email
            let user = await UserModel.findOne({email: email});
            if(user) return done(null, false,  { message: "Email already exists!" });
            //If it doesn't exist, create a new one
            let newUser = {
                full_name,
                email,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            //If it works, return the result
            return done(null, result);
        } catch (error) {
            console.error("Error registering user:", error);
            return done(error);
        }
    }))

    //Login side
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            //Check if the user exists with the email
            const user = await UserModel.findOne({email: email});
            if(!user) {
                console.log("This user does not exist");
                return done(null, false);
            }
            //If it exists , check the password
            if(!isValidPassword(password, user)){
            return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))

    // Serializing: Transforming an user object into a chain to store the session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id:id});
        done(null, user);
    })

}

module.exports = initializePassport;