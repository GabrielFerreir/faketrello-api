const mongoose = require('mongoose');
const parametersSchema = mongoose.model('parameters');

module.exports = get;

function get(callback) {
    parametersSchema.findOne((err, data) => {
        if (err) return callback(err);

        // Mescla opções fixas com config do mongodb
        Object.assign(global.config, data._doc);
        //-----------------------------------------------
        callback();
    });
}
