const { Router } = require('express');
const router = Router();
const multer = require('multer');
const upload = multer();
const passport = require('passport');
const User = require('../models/User');

//start routes vkontakte стратегии
router.get('/auth/vkontakte', passport.authenticate('vkontakte'));

router.get('/auth/vkontakte/callback',
    passport.authenticate(
        'vkontakte',
        {
            failureRedirect: '/user/login'
        }),
    function (req, res) {
        res.redirect('/user');
    }
);
//end routes vkontakte стратегии

router.post('/login',
    upload.none(),
    passport.authenticate(
        'local',
        {
            failureRedirect: `/user/login`
        }
    ),
    (req, res) => {
        return res.redirect('/user');
    });

router.get('/login', function (req, res, next) {
        if (req.user) {
            return res.redirect('/user');
        }
        next();
    },
    (req, res) => {
        res.render('auth/login', {
            title: 'Логин',
            user: {}
        });
    });

router.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/user/login');
    });

router.get('/signup',
    async (req, res) => {
        if (req.user) {
            return res.redirect('/user');
        }
        res.render('auth/signup', {
            title: 'Регистрация',
            user: {}
        });
    });

router.post('/signup', upload.none(), async (req, res) => {
    if (req.user) {
        return res.redirect('/user');
    }
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.redirect('/user/signup');
    }
    const checkUser = await User.findOne({ username });
    if (checkUser) {
        return res.redirect('/user/signup');
    }
    const user = new User({
        username,
        email,
        password
    });
    await user.save();
    return res.redirect('/user/login');
});

router.get('/',
    function (req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            if (req.session) {
                req.session.returnTo = req.originalUrl || req.url;
            }
            return res.redirect('/user/login');
        }
        next();
    },
    (req, res) => {
        res.render('user', {
            title: 'Личный кабинет',
            user: req.user
        });
    });

module.exports = router;
