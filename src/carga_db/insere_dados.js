const EXCEL = require('./excel');
const MYSQL = require('../db/mysql');

async function ler() {
    let dados = []
    dados = await EXCEL.dadosExcel();
    // await inserirNoBanco(dados);
}

async function inserirNoBanco(dados = []) { 
    for(let i=0; i<dados.length; i++) { 
        await MYSQL.insereEconomiaRealizada(dados[i].data, dados[i].volume);
    }
}

ler();