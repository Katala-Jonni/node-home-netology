const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const moment = require('moment');
moment.locale('ru');

const argv = yargs(hideBin(process.argv)).argv;

const getDefaultMessage = () => {
    return `
  Доступны такие функции:
  1. cmd current +
    --year или -y  -> Текущий год
    --month или -m -> Текущий месяц
    --date или -d -> Дата в календарном месяце
    --day День недели
   2. cmd add или cmd sub +
    --year {число} или -y {число} -> Прибавить/Убавить год
    --month {число} или -m {число} -> Прибавить/Убавить месяц
    --date {число} или -d {число} -> Прибавить/Убавить день
  `;
};

const mapNameDate = {
    y: 'year',
    year: 'year',
    m: 'month',
    month: 'month',
    d: 'days',
    date: 'days',
    day: 'day'
};

const ucFirst = (str) => {
    if (!str) {
        throw new Error('ОШИБКА: Не передана строка в функцию "ucFirst"');
    }

    return str[0].toUpperCase() + str.slice(1);
};

const mapDateOption = {
    year: {
        param: 'YYYY',
        desc: 'Текущий год',
        isNum: true
    },
    month: {
        param: 'MMMM',
        desc: 'Текущий месяц'
    },
    days: {
        param: 'D',
        desc: 'Дата в календарном месяце',
        isNum: true
    },
    day: {
        param: 'dddd',
        desc: 'День недели'
    }
};

const getDate = (options) => {
    return `${options.desc}: ${options.isNum
        ? moment().format(options.param)
        : ucFirst(moment().format(options.param))}`;
};
const getCurrentDate = () => `Текущая дата и время в формате ISO: ${moment().format()}`;
const changeDate = (str = 'add', count = 1, name = 'year') => moment()[str](count, name).format();

const getCurrentCmd = () => {
    let str = '';
    Object.keys(argv).forEach(a => {
        const key = a.toLowerCase();
        if (mapNameDate[key]) {
            const name = mapNameDate[key];
            str = str + `\n ${getDate(mapDateOption[name])}`;
        }
    });
    if (!str) {
        str = getCurrentDate();
    }
    return str;
};

const getChangeDateCmd = () => {
    let str = '';
    Object.keys(argv).forEach(a => {
        const key = a.toLowerCase();
        if (mapNameDate[key] && Number.isFinite(argv[key])) {
            const actionName = argv._[0] === 'sub' ? 'subtract' : 'add';
            str = str + `\n ${changeDate(actionName, argv[key], mapNameDate[key])}`;
        }
    });
    return str;
};

const init = () => {
    try {
        let str = '';
        if (argv._[0] === 'current') {
            str = getCurrentCmd();
        }
        if (argv._[0] === 'add' || argv._[0] === 'sub') {
            str = getChangeDateCmd();
        }
        if (!str) {
            return getDefaultMessage();
        }
        return str;
    } catch (e) {
        return e;
    }
};

console.log(init());
