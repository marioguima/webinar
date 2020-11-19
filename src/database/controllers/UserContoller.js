const { listen } = require('socket.io');
const db = require('../models/index');

module.exports = {
    async index(req, res) {
        return res.status(200).send({ "data": "chegou aqui" });

        const users = await db.User.findAll();

        if (users == "" || users == null) {
            return res.status(200).send({
                message: "Nenhum usuário cadastrado"
            });
        }

        return res.status(200).send({
            users
        });

    },

    async store(req, res) {

        const { name, password, email } = req.body;

        const user = await db.User.create({ name, password, email });

        return res.status(200).send({
            status: 1,
            message: 'usuário cadastro com sucesso!',
            user,
        })

    },

    async update(req, res) {

    },

    async delete(req, res) {

    }
}