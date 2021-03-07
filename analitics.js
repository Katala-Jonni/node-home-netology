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

const analitics = {};

rl.on('line', async () => {
    try {
        const file = await fs.readFile(pathFile, 'utf-8');
        const results = JSON.parse(file);
        analitics.count = results.length;
        const wins = results.filter(el => el);
        analitics.wins = wins.length;
        analitics.losts = analitics.count - analitics.wins;
        const ratio = analitics.losts !== 0
            ? wins.length / analitics.losts
            : 100;
        analitics.ratio = ratio === 1
            ? '0.5'
            : ratio.toFixed(2);
        rl.emit('close', 0);
    } catch (e) {
        rl.emit('close', 1);
    }

});
const getResultMessage = () => {
    return `
    1. Общее количество партий - ${analitics.count}
    2. Количество выигранных / проигранных партий - ${analitics.wins} / ${analitics.losts}
    3. Процентное соотношение выигранных партий - ${analitics.ratio}
    `;
};

rl.on('close', (code) => {
    if (code > 0) {
        console.log('Файл поврежден или не найден');
        return process.exit(0);
    }
    console.log('Анатализатор файла закончил работу');
    console.log(`Результат: ${getResultMessage()}`);
    return process.exit(0);
});
rl.emit('line');
