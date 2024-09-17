const readXlsxFile = require('read-excel-file/node');

const fs = require('fs');

const file = fs.createReadStream('./src/carga_db/alimenta_banco.xlsx');

const schema = {
	DATA: {
		prop: 'data',
		type: String
	},
	VOLUME: {
		prop: 'volume',
		type: Number
	}
};

module.exports = {
	dadosExcel: function() {
		return new Promise((resolve, reject) => {
			readXlsxFile(file, { schema }).then(({ rows, errors }) => {
				resolve(rows);
			});
            
		});
	}
};
