const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") })
const mysql = require('mysql');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

module.exports = {
    /**
     * Função que verifica o volume de todos os recipientes
     * @returns sem retorno
     */
    queryVolumes: function() {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(error, connection) {
                if (error) {
                    console.error(error);
                    reject();
                }

                let sql = 'SELECT * FROM monitoramento';

                connection.query(sql, [], function(error, results) {
                    if (error) {
                        console.error(error);
                        connection.release();
                        reject();
                    }
                    connection.release();
                    resolve(results);
                });

            });
        });
    },
    /**
     * Função que atualiza o volume dos recipientes
     * @param {number} recipiente_id id do recipiente (5 ou 15)
     * @param {number} volume volume atual do recipiente
     * @returns sem retorno
     */
    atualizaVolume: function(recipiente_id, volume) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(error, connection) {
                if (error) {
                    console.error(error);
                    reject();
                }

                let sql = 'UPDATE monitoramento SET volume = ? WHERE recipiente_id = ?';

                connection.query(sql, [volume, recipiente_id], function(error) {
                    if (error) {
                        console.error(error);
                        connection.release();
                        reject();
                    }
                    console.log('Volume do recipiente ' + recipiente_id + ' atualizado para ' + volume);
                    connection.release();
                    resolve();
                });
            });
        })
    },
    /**
     * Função que cria o registro de volume economizado no dia
     * @param {number} volume volume obtido no dia
     * @param {Date} data dia em que a economia foi realizada
     * @returns sem retorno
     */
    insereEconomiaRealizada: function(data, qtd_litros_economizados) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(error, connection) {
                if (error) {
                    console.error(error);
                    reject();
                }

                let sql = 'INSERT INTO economia_realizada (data, qtd_litros_economizados) VALUES (?, ?)';

                connection.query(sql, [data, qtd_litros_economizados], function(error) {
                    if (error) {
                        console.error(error);
                        connection.release();
                        reject();
                    }
                    console.log('Criado registor de economia no dia ' + data + '. Volume registrado: ' + qtd_litros_economizados);
                    connection.release();
                    resolve();
                });
            });
        })
    },
    /**
     * Função que atualiza o registro de volume economizado no dia
     * @param {number} volume volume obtido no dia
     * @param {Date} data dia em que a economia foi realizada
     * @returns sem retorno
     */
    atualizaEconomiaRealizada: function(data, qtd_litros_economizados) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(error, connection) {
                if (error) {
                    console.error(error);
                    reject();
                }

                let sql = 'UPDATE economia_realizada SET qtd_litros_economizados = ? WHERE data = ?';

                connection.query(sql, [qtd_litros_economizados, data], function(error) {
                    if (error) {
                        console.error(error);
                        connection.release();
                        reject();
                    }

                    console.log('Volume economizado no dia ' + data + ' atualizado para: ' + qtd_litros_economizados);
                    connection.release();
                    resolve();
                });
            });
        })
    },
    /**
     * Função que verifica se existe um registro de volume economizado no dia
     * @param {number} volume volume obtido no dia
     * @param {Date} data dia em que a economia foi realizada
     * @returns {Object} data e quantiade de litros
     */
    queryEconomiaRealizada: function(data) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(error, connection) {
                if (error) {
                    console.error(error);
                    reject();
                }

                let sql = 'SELECT * from economia_realizada WHERE data = ?';

                connection.query(sql, [data], function(error, results) {
                    if (error) {
                        console.error(error);
                        connection.release();
                        reject();
                    }
                    connection.release();
                    resolve(results);
                });
            });
        })
    },
    /**
     * Busca o ultimo registro da tabela economia_realizada
     * @returns {number} quantiade de litros
     */
    queryUltimaEconomiaRealizada: function() {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(error, connection) {
                if (error) {
                    console.error(error);
                    reject();
                }

                let sql = 'SELECT qtd_litros_economizados FROM economia_realizada ORDER BY ID DESC LIMIT 1';

                connection.query(sql, [], function(error, results) {
                    if (error) {
                        console.error(error);
                        connection.release();
                        reject();
                    }
                    connection.release();
                    resolve(results[0].qtd_litros_economizados);
                });
            });
        })
    },
};