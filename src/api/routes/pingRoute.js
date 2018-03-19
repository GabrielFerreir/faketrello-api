const auth = require('../../auth/auth');
const user = require('../../core/usuario/usuarioController');

module.exports = (app) => {
    app.route('/ping').get((req, res) => {
        return res.finish({
            httpCode: 200,
            content: new Date()
        });
    });

    app.route('/token').post(user.createToken);
};
