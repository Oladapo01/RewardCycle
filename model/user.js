const mongoose = require("mongoose");
const { Schema } = mongoose
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    email: {type: String, required: [true, 'Email is required'], unique: true},
    password: {type: String, required: [true, 'Password is required']},
},
{timestamp: true}
);
userSchema.pre('save', async function(next){
    console.log(this.password);

    try{
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next();
    }catch(error){
        next(error);
    }
});


module.exports = mongoose.model("user", userSchema);
