const config = {
    appName: 'faketrello',
    isProduction: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
    numCPUs: process.env.CPU_COUNT || require('os').cpus().length,
    mongoDb: {
        user: process.env.MONGODB_USER || '',
        password: process.env.MONGODB_PASSWORD || '',
        server: process.env.MONGODB_SERVER || 'localhost',
        port: process.env.MONGODB_PORT || '27017',
        database: process.env.MONGODB_DATABASE || 'faketrello',
        auth: process.env.MONGODB_AUTH || '',
        connectionString: () => {
            return `mongodb://${config.mongoDb.user ? (config.mongoDb.user + ':' + config.mongoDb.password + '@') : ''}${config.mongoDb.server}:${config.mongoDb.port}/${config.mongoDb.database}`;
        }
    },
    api: {
        // Vem do mongo
    },
    sqlConfig: {
        // Vem do mongo
    },
    teste: {}
};

function init() {
    global.config = config;
}

module.exports = init();
