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
    // participante: {
    //     selecionarPorEmail: {
    //         method: 'GET',
    //         url: `${global.config.api.azureBootcamp.host}:${global.config.api.azureBootcamp.port}/participante`
    //     },
    // }
}
