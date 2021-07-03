const { Router } = require('express');
const router = Router();
const { Counter } = require('../models/index');

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const counter = await Counter.findOne({ counterId: id });
    return res.json({
        title: 'Счетчик',
        counter: counter || 0
    });
});

router.post('/:id/incr', async (req, res) => {
    const { id } = req.params;
    const target = await Counter.findOne({ counterId: id });
    if (!target) {
        const newCounter = new Counter({
            counter: 1,
            counterId: id
        });
        await newCounter.save();
    } else {
        target.counter += 1;
        await Counter.findByIdAndUpdate(target._id, target);
    }
    res
        .status(200)
        .json({
            title: 'Счетчик',
            status: 'ok'
        });
});

module.exports = router;
