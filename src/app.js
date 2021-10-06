const path = require("path");
require("dotenv").config({ path: path.join(__dirname,"../.env") })

const controller = require('./js/controller');
const sensores = require('./js/sensores');
const formatacoes = require('./utility/formatacoes');

console.log('** APLICAÇÃO INICIALIZADA **');

async function start() {
    // Inicializa a leitura dos sensores
    sensores.processaSensores();

    // Gera um loop de execução da função que faz todo o processo de atualização de volumes e economia
    setInterval(async function() {
      process.env.VOLUME_ECONOMIZADO = process.env.VOLUME_CISTERNA1 + process.env.VOLUME_CISTERNA2
      // Ao inicializar a aplicação, o valor da variavel de ambiente DATA_ECONOMIA é setada como a data do dia
      let data_atual = formatacoes.convertUTCDateToLocalDate(new Date());
      process.env.DATA_ECONOMIA = data_atual;

      await controller.verificaEconomiaRealizada();
    }, 1000 * 60 * 1); // 1000ms = 1 segundo, * 60 = 1 minuto, * 5 = 5 minutos
    
}

start();