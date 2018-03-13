const db = global.db;
module.exports = {
    insert,
    verifyEmail
};

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