let generateMessage = (from, data) => {
    return {
        from,
        data,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR')
    };
};

module.exports = { generateMessage };