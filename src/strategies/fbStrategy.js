import { Strategy as facebookStategy } from 'passport-facebook';
import passport from 'passport';
import { facebookClientId, facebookClientSecret, nodeEnv, port, domain } from '../config/initial.config.js';

// explicitly write this host line because during local development the domain contains the ip but we need the locahost.
const host = nodeEnv === "production" ? domain : `http://localhost:${port}`;


passport.use(new facebookStategy({
    clientID: facebookClientId,
    clientSecret: facebookClientSecret,
    callbackURL: `${host}/api/oauth/fb/redirect`,
    profileFields: ['id', 'name']
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile._json);
    }
));