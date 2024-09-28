import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/initialConfig.js";

// Function to generate access token
const generateAccessToken = (user) => {
    return jwt.sign({ userUid: user.uuid, token: 'access' }, jwtSecret, {
        expiresIn: "30d",
    });
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ userUid: user.uuid, token: 'refresh' }, jwtSecret, {
        expiresIn: "120d",
    });
};

const verifyRefreshToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, jwtSecret);
        if (decoded.token === 'refresh') return { invalid: false, userUid: decoded.userUid };
        else return { invalid: true };
    } catch (error) {
        return { invalid: true };
    }
}

export { generateAccessToken, generateRefreshToken, verifyRefreshToken };
