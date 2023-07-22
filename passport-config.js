import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import userModel from './dao/models/userModel.js';
import bcrypt from 'bcrypt';
const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.b92d37f0d4dc61ba',
        clientSecret: 'b39b9dcb7bf337f92f312fe072fa7025f9c92f0e',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        scope: 'user: email',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log({ profile })
            let user = await userModel.findOne({ email: profile._json.email });
            if (user) return done(null, user);
            const newUser = {
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                age: 18,
                password: '',
            }
            user = await userModel.create(newUser);
            return done(null, user);
        } catch (error) {
            return done({ message: 'Error creating user' });
        }
    }));
    passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            // check if user exists
            const user = await userModel.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'User does not exist' });
            }

            // check if password is correct
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user); // Authentication successful, pass the user object to the next middleware
        } catch (error) {
            return done(error);
        }
    }));

    // Serialize and deserialize user objects
    passport.serializeUser((user, done) => {
        done(null, user.id); // Serialize user by ID, you can use any unique identifier
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

};

export default initializePassport;