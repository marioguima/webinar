const Sequelize = require('sequelize');

const dbConfig = require('./config');

const db = require('./models/index');

const connection =
    new Sequelize(process.env.HEROKU_APP_NAME ?
        dbConfig.production :
        dbConfig.development);

try {
    connection.authenticate();
    console.log('Conexão realizada com sucesso');
} catch (error) {
    console.error('Erro ao conectar com o banco de dados', error);
}

module.exports = connection;