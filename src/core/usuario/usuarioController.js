const repository = require('./usuarioRepository');
const Validator = require('./../../api/validator/validator');
const helperImages = require('../../helpers/images');

const authController = require('../../auth/authController');


module.exports = {
    insert,
    change,
    remove
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
    const token = req.body.token || req.query.token || req.headers['authentication'];
    let tokenDecode = await authController.decodeToken(token);

    const params = {
        id: tokenDecode.id,
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

async function remove(req, res) {
    const token = req.body.token || req.query.token || req.headers['authentication'];
    let tokenDecode = await authController.decodeToken(token);
    const params = {id: tokenDecode.id};
    let validator = new Validator();
    validator.isRequired(params.id, 'Id é requirido');
    if (!validator.isValid()) {
        return res.finish({
            httpCode: 400,
            error: validator.errors()
        });
    }
    try {
        let data = await repository.removeUser(params);
        if(data.image)
            await helperImages.remove(`images/${data.image}`);
        return res.finish({
            message: 'Usuario deletado com sucesso'
        });
    } catch(error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }

}





