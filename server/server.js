const express = require('express');
const { request } = require('http');
const app = express();
const path = require('path');

const publicPath = path.join(__dirname, '/../public');
const frontEndPath = path.join(__dirname, '/../front-end');

app.use(express.static(publicPath));

const http = require('http').createServer(app);
const serverSocket = require('socket.io')(http);
// const adminNameSpace = serverSocket.of('/admin');

const porta = process.env.PORT || 9000;

const host = process.env.HEROKU_APP_NAME ?
    `httpss://${process.env.HEROKU_APP_NAME}.herokuapp.com` :
    "http://localhost";

const { generateMessage } = require('./utils/message');

http.listen(porta, () => {
    const portaStr = porta === 80 ? '' : ':' + porta;

    if (process.env.HEROKU_APP_NAME) {
        console.log('Servidor iniciado. Abra o navegador em ' + host);
    } else {
        console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr);
    }
});

// rotas
app.get('/event', (request, response) =>
    response.sendFile(frontEndPath + '/client/event.html'));

app.get('/admin', (request, response) =>
    response.sendFile(frontEndPath + '/admin/index.html'));

serverSocket.on('connection', (socket) => {
    socket.on('nickname.set', (messageBody) =>
        nicknameSet(messageBody)
    );

    socket.on('nickname.change', (messageBody) =>
        serverSocket.emit('nickname.changed',
            generateMessage(messageBody.from, messageBody.data))
    );

    socket.on('message.new', (messageBody) =>
        serverSocket.emit('message.share',
            generateMessage(messageBody.from, messageBody.data))
    );

    socket.on('cta', (messageBody) =>
        serverSocket.emit('cta',
            generateMessage('admin', messageBody))
    );

    serverSocket.emit('people-in-room',
        generateMessage('admin', serverSocket.engine.clientsCount));

    console.log("Conexões ativas: " + serverSocket.engine.clientsCount);
});

serverSocket.on('disconnect', () => {
    console.log('Cliente desconectou');
})

function nicknameSet(messageBody) {
    if (!process.env.HEROKU_APP_NAME) {
        console.log('Join chat: ' + messageBody.from);
    }

    serverSocket.emit('nickname.seted',
        generateMessage(messageBody.from, messageBody.data));

    welcome(messageBody);
}

function saudacao() {
    mData = new Date();
    mHora = mData.getHours();
    // mDia = mData.getDate();
    // mDiaSemana = mData.getDay();
    // mMes = mData.getMonth();
    // mAno = mData.getYear();

    sSaudacao = '';

    if (mHora < 12)
        sSaudacao = 'Bom dia';
    else if (mHora >= 12 && mHora < 18)
        sSaudacao = 'Boa tarde';
    else if (mHora >= 18 && mHora < 24)
        sSaudacao = 'Boa noite';

    return sSaudacao;
}

function welcome(messageBody) {
    var aMensagens = [
        ', que bom que você está aqui 👏.',
        ', que bom que você chegou 🤝.',
        ', estou feliz que você chegou.',
        ', estou feliz que você está aqui.',
        ', 👏👏👏.'
    ];

    var sBoasVindas =
        saudacao() +
        ' ' +
        messageBody.from +
        aMensagens[(Math.random() * aMensagens.length) | 0];

    serverSocket.emit('welcome',
        generateMessage('admin', sBoasVindas));
}