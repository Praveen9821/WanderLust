import User from "../models/user.js";

const renderSignup = (req,res)=>{
    res.render("users/signup.ejs");
};

const signup = async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WonderLust!");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

const renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

const login = async(req,res)=>{
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

const logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};

export default {renderSignup, signup, renderLoginForm, login, logout};