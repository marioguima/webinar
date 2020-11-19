const express = require('express');
const UserContoller = require('./database/controllers/UserContoller');

const router = express.Router();

router.get('/webinar', (request, response) => {
    response.sendFile(__dirname + '/../webinar/index.html')
});

router.get('/admins', (request, response) => {
    response.sendFile(__dirname + '/../admin/index.html')
});

router.get('/users', UserContoller.index);


module.exports = router;