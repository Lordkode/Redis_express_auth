const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        enum: ["validé", "non validé", "rejeté", "en attente", "suspendu"],
        default: "en attente"
    }
});

userSchema.pre('save', async function (next){
    const user = this;

    // Hashe password if it has been modified
    if(user.isModified('password')){
        try {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;