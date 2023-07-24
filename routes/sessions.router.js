import { Router } from 'express';
import passport from 'passport';
const router = Router();

router.post('/register', (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      return res.status(500).send({ status: 'error', error: 'An error occurred' });
    }
    if (!user) {
      return res.status(400).send({ status: 'error', error: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      res.send({ status: 'success', message: 'User registered' });
    });
  })(req, res, next);
});

router.post('/login', passport.authenticate('local-login'), (req, res) => {
    // The user has been authenticated by Passport, so the user data is available in req.user
    // You can directly access the user data and respond with the appropriate data
    const user = req.user;
  
    // Set the user role based on email (You can update this logic based on your requirements)
    if (user.email === 'adminCoder@coder.com') {
      user.role = 'admin';
    } else {
      user.role = 'usuario';
    }

    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
      };
    // Respond with the user data
    res.send({ status: "success", payload: user, message: "¡Primer logueo realizado! :)" });
  });

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