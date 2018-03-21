const repository = require('./usuarioRepository');
const Validator = require('./../../api/validator/validator');

const helperImages = require('../../helpers/images');
const auth = require('../../auth/auth');


module.exports = {
    insert,
    change,
    createToken
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

async function change(req, res) {
    const params = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
        image: req.body.image,
        removed: req.body.removed || false
    };
    let validator = new Validator();

    validator.isRequired(params.id, 'Id é requirido');
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
        const oldPath = await repository.verifyChangeEmail(params);
        if (params.image) {

            if (oldPath.path)
                await helperImages.remove(`images/${oldPath.path}`);

            params.image = await helperImages.insertImg(params.image, 'user_', 'images/');
        } else if (!params.image && params.removed) {
            if (oldPath.path)
                await helperImages.remove(`images/${oldPath.path}`);
        }
        await repository.change(params);
        return res.finish({
            message: 'Usuario alterado com sucesso'
        });

    } catch (error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
}

async function createToken(req, res) {
    const params = {
        email: req.body.email,
        pass: req.body.pass
    };
    let validator = new Validator();
    validator.isRequired(params.email, 'Email é requirido');
    validator.isRequired(params.pass, 'Senha é requirida');
    if (!validator.isValid()) {
        return res.finish({
            httpCode: 400,
            error: validator.errors()
        });
    }
    try{
        const generateToken = await repository.generateToken(params);
        params.id = generateToken.id;
        const token = await auth.generateToken(params);
        return res.finish({
            content: {
                token: token
            },
            message: 'OK'
        });

    } catch(error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }

}



