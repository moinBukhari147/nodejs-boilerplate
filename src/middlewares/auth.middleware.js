import { UnauthorizedError, forbiddenError } from "../utils/response.util.js";
import User from "../models/auth/user.model.js";
import { jwtVerifier } from "../config/jwt.config.js";


// Middleware to validate JWT tokens

// =================== verifyToken ===================
export const verifyToken = async (req, res, next) => {
    try {

        const authHeader = req.header("Authorization");
        if (!authHeader) return UnauthorizedError(res, 'No token, authorization denied');

        const token = authHeader.replace("Bearer ", "");
        if (!token) return UnauthorizedError(res, 'No token, authorization denied');

        const decoded = jwtVerifier(token);
        if (decoded.token !== 'access') return UnauthorizedError(res, "Invalid token");
        req.userUid = decoded.userUid;
        next();
    } catch (error) {
        return UnauthorizedError(res, "Invalid token");
    }
}

// =================== verifyRefreshToken ===================
export const verifyRefreshToken = async (req, res, next) => {
    try {

        const authHeader = req.header("Authorization");
        if (!authHeader) return UnauthorizedError(res, 'No token, authorization denied');

        const token = authHeader.replace("Bearer ", "");
        if (!token) return UnauthorizedError(res, 'No token, authorization denied');

        const decoded = jwtVerifier(token);
        if (decoded.token !== 'refresh') return UnauthorizedError(res, "Invalid token");
        req.userUid = decoded.userUid;
        next();
    } catch (error) {
        return UnauthorizedError(res, "Invalid token");
    }
}


// =================== VerifyTokenNSetUser ======================

export const VerifyTokenNSetUser = async (req, res, next) => {
    try {
        const uuid = req.userUid;
        const user = await User.findOne({ where: { uuid } });
        if (!user) return UnauthorizedError(res, "Invalid token");
        if (!user.isActive) return forbiddenError(res, "User is not active");
        req.user = user;
        next();
    } catch (error) {
        return UnauthorizedError(res, "Invalid token");
    }
}