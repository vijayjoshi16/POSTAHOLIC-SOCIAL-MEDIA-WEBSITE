const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const mongoose=require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config/keys");
const requireLogin = require('../middleware/requireLogin');


router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!email || !password || !name){
       return res.status(422).json({err:"please add the fields"});
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({err:"user already exists with that email"});
        }
        bcrypt.hash(password,12).then((hashedPassword)=>{
            const user = new User({
                email:email,
                password:hashedPassword,
                name:name,
                pic:pic
            });
            user.save().then(user=>{
                res.json({message:"saved successfully"});
            }).catch(err=>{
                console.log(err);
            });
        });
    }).catch(err=>{
        console.log(err);
    });
});

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
       return res.status(422).json({message:"please provide all credentials"});
    }
    User.findOne({email:email}).then(savedUser=>{
        if(!savedUser){
            //console.log("Invalid email or password");
            return res.status(422).json("Invalid email or password");
        }
        bcrypt.compare(password,savedUser.password).then(doMatch=>{
            if(doMatch){
                //res.json({message:"Successfully signed in"});
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}});
            }else{
                res.status(422).json("Invalid email or password");
            }
        }).catch(err=>{
            console.log(err);
        });
    });
});

module.exports = router;