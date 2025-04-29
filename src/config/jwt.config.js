import { createVerifier, createSigner } from "fast-jwt";


const jwtSecret = process.env.JWT_SECRET_KEY;
const jwtAlgorithm = ["HS256"];


export const jwtAccessExpiration = "30d";
export const jwtRefreshExpiration = "30d";

export const jwtVerifier = createVerifier({ key: jwtSecret, algorithms: jwtAlgorithm });
export const jwtSigner = createSigner({ key: jwtSecret, algorithms: jwtAlgorithm });

