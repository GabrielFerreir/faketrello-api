const mongoose = require('mongoose');
const bluebird = require('bluebird');
const db = mongoose.connection;
mongoose.Promise = bluebird;
let call = null;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.once('open', () => {
    console.info('MongoDB connection is established');
    require('./parameters/parametersService')(call);
});

db.on('disconnected', () => {
    console.error('MongoDB disconnected!');
    connect();
});

db.on('reconnected', () => {
    console.info('MongoDB reconnected!');
});

function connect() {
    mongoose.connect(global.config.mongoDb.connectionString(), {
        useMongoClient: true,
        autoReconnect: true,
        authSource: global.config.mongoDb.auth
    });
}

module.exports = {
    connect: (init) => {
        call = init;
        connect();
    }
};
