const http = require('http');
const readline = require('readline');
const yargs = require('yargs/yargs');

const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const city = argv._[0];

const API = `http://api.weatherstack.com/current?access_key=${process.env.TOKEN}`;

const rl = readline.createInterface({
    input: process.stdin
});

const getMessage = ({ request, current }) => {
    return `
    ${request.query},
    Температура: ${current.temperature}
    Ветер: ${current.wind_speed} км / ч
    Осадки: ${current.precip} мм
    Давление: ${current.precip} мб
    `;
};

const handleGetRequest = res => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', chunk => rawData += chunk);
    res.on('end', () => {
        let parsedData = JSON.parse(rawData);
        if (parsedData.error) {
            console.log('Ваш запрос не удался. Пожалуйста, попробуйте еще раз или обратитесь в службу поддержки.');
        } else {
            console.log(getMessage(parsedData));
        }
    })
        .on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });
    return rl.close();
};

rl.on('line', async () => {
    if (!city) {
        console.log('Введите название города, для которого требуется вывести прогноз');
        return rl.close();
    }
    const path = `${API}&query=${city}`;
    http.get(path, handleGetRequest);
});

rl.emit('line');
