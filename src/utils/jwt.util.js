import { jwtSigner, jwtAccessExpiration, jwtRefreshExpiration } from "../config/jwt.config.js";


// Function to generate access token
const generateAccessToken = (user) => {
    return jwtSigner({ userUid: user.uuid, token: 'access' }, { expiresIn: jwtAccessExpiration });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
    return jwtSigner({ userUid: user.uuid, token: 'refresh' }, { expiresIn: jwtRefreshExpiration });
};


export { generateAccessToken, generateRefreshToken };
