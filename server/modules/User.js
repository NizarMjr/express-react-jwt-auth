const mongoose = require('mongoose')
const { Schema } = mongoose;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter valid email']
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        minlength: [6, 'password at least 6 character']
    }
})
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

userSchema.statics.login = async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) return user;
        throw Error('password incorrect')
    } else throw Error('invalid email')
}
const User = mongoose.model('user', userSchema)

module.exports = User;