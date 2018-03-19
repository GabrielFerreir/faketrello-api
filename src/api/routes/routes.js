let routes;

module.exports = (app) => {
    app.route('/api').get((req, res) => {
        return res.finish({
            httpCode: 200,
            content: routes
        });
    });
};

routes = {
    user: {
        create: {
            method: 'POST',
            url: `${global.config.api.host}:${global.config.api.port}/user`
        },
        change: {
            method: 'PUT',
            url: `${global.config.api.host}:${global.config.api.port}/user`
        }
    }
};
