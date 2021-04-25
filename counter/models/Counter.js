const uidGenerator = require('node-unique-id-generator');

class Counter {
    constructor(
        {
            id = uidGenerator.generateGUID(),
            counter = 0
        }
    ) {
        this.id = id;
        this.counter = counter;
    }
}

module.exports = Counter;
