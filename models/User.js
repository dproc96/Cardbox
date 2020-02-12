/* eslint-disable no-useless-escape */
const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const emailValidator = function(value) {
    return value.match(/[\w-\.]+@\w+\.\w+/);
}

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [emailValidator, "email field must be an email"]
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: "Category"
    }],
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
})

UserSchema.plugin(uniqueValidator);

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'bestteam');
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.statics.logIn = async function(email, password) {
    const user = await this.findOne({ email: email })
    if (!user) {
        throw new Error("No user found")
    }
    const isMatch = await bcrypt.compareSync(password, user.password)
    if (isMatch) {
        const token = await user.generateAuthToken()
        return token;
    }
    else {
        throw new Error("Password does not match")
    }
}

//Hash the plain text password
UserSchema.pre('save', async function (next) {
    const user = this;
    //this is where we re hashing the password
    if (user.isModified('password')) {
        const password = user.password
        user.password = await bcrypt.hash(password, 8)
    }
    next()
})

const User = mongoose.model("User", UserSchema);

module.exports = User;