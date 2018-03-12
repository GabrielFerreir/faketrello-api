const cluster = require('cluster');
const server = require('./server');
require('./config/init');

if (global.config.isProduction && cluster.isMaster) {
    for (let i = 0; i < global.config.numCPUs; i++) cluster.fork();

    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });
} else {
    server();
}
