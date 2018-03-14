module.exports = (app) => {
    const user = require('../../core/usuario/usuarioController');

    app.route('/user').post(user.insert);

    app.route('/user').put(user.change);
};