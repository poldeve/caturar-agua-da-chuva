const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const controller = require('./js/controller');
const sensores = require('./js/sensores');
const formatacoes = require('./utility/formatacoes');
const mysql = require('./db/mysql');

console.log('** APLICAÇÃO INICIALIZADA **');

async function start() {
    // process.env.VOLUME_ECONOMIZADO = await mysql.queryUltimaEconomiaRealizada();
    let volumeInicial = 0;
    await mysql.queryVolumes().then(results => (
        volumeInicial += results[0].volume,
        volumeInicial += results[1].volume,
        process.env.VOLUME_ECONOMIZADO = volumeInicial
    ));
    console.log(process.env.VOLUME_ECONOMIZADO);
    // Inicializa a leitura dos sensores
    sensores.processaSensores();

    // Ao inicializar a aplicação, o valor da variavel de ambiente DATA_ECONOMIA é setada como a data do dia
    process.env.DATA_ECONOMIA = formatacoes.convertUTCDateToLocalDate(new Date());

    // Gera um loop de execução da função que faz todo o processo de atualização de volumes e economia
    setInterval(async function() {
        await controller.verificaEconomiaRealizada();
    }, 1000 * 60 * 1); // 1000ms = 1 segundo, * 60 = 1 minuto, * 5 = 5 minutos
}

start();