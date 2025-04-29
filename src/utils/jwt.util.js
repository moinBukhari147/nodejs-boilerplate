import { createSigner } from "fast-jwt";
import jwtConfig from "../config/jwt.config.js";

const { jwtSecret, jwtAccessExpiration, jwtRefreshExpiration, jwtAlgorithm } = jwtConfig;
const signer = createSigner({ key: jwtSecret, algorithms: jwtAlgorithm });


// Function to generate access token
const generateAccessToken = (user) => {
    return signer({ userUid: user.uuid, token: 'access' }, { expiresIn: jwtAccessExpiration });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
    return signer({ userUid: user.uuid, token: 'refresh' }, { expiresIn: jwtRefreshExpiration });
};


export { generateAccessToken, generateRefreshToken };
