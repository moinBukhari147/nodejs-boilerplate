import jwt from "jsonwebtoken";
import { UnauthorizedError, forbiddenError } from "../utils/responses.js";
import { jwtSecret } from "../config/initialConfig.js";

// Middleware to validate JWT tokens
export default function verifyToken(req, res, next) {
  try {
    // Extract the token from the Authorization header
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return UnauthorizedError(res, 'No token, authorization denied');
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.token !== 'access') return UnauthorizedError(res, "Invalid token");
    req.userUid = decoded.userUid;
    next();
  } catch (error) {
    return UnauthorizedError(res, "Invalid token");
  }
}