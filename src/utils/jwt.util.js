import { jwtAccSigner, jwtRefrSigner } from "../config/jwt.config.js";


// Function to generate access token
const generateAccessToken = (user) => {
    return jwtAccSigner({ userUid: user.uuid, token: 'access' });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
    return jwtRefrSigner({ userUid: user.uuid, token: 'refresh' });
};


export { generateAccessToken, generateRefreshToken };
