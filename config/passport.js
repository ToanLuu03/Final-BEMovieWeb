const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Tìm user qua Google ID
                const existingUser = await User.findOne({ googleId: profile.id });
                if (existingUser) return done(null, existingUser);

                // Tạo user mới nếu chưa tồn tại
                const newUser = await User.create({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    role: 'user',
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize & Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
