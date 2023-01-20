const user = require('../model/user');
const bcrypt = require('bcrypt');
const e =require('express');





exports.login = async (req, res) => {
    //const {email, password} = req.body;
    try{
        //check if user exists
        const User = await user.findOne({email: req.body.email});   
        if(!User) return res.status(404).render('login', {
            message: 'User does not exist'
        });
        const isMatch = await bcrypt.compare(req.body.password, User.password);
        if(isMatch)  {
            req.session.user = User._id;
            res.redirect('/landingpage');
            return;
        }
        res.render('login', {_pageName: 'Login', errors: {message: 'Incorrect Password'}, message: null}); 
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

exports.register = async (req, res) => {
    try{
        //const {email, password} = req.body;
        //validate
        const User = new user({
            email: req.body.email,
            password: req.body.password

        });
        await User.save();
        res.redirect('/?message=Registration successful');
        
    }catch(error){
        console.log(error);
        if(e.error || e.errors){
            console.log("Mongoose error");
            res.render('/', {_pageName: 'Register', errors: e.error || e.errors || e.MongoError, message: null});
            return;
        } else if((e.name === 'MongoError' || e.name  ==='MongoServerError') && e.code === 11000) {
            console.log("Mongo error");
            res.render('/', {_pageName: 'Register', errors: {message: 'Email already exists'}, message: null});
            return;
        }
        res.status(500).json({message: error.message});
    }
}


exports.search = async (req, res) =>{
    try{
        const User = await user.findOne({
            email: req.body.email,
        });
        if(!User) {
            res.status(404).json({ message: "User not found" });
        }else{
            req.session.email = req.body.email;
            res.redirect(`/newpassword?email=${req.body.email}`);
;
        };
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

exports.update = async (req, res) =>{
    try {
        // Find the user by their email
        
        
        const User = await user.findOne({ email: req.session.email });
        if (!User) {
            return res.status(404).json({ message: 'User not found' });
        }
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            console.log(req.body.newPassword);
            const passwordHash = await bcrypt.hash(req.body.newPassword, salt);
            // Update the user's password in the database
            await User.updateOne({ _id: User._id }, { $set: { password: passwordHash } });
            res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}