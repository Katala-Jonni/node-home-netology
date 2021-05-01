const { Router } = require('express');
const router = Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
    const user = await User.find().select('-__v');
    res.render('user', {
        title: 'Личный кабинет',
        user: user[0]
    });
});

module.exports = router;
