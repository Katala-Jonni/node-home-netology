const { Router } = require('express');
const User = require('../../models/User');

const router = Router();

router.post('/login', async (req, res) => {
    const user = await User.find().select('-__v');
    res.status(201);
    return res.json(user[0]);
});

module.exports = router;
