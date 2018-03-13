const fs = require('fs');

module.exports = {
    insertImg
};

async function insertImg(base64, prefix, path) {
    return new Promise((resolve, reject) => {
        let matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        let response = {};
        if (!matches) {
            throw {
                httpCode: 409,
                message: 'Formato invalido',
                executionCode: 2
            };
        }
        let extencao;
        switch (matches[1]) {
            case 'image/svg+xml':
                extencao = 'svg';
                break;
            case 'image/png':
                extencao = 'png';
                break;
            case 'image/jpeg':
                extencao = 'jpg';
                break;
            default:
                extencao = null;
        }
        response.data = new Buffer(matches[2], 'base64');
        const milli = new Date().getTime();
        const random = ("0000" + (Math.floor(Math.random() * 1000) + 1)).slice(-4); // Coloca zero a esquerda
        const name = `${prefix}${milli}_${random}.${extencao}`;
        fs.writeFile(`${path}${name}`, response.data, async (error) => {
            if (error) {
                reject(error);
            }
            resolve(name);
        });
    })
}