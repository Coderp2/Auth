const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        // passReqToCallback:true
    },
    async function(email, password, done){
        // find a user and establish the identity
        try{
            let user = await User.findOne({email: email})
              console.log(user)
                    if (!user || user.password != password){
                        console.log('Invalid Username/Password');
                        return done(null, false);
                    }
                    return done(null, user);
        }
        catch(err){
            req.flash("error",err)

        }
         
     })
)
    

// serializing the user to decide which key is to be kept in the cookies
//tells user's which info is set in cookie
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
//user info now set in cookie if when user authenticated checks in DB 
passport.deserializeUser(async function(id, done){
   let user= await User.findById(id)
// console.log("Hey! Deserializes user is called")
        return done(null, user);
    });
    



// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
        //passport-local is the strategy you would use if you are authenticating 
        //against a username and password stored 'locally' i.e. in the database of your app
    }

    next();
}

module.exports = passport;