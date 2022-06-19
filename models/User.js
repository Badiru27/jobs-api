const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        min: 3,
        max: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        
    },
    password: {
        type: String,
        require: [true, 'Please provide password'],
        min: 6
    }

});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES})
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
   return await bcrypt.compare(candidatePassword, this.password)
}
    



module.exports = mongoose.model('User', UserSchema)