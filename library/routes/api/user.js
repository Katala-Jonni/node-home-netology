const { Router } = require('express');

const router = Router();

router.post('/login', (req, res) => {
    res.status(201);
    res.json({ id: 1, email: 'test@mail.ru' });
});

module.exports = router;
