
module.exports = {
    convertUTCDateToLocalDate: function (date) {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
    
        newDate.setHours(hours - offset);
    
        return formataData(newDate);   
    }
};

function formataData(data = new Date()) {
    let dataFormatada = '';

    if(data.getMonth() < 10) {
        dataFormatada = dataFormatada.concat(data.getFullYear() + '-0' + (data.getMonth()+1) + '-' + data.getDate());
    } else {
        dataFormatada = dataFormatada.concat(data.getFullYear() + '-' + (data.getMonth()+1) + '-' + data.getDate());
    }
    
    return dataFormatada;
}