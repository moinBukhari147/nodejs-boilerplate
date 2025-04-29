const jwtAccessExpiration = "30d";
const jwtRefreshExpiration = "30d";
const jwtSecret = process.env.JWT_SECRET_KEY;
const jwtAlgorithm = ["HS256"];


const jwtConfig = {
    jwtAccessExpiration,
    jwtRefreshExpiration,
    jwtSecret,
    jwtAlgorithm,
};

export default jwtConfig;