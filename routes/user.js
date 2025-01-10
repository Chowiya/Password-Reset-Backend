import express from 'express';
import bcrypt from 'bcrypt';

import {User} from '../models/User.js';
import  jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/signup', async (req,res)=>{
    const {username,email, password} = req.body;
    
    
    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({message: 'User already exists'})
    }
    
    const hashpassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        password:hashpassword,
    })
    await newUser.save()
    res.status(201).json({status:true,message: 'Account created successfully!'})
    
})


// login


router.post('/login',async (req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message: 'User does not exist'})
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
        return res.status(400).json({message: 'Invalid password'})
    }
    const token = jwt.sign({username: user.username}, process.env.KEY,{expiresIn:'1h'})
    res.cookie('token', token, {
        httpOnly:true,
        secure:true,
        sameSite:'none',
         maxAge:360000})
    res.status(200).json({status:true, message: 'Logged in successfully'})
})



// forgot password


router.post('/forgot-password',async (req, res)=>{
    const {email} = req.body;
    try{

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'User does not exist'})
        }
        const token = jwt.sign({id: user._id}, process.env.KEY, {expiresIn:'1h'})


        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'chowiya6@gmail.com',
              pass: 'yhwjyihupmjinzzm'
            }
          });
          
          var mailOptions = {
            from: 'chowiya6@gmail',
            to: email,
            subject: 'reset password',
            text: `http://https://jimjam.netlify.app/resetPassword/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              return res.status(400).json({status:false, message: 'error sending email'})
            } else {
              return res.status(200).json({status:true, message: 'Email sent successfully'})
            }
          });

    }catch(error){
        console.log(error)
        res.status(500).json({status:false, message: 'Something went wrong'})
    }
})


// reset password

router.post('/reset-password/:token',async(req,res)=>{
    const token = req.params.token;
    const {password} = req.body;
    try{
        const decoded = jwt.verify(token, process.env.KEY)
        const id = decoded.id;
        const hashpassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({_id:id}, {password:hashpassword})
        return res.status(200).json({status:true, message: 'Password updated successfully'})
    }catch(error){
        console.log(error)
        if(error instanceof jwt.TokenExpiredError){
            return res.status(400).json({status:false, message: 'Token expired or invaild token'})
        }
        res.status(500).json({status:false, message: 'server error'})
    }
})


// logout

router.get('/logout', (req, res)=>{
    res.clearCookie('token')
    return res.json({status:true})
})

export {router as UserRouter}