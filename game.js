const rl = require('readline');
const input = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

const random = Math.floor(Math.random() * 100);
input.on('line', (num) => {
    if (!num || !Number(num)) {
        console.log('Введите число от 1 до 100');
        return;
    }
    console.log(random, 'random');
    if (num < random) {
        console.log('Больше');
    } else if (num > random) {
        console.log('Меньше');
    } else {
        console.log(`Вы угадали, это число ${num}`);
        process.exit(0);
    }
});

input.emit('line');
