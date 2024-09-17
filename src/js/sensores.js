const five = require('johnny-five');
const { Board, Proximity, Servo } = require('johnny-five');
const board = new Board();
const path = require("path");
require("dotenv").config({ path: path.join(__dirname,"../.env") })

let cisterna1_conversao1;
let cisterna1_conversao2 = 17; // Valor da base do recipiente até o sensor
let cisterna1_conversao3;
let cisterna1_conversao4;

let cisterna2_conversao1;
let cisterna2_conversao2 = 16.4; // Valor da base do recipiente até o sensor
let cisterna2_conversao3;
let cisterna2_conversao4;

module.exports = {
	processaSensores: function() {
		board.on('ready', function() {
			const sensor_chuva = new five.Sensor({
				pin: 'A1',
				freq: 5000 //frequencia de leitira do sensor, aproximadamente 5 segundos
			});
			const motor_calha = new five.Servo({
				pin: 2,
				center: true
			});
			const cisterna1 = new Proximity({
				controller: 'HCSR04',
				pin: 'A2', // parametro de entrada LD esquerdo da telha
				freq: 5000 //frequencia de leitira do sensor, aproximadamente 5 segundos
			});
			const cisterna2 = new Proximity({
				controller: 'HCSR04',
				pin: 'A3', // parametro de entrada LD direito da telha
				freq: 5000 //frequencia de leitira do sensor, aproximadamente 5 segundos
			});

			sensor_chuva.on('change', function() {
				if (sensor_chuva.value < 1000) {
					if (cisterna1_conversao1 <= 13) {
						motor_calha.to(93);
					} else if (cisterna2_conversao1 <= 13) {
						motor_calha.to(80);
					} else {
						console.log(' Cisternas Cheia: ', sensor_chuva.value);
					}
					if (sensor_chuva.value <= 400) {
						console.log('  Chuva forte : ', sensor_chuva.value);
					} else if (sensor_chuva.value > 400 && sensor_chuva.value <= 600) {
						console.log('  Chuva moderada : ', sensor_chuva.value);
					} else if (sensor_chuva.value > 600 && sensor_chuva.value <= 950) {
						console.log('  Chuva Fraca : ', sensor_chuva.value);
					}
				} else {
					motor_calha.to(90);
					console.log('Sem Chuva', sensor_chuva.value);
				}
			});

			cisterna1.on('change', function() {
				const { centimeters, inches } = cisterna1;
				console.log('| 1° Primeira Cisterna |');
				console.log('-----------------');
				cisterna1_conversao1 = (centimeters - cisterna1_conversao2) * -1; //Converter o valor de 16.60 > 0 para 0 > 16.60 altura recipiente
				console.log('Nível de Água da Cisterna (1): ', cisterna1_conversao1.toFixed(0), 'cm'); // retorna o valor com 0 decimais para inibir a oscilação do sensor
				console.log('-----------------');
				cisterna1_conversao3 = cisterna1_conversao1 * 240; // Volume -> Conversão1 = Altura, comprimento * profundidade = 240, medida do recipiente.
				console.log('Valor em Centimetros Cubico: ', cisterna1_conversao3.toFixed(0), 'C³');
				console.log('-----------------');
				cisterna1_conversao4 = cisterna1_conversao3 / 1000; //C³ centimetros cubicos dividir por 1000 para chegar em litros
				console.log('Valor em Litros: ', cisterna1_conversao4.toFixed(0), 'L');
				console.log('-----------------');
				console.log('Data e Hora');
				console.log('');
				console.log('');
				process.env.VOLUME_CISTERNA1 = parseInt(cisterna1_conversao4.toFixed(0));
			});

			cisterna2.on('change', function() {
				const { centimeters, inches } = cisterna2;
				console.log('| 2° Segunda Cisterna |');
				cisterna2_conversao1 = (centimeters - cisterna2_conversao2) * -1; //Converter o valor de 16.40 > 0 para 0 > 16.40 altura recipiente
				console.log('Nível de Água da Cisterna (2): ', cisterna2_conversao1.toFixed(0), 'cm'); // retorna o valor com 0 decimais para inibir a oscilação do sensor
				console.log('-----------------');
				cisterna2_conversao3 = cisterna2_conversao1 * 240; // Volume -> Conversão1 = Altura, comprimento * profundidade = 240, medida do recipiente.
				console.log('Valor em Centimetros Cubico: ', cisterna2_conversao3.toFixed(0), 'C³');
				console.log('-----------------');
				cisterna2_conversao4 = cisterna2_conversao3 / 1000; //C³ centimetros cubicos dividir por 1000 para chegar em litros
				console.log('Valor em Litros: ', cisterna2_conversao4.toFixed(0), 'L');
				console.log('-----------------');
				console.log('Data e Hora');
				console.log('');
				console.log('');
				process.env.VOLUME_CISTERNA2 = parseInt(cisterna2_conversao4.toFixed(0));
			});
			// return {cisterna1: 300, cisterna2: 300}
		});
	}
};
