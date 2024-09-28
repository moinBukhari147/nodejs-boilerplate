// UNCOMMENT THIS IF YOU WANT TO USE OAUTH


// import express from "express";
// const router = express.Router();


// // ====================================================================
// //                           Web Based OAuth
// // ====================================================================
// // LIBRARIES IMPORTS
// import passport from "passport";

// // CODE IMPORTS
// import { googleCallback, facebookCallback } from "../../controllers/auth/oAuth.controller.js";
// import "../strategies/googleStrategy.js";
// import "../strategies/facebookStategy.js";



// // GOOGLE 
// router.get("/web/google", passport.authenticate("google", { scope: ["profile", "email", 'https://www.googleapis.com/auth/userinfo.profile'], session: false }));
// router.get("/google/redirect", passport.authenticate("google", { session: false }), googleCallback);

// // FACEBOOK
// router.get("/web/fb", passport.authenticate("facebook", { session: false }));
// router.get("/fb/redirect", passport.authenticate("facebook", { session: false }), facebookCallback);


// // ==========================================================
// //                        Mobile Based OAuth
// // ==========================================================
// // CODE IMPORTS
// import { googleLogin, fbLogin } from "../../controllers/auth/oAuth.controller.js";

// // GOOGLE 
// router.post("/mobile/google", googleLogin);
// // FACEBOOK
// router.post("/mobile/fb", fbLogin);


// export default router;