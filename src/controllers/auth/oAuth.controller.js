// UNCOMMENT THE CODE BELOW TO ENABLE OAUTH


// import { successOkWithData, frontError, catchError } from "../../utils/responses.js";
// import { User } from "../../models/user/user.model.js";
// import { generateAccessToken, generateRefreshToken } from "../../utils/jwtTokenGenerator.js"


// // ====================================================================
// //                           Web Based OAuth
// // ====================================================================


// // ========================= googleCallback ===========================
// export async function googleCallback(req, res) {
//     try {
//         console.log("========= google callback user: ", req.user);
//         const { email, family_name, given_name } = req.user;
//         // UPDATE THIS LOGIC ACCORDING TO THE DATABASE AND NEEDS
//         // let user = await User.findOne({ where: { email: email } });
//         // if (!user) {
//         //     user = await User.create({
//         //         first_name: given_name,
//         //         last_name: family_name,
//         //         email: email,
//         //         password: "AB#123897",     //This has is not generatable
//         //     });

//         // }
//         // const accessToken = generateAccessToken(user);
//         // const refreshToken = generateRefreshToken(user);
//         // return successOkWithData(res, "Login successful", { accessToken, refreshToken });
//         return successOkWithData(res, "Oauth google successfull", req.user);

//     } catch (error) {
//         return catchError(res, error);
//     }
// }

// // ========================= facebookCallback ===========================

// export async function facebookCallback(req, res) {
//     try {
//         const { id, name } = req.user;
//         console.log("========= facebook callback user: ", req.user);

//         // UPDATE THIS LOGIC ACCORDING TO THE DATABASE AND NEEDS
//         // const email = `${id}@facebook.com`;
//         // let user = await User.findOne({ where: { email: email } });
//         // if (!user) {
//         //     user = await User.create({
//         //         first_name: name.split(" ")[0] || "no name",
//         //         last_name: name.split(" ")[1] || null,
//         //         email: email,
//         //         password: "AB#123897",
//         //     });
//         // }
//         // const accessToken = generateAccessToken(user);
//         // const refreshToken = generateRefreshToken(user);
//         // return successOkWithData(res, "Login successful", { accessToken, refreshToken });
//         return successOkWithData(res, "Oauth facebook successfull", req.user);
//     } catch (error) {
//         return catchError(res, error);
//     }
// }

// // ====================================================================
// //                           Mobile Based OAuth
// // ====================================================================
// // LIBRARIES IMPORTS
// import { OAuth2Client } from "google-auth-library";
// import axios from "axios";

// // CODE IMPORTS
// import { googleClientId } from "../../config/initialConfig.js";



// // ========================= googleLogin ===========================
// const googleClient = new OAuth2Client(googleClientId);
// export async function googleLogin(req, res) {
//     try {
//         const { googleToken, fcmToken } = req.body;
//         if (!googleToken) {
//             return frontError(res, "googleToken obtained from google is required", "googleToken");
//         }
//         const ticket = await googleClient.verifyIdToken({
//             idToken: googleToken,
//             audience: googleClientId
//         });
//         const payload = ticket.getPayload();
//         console.log("========= google payload: ", payload);
//         // UPDATE THIS LOGIC ACCORDING TO THE DATABASE AND NEEDS
//         // const { email, family_name, given_name } = payload;
//         // let user = await User.findOne({ where: { email: email } });
//         // if (!user) {
//         //     user = await User.create({
//         //         first_name: given_name,
//         //         last_name: family_name,
//         //         email: email,
//         //         password: "AB#123897",

//         //     });

//         // }
//         // const accessToken = generateAccessToken(user);
//         // const refreshToken = generateRefreshToken(user);
//         // return successOkWithData(res, "Login successful", { accessToken, refreshToken });
//         return successOkWithData(res, "Oauth google successfull", payload);

//     } catch (error) {
//         if (error.message && error.message.split(":")[0] === "Invalid token signature") return frontError(res, "Invalid Google token", "googleToken");
//         if (error.message && error.message.split(",")[0] === "Token used too late") return frontError(res, "Token expired", "googleToken");
//         if (error.message && error.message.split(":")[0] === "Wrong number of segments in token") return frontError(res, "Token expired", "googleToken");
//         return catchError(res, error);
//     }
// }


// // =========================== fbLogin ===============================
// export async function fbLogin(req, res) {
//     try {
//         const { fbToken, fcmToken } = req.body;
//         if (!fbToken) {
//             return frontError(res, "Token obtained from Facebook is required", "fbToken");
//         }

//         // Fetch user data from Facebook Graph API
//         const response = await axios.get(
//             `https://graph.facebook.com/me?fields=id,name&access_token=${fbToken}`
//         );
//         const { id, name } = response.data;

//         // UPDATE THIS LOGIC ACCORDING TO THE DATABASE AND NEEDS
//         // const email = `${id}@facebook.com`;
//         // // Check if the user exists in your database
//         // let user = await User.findOne({ where: { email } });
//         // if (!user) {
//         //     user = await User.create({
//         //         first_name: name || "no name",
//         //         last_name: null,
//         //         email: email,
//         //         password: "AB23#123897",
//         //     });
//         // }

//         // // Generate access and refresh tokens
//         // const accessToken = generateAccessToken(user);
//         // const refreshToken = generateRefreshToken(user);
//         // return successOkWithData(res, "Login successful", { accessToken, refreshToken });
//         return successOkWithData(res, "Oauth facebook successfull", response.data);
//     } catch (error) {
//         if (error.response?.status === 400) return frontError(res, "Invalid Facebook token", "fbToken");
//         return catchError(res, error);
//     }
// }