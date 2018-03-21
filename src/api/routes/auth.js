const user = require('../../core/usuario/usuarioController');
module.exports = (app) => {
    app.route('/auth/generateToken').post(user.createToken);
};
