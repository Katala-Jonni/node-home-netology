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

rl.on('line', async data => {
    try {
        const file = await fs.readFile(pathFile, 'utf-8');
        const results = JSON.parse(file);
        analitics.count = results.length;
        const wins = results.filter(el => el);
        analitics.wins = wins.length;
        analitics.losts = analitics.count - analitics.wins;
        const ratio = wins.length / analitics.losts;
        analitics.ratio = ratio === 1 ? '0.5' : ratio.toFixed(2);
        rl.close();
    } catch (e) {
        console.log(e);
        rl.close();
    }

});
const getResultMessage = () => {
    return `
    1. Общее количество партий - ${analitics.count}
    2. Количество выигранных / проигранных партий - ${analitics.wins} / ${analitics.losts}
    3. Процентное соотношение выигранных партий - ${analitics.ratio}
    `;
};

rl.on('close', () => {
    console.log('Анатализатор файла закончил работу');
    console.log(`Результат: ${getResultMessage()}`);
});
rl.emit('line');
