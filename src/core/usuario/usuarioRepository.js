const db = global.db;
module.exports = {
    verifyEmail,
    insert,
    verifyChangeEmail,
    change
};

async function verifyEmail(email) {

    let data = await db.json('existsEmailUser', [ email ]);
    let error;

    switch (data.executionCode) {
        case 1:
            error = data;
            error.httpCode = 409;
            break;
    }
    if (error)
        throw error;
}

async function insert(params) {
    let data = await db.json('insertUser', [
        params.name,
        params.email,
        params.pass,
        params.image
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
}

async function verifyChangeEmail(params) {
    let data = await db.json('verifyChangeEmail', [params.id, params.email]);
    let error;

    switch (data.executionCode) {
        case 1:
            error = data;
            error.httpCode = 409;
            break;
    }
    if(error)
        throw error;

    return data;
}

async function change(params) {
    let data = await db.json('changeUser', [
        params.id,
        params.name,
        params.email,
        params.pass,
        params.image
    ]);

    let error;

    if (error)
        throw error;
}