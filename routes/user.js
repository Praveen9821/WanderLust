import express from 'express';
const router = express.Router();
import User from '../models/user.js';
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import { savedRedirectUrl } from '../middleware.js';
import userController from "../controllers/users.js";

router
    .route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
    savedRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login", 
        failureFlash: true,
    }), 
    userController.login
);

// router.get("/signup", userController.renderSignup);

// router.post("/signup", wrapAsync(userController.signUp));

// router.get("/login", userController.renderLoginForm);

// router.post(
//     "/login",
//     savedRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: "/login", 
//         failureFlash: true,
//     }), 
//     userController.login
// );

router.get("/logout", userController.logout);

export default router;