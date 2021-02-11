const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/login', {
            errorMessage: 'Please enter both username and password'
        });
        return;
    };

    User.findOne({ username: username }).then((user) => {
        if (!user) {
            res.render('auth/login', {
                errorMessage: 'Invalid Login'
            });
            return;
        };

        if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/');
        } else {
            res.render('auth/login', {
                errorMessage: 'Invalid Login'
            });
        };
    });
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (username === '' || password === '') {
        res.render('auth/signup', { errorMessage: 'Indicate username and password' });
        return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (passwordRegex.test(password) === false) {
        res.render('auth/signup',
            { errorMessage: 'Weak password' });
        return;
    }

    User.findOne({ username: username })
        .then((user) => {
            if (user) {
                res.render('auth/signup', { errorMessage: 'User already exist' });
                return;
            }
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashPassword = bcrypt.hashSync(password, salt);
            User.create({
                username,
                password: hashPassword
            }).then(() => {
                res.redirect('/');
            }).catch((error) => {
                if (error.code === 11000) {
                    res.render('auth/signup', {
                        errorMessage: 'Username and email should be unique'
                    })
                }
            });
        });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;