const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;

async function verify(username, password, done) {
    try {
        const user = await User.findOne({ username }).select('-__v');
        if (!user) {
            return done(null, null);
        }
        if (user.password !== password) {
            return done(null, null);
        }
        return done(null, user);
    } catch (e) {
        return done(e);
    }
};

const options = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false
};

const vkOptions = {
    clientID: process.env.VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: process.env.VKONTAKTE_APP_SECRET,
    callbackURL: `http://katala-jonni.local/user/auth/vkontakte/callback`
};

const VkontakteStrategy = new VKontakteStrategy(
    vkOptions,
    async function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
        const findUser = await User.findOne({ vkId: profile.id });
        if (!findUser) {
            const newUser = new User({
                username: profile.username,
                vkId: profile.id,
                email: null,
                password: profile.id
            });
            const user = await newUser.save();
            return done(null, user);
        }
        return done(null, findUser);
    }
);

const LStrategy = new LocalStrategy(options, verify);

module.exports = {
    VkontakteStrategy,
    LStrategy
};
