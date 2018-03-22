module.exports = (app) => {
    const user = require('../../core/usuario/usuarioController');
    const authController = require('../../auth/authController');

    app.route('/user').post(user.insert);

    app.route('/user').put(authController.authorize, user.change);
};