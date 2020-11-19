let expect = require('expect');
const message = require('./message');

var { generateMessage } = require('./message');

describe('Gerar Mensagem', () => {
    it('Mensagem gerada', () => {
        let from = "Mário Guimarães",
            data = "Mensagem de teste"
        var message = generateMessage(from, data);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({ from, data });
    })
});