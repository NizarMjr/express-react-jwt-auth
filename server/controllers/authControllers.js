const { jwt_secret } = require("../config/config");
const User = require("../modules/User");
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
    const errors = { email: '', password: '' }
    if (err.code === 11000) {
        errors.email = 'email is already exist';
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
        return errors;
    }
    if (err.message === 'invalid email') {
        errors.email = err.message
    }
    if (err.message === 'password incorrect') {
        errors.password = err.message
    }
    return errors;
}
const createToken = (id) => {
    const token = jwt.sign({ id }, jwt_secret, {
        expiresIn: maxAge,
    })
    return token;
}
module.exports.get_logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(200).json('logout')
}
module.exports.get_login = (req, res) => {

    res.status(200).json('Login')
}

module.exports.post_login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password)
        if (user) {
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * maxAge })
            res.redirect('/')
        }
    } catch (err) {
        const error = handleErrors(err);
        res.status(400).json({ error })
    }
}
module.exports.get_signup = (req, res) => {
    res.status(201).send('signup')
}

const maxAge = 3 * 24 * 60 * 60;

module.exports.post_signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password })
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * maxAge })
        res.status(201).json({ user: user._id })

    } catch (err) {
        const error = handleErrors(err)
        res.status(400).json({ error })
    }
}
