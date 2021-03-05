const fs = require('fs/promises');
const path = require('path');
const readline = require('readline');
const yargs = require('yargs/yargs');

const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const pathFile = path.join(__dirname, argv._[0]);

const rl = readline.createInterface({
    input: process.stdin
});

const results = [];

const getNumber = () => Math.floor(Math.random() * 100) > 50 ? 2 : 1;
const getMessage = bool => bool ? 'Вы угадали число' : 'Вы не угадали число';

rl.on('line', async data => {
    if (!data) {
        console.log('Чтобы выйти из игры необходимо нажать CTRL + C');
        return console.log('Угадайте число 1 или 2?');
    }
    const dataNumber = +data;
    if (!Number.isFinite(dataNumber)) {
        return console.log('Введите число 1 или 2');
    }
    if (dataNumber > 0 && dataNumber <= 2) {
        const secretNumber = getNumber();
        const isEqual = secretNumber === dataNumber;
        results.push(isEqual);
        console.log(getMessage(isEqual));
        await fs.writeFile(pathFile, JSON.stringify(results));
        return isEqual && rl.close();
        // const file = await fs.readFile(pathFile, 'utf-8');
        // console.log(JSON.parse(file));
        // return console.log('Чтобы выйти из игры необходимо нажать CTRL + C');
    } else {
        return console.log('Число должно быть 1 или 2');
    }
});

rl.on('close', () => {
    return console.log('Игра закончена!');
});

rl.emit('line');
