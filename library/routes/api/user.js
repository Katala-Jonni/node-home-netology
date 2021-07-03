const { Router } = require('express');
const User = require('../../models/User');
const multer = require('multer');
const upload = multer();
const passport = require('passport');

const router = Router();

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

router.get('/me', function (req, res, next) {
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

router.post('/login',
    upload.none(),
    passport.authenticate(
        'local',
        {
            failureRedirect: `/user/login`
        }
    ),
    (req, res) => {
        return res.json(req.user);
    });

router.post('/signup',
    upload.none(),
    async (req, res) => {
        if (req.user) {
            return res.redirect('/user');
        }
        const { username, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.json({
                status: false,
                message: 'Пароли должны быть одинаковыми'
            });
        }
        const checkUser = await User.findOne({ username });
        if (checkUser) {
            return res.json({
                status: false,
                message: 'Такой пользватель уже есть'
            });
        }
        const user = new User({
            username,
            email,
            password
        });
        await user.save();
        return res.json({
            status: true,
            message: `Пользователь ${username} успешно зарегистрирован`
        });
    });

module.exports = router;
