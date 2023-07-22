import { Router } from 'express';
import userModel from '../dao/models/userModel.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) return res.status(400).send({ status: "error", error: "User already exists" });

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword
    };
    await userModel.create(user);
    console.log(user);
    res.send({ status: "success", message: "User registered" });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // check if user exists
    const user = await userModel.findOne({ email });

    console.log(user);
    if (!user) return res.status(400).send({ status: "error", error: "User does not exists" });

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).send({ status: "error", error: "Incorrect password" });
      }

    // const user = await userModel.findOne({ email, password }); //Ya que el password no está hasheado, podemos buscarlo directamente
    // if (!user) return res.status(400).send({ status: "error", error: "Incorrect credentials" });

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    if (user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123') {
        user.role = 'admin';
    } else {
        user.role = 'usuario';
    }

    // Store the user data in the session
    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
      };

    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" });
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});


export default router;