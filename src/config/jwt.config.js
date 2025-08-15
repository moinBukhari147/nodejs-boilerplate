import { createVerifier, createSigner } from "fast-jwt";


const jwtSecret = process.env.JWT_SECRET_KEY;
const jwtAlgorithm = ["HS256"];


export const jwtAccessExpiration = '1d';
export const jwtRefreshExpiration = "30d";

export const jwtVerifier = createVerifier({ key: jwtSecret, algorithms: jwtAlgorithm });
export const jwtAccSigner = createSigner({ key: jwtSecret, algorithms: jwtAlgorithm, expiresIn: jwtAccessExpiration });
export const jwtRefrSigner = createSigner({ key: jwtSecret, algorithms: jwtAlgorithm, expiresIn: jwtRefreshExpiration });

