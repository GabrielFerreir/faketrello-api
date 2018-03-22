const auth = require('../../auth/authController');
module.exports = (app) => {
    app.route('/auth/generateToken').post(auth.createToken);
};
