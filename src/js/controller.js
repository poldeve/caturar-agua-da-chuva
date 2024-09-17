const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") })
const mysql = require('../db/mysql');
const formatacoes = require('../utility/formatacoes');
const sensores = require('./sensores');

module.exports = {
    /**
     * Função que realizar todo o processamento dos volumes, para verificar a economia realizada.
     * @returns 
     */
    verificaEconomiaRealizada: async function() {
        console.log('** Inicio do script **');
        let volume_economizado = parseInt(process.env.VOLUME_ECONOMIZADO);
        let data_atual = formatacoes.convertUTCDateToLocalDate(new Date());
        let volume_atual = parseInt(process.env.VOLUME_CISTERNA1) + parseInt(process.env.VOLUME_CISTERNA2)
        let registro_db = await buscaVolumeRegistrado(data_atual);

        // await mysql.insereEconomiaRealizada(data_atual, volume_atual)

        if (data_atual !== process.env.DATA_ECONOMIA) {

            process.env.DATA_ECONOMIA = data_atual;

            if (volume_atual > volume_economizado) {

                await mysql.insereEconomiaRealizada(data_atual, volume_atual - volume_economizado)

                process.env.VOLUME_ECONOMIZADO = volume_atual;
                console.log('valor da variavei volume_economizado atualizado para: ', volume_economizado);

            } else if (volume_atual < volume_economizado) {

                await mysql.insereEconomiaRealizada(data_atual, 0)

                process.env.VOLUME_ECONOMIZADO = volume_atual;
                console.log('valor da variavei volume_economizado atualizado para: ', volume_economizado);

            }

        } else if (data_atual === process.env.DATA_ECONOMIA && volume_atual > volume_economizado) {

            let qtd_litros_economizados = registro_db.qtd_litros_economizados + (volume_atual - parseInt(volume_economizado));

            await mysql.atualizaEconomiaRealizada(data_atual, qtd_litros_economizados);

            process.env.VOLUME_ECONOMIZADO = volume_atual;
            console.log('valor da variavei volume_economizado atualizado para: ', volume_economizado);

        } else if (data_atual === process.env.DATA_ECONOMIA && volume_atual < volume_economizado) {

            process.env.VOLUME_ECONOMIZADO = volume_atual;
            console.log('valor da variavei volume_economizado atualizado para: ', volume_economizado);

        } else if (!registro_db) {

            await mysql.insereEconomiaRealizada(data_atual, 0)

        }

        await mysql.atualizaVolume(5, process.env.VOLUME_CISTERNA1);
        await mysql.atualizaVolume(15, process.env.VOLUME_CISTERNA2);

        console.log('** Fim do script **');
    }
}

async function buscaVolumeRegistrado(data) {
    let registro_atual;

    await mysql.queryEconomiaRealizada(data).then(results => (
        registro_atual = results[0]
    ));

    return registro_atual;
}