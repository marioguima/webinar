var crypto = require('crypto');
// avaliar utilizar o uuid para gerar os ids das lives
// https://github.com/uuidjs/uuid

function generateIdEvent() {
    const length = 5;
    let idEvent = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    // console.log(idEvent);
    let dataAtual = new Date();
    let ano = dataAtual.getFullYear();
    let mes = dataAtual.getMonth();
    let dia = dataAtual.getDay();
    dia = (dia + 1) < 9 ? '0' + (dia + 1).toString() : (dia + 1);
    // let hora = dataAtual.getHours();
    // let min = dataAtual.getMinutes();
    // let seg = dataAtual.getSeconds();
    idEvent = ano.toString() + (mes + 1).toString() + dia + idEvent;

    return idEvent;
}
// console.log('id do evento: ' + generateIdEvent());