import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // Only register GoogleStrategy if client ID and secret are present and not dummy
  if (clientID && clientSecret && clientID !== 'dummy-client-id' && clientSecret !== 'dummy-client-secret') {
    console.log('⚡ Configured real Google Passport strategy.');
    passport.use(new GoogleStrategy({
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        const name = profile.displayName || profile.username || 'Google User';
        const googleId = profile.id;

        if (!email) {
          return done(new Error('No email returned from Google'), null);
        }

        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        if (user) {
          // Associate googleId if they registered with email/password previously
          if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user for OAuth
        user = await User.create({
          name,
          email,
          googleId,
          password: '', // No password required for OAuth
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }));
  } else {
    console.log('⚠️ Google OAuth credentials missing or dummy. Google Passport strategy will use mock fallback.');
  }

  // Serializer and Deserializer
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
