const repository = require('./usuarioRepository');
const Validator = require('./../../api/validator/validator');

const fs = require('fs')

module.exports = {
    insert
};

async function insert(req, res) {
    const params = {
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
        image: req.body.image
    };

    let validator = new Validator();
    validator.isRequired(params.name, 'Nome é requirido');
    validator.isRequired(params.email, 'Email é requirido');
    validator.isRequired(params.pass, 'Senha é requirida');
    validator.isEmail(params.email, 'Email invalido');


    if (!validator.isValid()) {
        return res.finish({
            httpCode: 400,
            error: validator.errors()
        });
    }

    try {
        await repository.verifyEmail(params.email);
        params.image = await insertImg(params.image);
        await repository.insert(params);

        return res.finish({
            message: 'Usuario cadastrado com sucesso'
        });
    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function insertImg(base64) {
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
        const extencao = identifyExtencao(matches[1]);

        response.data = new Buffer(matches[2], 'base64');
        const name = `${generateNameImg()}.${extencao}`;

        fs.writeFile(`images/${name}`, response.data, async(error) => {
            if (error) {
                reject(error);
            }
            resolve(name);
        });
    })
}

function generateNameImg() {
    const milli = new Date().getTime();
    return `user${milli}`;
}

function identifyExtencao(fullExt) {
    let extencao;
    switch (fullExt) {
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
    return extencao;
}

