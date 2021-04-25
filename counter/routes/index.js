const fs = require('fs');
const { Router } = require('express');
const db = require('../store/index');
const router = Router();


router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const counters = db.get('counters').value();
    const target = counters.findIndex((el) => el.id === id);
    return res.json({
        title: 'Счетчик',
        counter: counters[target].counter || 0
    });
});

router.post('/:id/incr', (req, res) => {
    const id = req.params.id;
    const counters = db.get('counters').value();
    const target = counters.findIndex((el) => el.id === id);
    if (target === -1) {
        db
            .get('counters')
            .push({
                id,
                counter: 1
            })
            .write();
    } else {
        counters[target].counter += 1;
        db
            .get('counters')
            .find({ id })
            .assign(counters[target])
            .write();
    }
    res
        .status(200)
        .json({
            title: 'Счетчик',
            status: 'ok'
        });
});

module.exports = router;
