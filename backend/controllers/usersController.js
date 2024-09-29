const { scryptSync, randomBytes } = require("crypto")
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')

const User = require("../models/userModel.js");

const salt = randomBytes(16).toString("hex")

/**
 * 
 * @param {string} password 
 * @param {string} salt 
 * @returns encrypted password with the given salt. 
 */
const encryptPassword = (password, salt) => {
    return scryptSync(password, salt, 32).toString('hex');
}

/**
 * 
 * @param {string} password 
 * @returns encrypted password with salt appended.
 */
const hashPassword = (password) => {
    const salt = randomBytes(16).toString('hex');
    return encryptPassword(password, salt) + salt;
}

/**
 * Match password against the stored hash
 */
const matchPassword = (password, hash) => {
    const salt = hash.slice(64);
    const originalPassHash = hash.slice(0, 64);
    const currentPassHash = encryptPassword(password, salt);
    return originalPassHash === currentPassHash;
};

/**
 * 
 * @param {string} username 
 * @returns signed jwt expires in 1800s 
 */
const generateAccessToken = (email) => {
    return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

/**
 * 
 * Sends back json with json web token attached with successful login.
 */
exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let user = await User.findOne({ email: email });

    if (!user) {
        return res.status(400).json({ message: "User not found." })
    }

    const doMatch = matchPassword(password, user.password)

    if (doMatch) {
        const token = generateAccessToken({ email: email });
        res.json({token: token});
    } else {
        res.status(400).json({ message: "Something went wrong." })
    }
}

exports.postSignup = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = hashPassword(password);

        let newUser = new User({
            email: email,
            password: hashedPassword
        });

        await newUser.save();
        res.json({ message: "User saved" })
    } catch (err) {
        console.log(err);
    }
};