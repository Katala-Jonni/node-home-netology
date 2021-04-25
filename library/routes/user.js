const { Router } = require('express');
const db = require('../store/index');
const router = Router();

router.get('/', (req, res) => {
    const user = db.get('users').value();
    res.render('user', {
        title: 'Личный кабинет',
        user: user[0]
    });
});

module.exports = router;
