const db = global.db;
module.exports = {
    generateToken
};

async function generateToken(params) {
    const data = await db.json('generateToken', [
        params.email,
        params.pass
    ]);
    let error;
    switch (data.executionCode) {
        case 1:
            error = data;
            error.httpCode = 409;
            break;
    }
    if (error)
        throw error;
    return data;
}