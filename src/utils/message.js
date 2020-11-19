const moment = require('moment');

let generateMessage = (from, data) => {
    return {
        from,
        data,
        createdAt: moment().valueOf()
    };
};

module.exports = { generateMessage };