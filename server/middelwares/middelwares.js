const jwt = require('jsonwebtoken')
const { jwt_secret } = require('../config/config');
const User = require('../modules/User');

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, jwt_secret, (err, decodedToken) => {
            if (err) {
                res.status(200).json({ 'path': '/login' })
            } if (decodedToken) {
                res.status(200).json({ 'path': '/smoothies' })
            }
        })
        next();
    } else {
        res.status(200).json({ 'path': '/login' })
        next();
    }
}

const checkCurrentUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, jwt_secret, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            }
            if (decodedToken) {
                try {
                    const user = await User.findById(decodedToken.id)
                    res.locals.user = user;
                } catch (err) {
                    console.log(err);
                }
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkCurrentUser }