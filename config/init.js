require('./environment/settings');
// require('../src/helpers/asyncWrap');

module.exports = async () => {
    require('../src/infra/db');
};
