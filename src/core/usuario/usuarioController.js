const repository = require('./usuarioRepository');
const Validator = require('./../../api/validator/validator');

const helperImages = require('../../helpers/images');



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
        // params.image = await insertImg(params.image);
        params.image = await helperImages.insertImg(params.image, 'user_', 'images/');
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



