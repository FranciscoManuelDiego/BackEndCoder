//Bcrypt is a library for hashed passwords

const bcrypt = require("bcrypt");

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//hashSync: hashing salt. 

//A salt is a random string process

//genSaltSync(10): 10 characters salt, it is an irreversible process.

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);
//True or falsy by comparing elements

module.exports = {
    createHash, //creates the hash
    isValidPassword //Establishes the password validation.
}