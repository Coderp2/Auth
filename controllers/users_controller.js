const User = require('../models/user');
const randomString = require('randomstring')  
const bcrypt = require('bcrypt')  
const config = require('../config/config')
const nodemailer = require('nodemailer')

module.exports.profile = function(req, res) 
{
   let user =  User.findById(req.params.id, function(err, user) {
        return res.render('user_profile', {title: 'User Profile', profile_user: user});  
    });
}

module.exports.update = function(req,res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');
        })
    }
    else{
        return res.status(401),send('Unauthorized');
    }
}

///render the sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title:"Sign Up"
    })
}
//controller will fetch the views and 
//send it to the browser

//render the sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title:"Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success','You have logged out!')
    return res.redirect('/');
}

//forget password

module.exports.forgetLoad = async(req,res)=>{
    try{
       return res.render('forget');
    }
    catch(error){
         console.log('error at forgetLoad!',error);
    }
}

module.exports.sendVerifyMail = async(email,user_id)=>{
    try{
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        })
        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'For verification',
            html:'<h1>Received!</h1>'
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email sent!",info.response)
            }
        })
    }
    catch(error){
        console.log(error.message)
    }
    }
    //reset password
    let sendResetPasswordMail = async(email,token)=>{
        try{
            const transporter = nodemailer.createTransport({
                host:'smtp.gmail.com',
                port:587,
                secure:false,
                requireTLS:true,
                auth:{
                    user:config.emailUser,
                    pass:config.emailPassword
                }
            })
            const mailOptions = {
                from:config.emailUser,
                to:email,
                subject:'For reset password',
                html:'<h1>Please click here to <a href ="http://localhost:8000/users/forget-password?token='+token+'">Reset password</a></h1>'
            }
            transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error);
                }
                else{
                    console.log("Email sent!",info.response)
                    return 
                }
            })
        }
        catch(error){
            console.log(error.message)
        }
    }

module.exports.forgetVerify = async(req,res)=>{
    try{
       
        const email = req.body.email;
        console.log(req.body.email)
        const user  = await User.findOne({email:email});
        if(user){
              const random = randomString.generate(); 
              const updated = await User.updateOne({email:email},{$set:{token:random}})
              sendResetPasswordMail(user.email,random)
              req.flash('success',"A reset password link has been sent on your mail!") 
              return res.redirect('/users/sign-in')
              
        }
        else{
            req.flash('error',"Incorrect email, please try again!")
            res.redirect('/');
            
        }
    }
    catch(error){
         console.log(error.message);
    }
}
module.exports.forgetPasswordLoad = async(req,res)=>{
    
try{
    const token = req.query.token;
    const tokenData = await User.findOne({token:token})
    if(tokenData){
        res.render('forget-password',{user_id:tokenData._id})
      

    }
    else{
        res.render('404',{message:'Invalid token'})
    }

}catch(error){
    console.log(error.message);
}

}
//to get password in hex form
let securePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports.resetPassword = async(req,res)=>{
    
    try{
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_password = await securePassword(password);
        

        const updatedPassword = await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}});
        req.flash('success','Your password has been reset successfully!')
        
        return res.redirect('/'); 
    }
    catch(error){
        console.log(error.message);
    }
}