require('./src/infra/mongo/mongoSchemas');
const express = require('express');
const app = express();
const consign = require('consign')({verbose: false});
const bodyParser = require('body-parser');
const init = require('./config/init');

module.exports = startServer;

function startServer() {
    const mongoDb = require('./src/infra/mongo/mongoose');
    mongoDb.connect((err) => {
        if (err) {
            console.log(err);
            return process.exit(-1);
        }

        init();

        app.use(bodyParser.json({limit: '30mb'}));
        app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

        app.use(require('./src/api/middleware/cors'));
        app.use(require('./src/api/middleware/response'));

        consign
            .include('./src/api/routes')
            .into(app);

        app.listen(global.config.api.port, () => {
            console.log(`Servidor rodando na porta ${global.config.api.port}`);
        });
    });
}

