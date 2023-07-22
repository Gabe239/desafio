import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import userService from './dao/models/userModel.js';

const initializePassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.b92d37f0d4dc61ba',
        clientSecret: 'b39b9dcb7bf337f92f312fe072fa7025f9c92f0e',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        scope: 'user: email',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log({ profile })
            let user = await userService.findOne({ email: profile._json.email });
            if (user) return done(null, user);
            const newUser = {
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                age: 18,
                password: '',
            }
            user = await userService.create(newUser);
            return done(null, user);
        } catch (error) {
            return done({ message: 'Error creating user' });
        }
    }));
    passport.use('local',
        new LocalStrategy(async (email, password, done) => {
            try {
                const user = await userService.findOne({ email: email }); // Change userModel to userService
                if (!user) return done(null, false, { message: 'Incorrect username' });

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) return done(null, false, { message: 'Incorrect password' });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await userService.findOne({ _id });
            return done(null, user);
        } catch {
            return done({ message: "Error deserializing user" });
        }
    });
};

export default initializePassport;