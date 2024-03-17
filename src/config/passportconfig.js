const passport = require("passport");
const local = require("passport-local");

//Taking userModel and bcrypt
const UserModel = require("./../models/MongoModels/Users.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

const LocalStrategy = local.Strategy; 

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        //Getting the requested object
        usernameField: "email"
    }, async (req, email, done) => {
        console.log(req.body)
        const {full_name, password } = req.body;

        try {
            //Verificamos si ya existe un registro con ese mail
            let user = await UserModel.findOne({email:email});
            if(user) return done(null, false);
            //Si no existe, voy a crear un registro nuevo: 
            let newUser = {
                full_name,
                email,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            //Si todo resulta bien, podemos mandar done con el usuario generado. 
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    //Agregamos otra estrategia, ahora para el "login":
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            //Primero verifico si existe un usuario con ese email:
            const user = await UserModel.findOne({email});
            if(!user) {
                console.log("This user does not exist");
                return done(null, false);
            }
            //Si existe, verifico la contraseña: 
            if(!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id:id});
        done(null, user);
    })

}

module.exports = initializePassport;