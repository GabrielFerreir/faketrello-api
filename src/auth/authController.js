const jwt = require('jsonwebtoken');
const KEY = '91416644';
const Validator = require('../api/validator/validator');
const repository = require('./authRepository');

async function generateToken (data){
    return jwt.sign(data, KEY);
};

exports.decodeToken = async (token) => {
    const data = await jwt.verify(token, KEY);
    return data;
};

exports.authorize = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['authentication'];

  if(!token) {
      return res.finish({
          httpCode: 401,
          message: 'Acesso restrito'
      });
  } else {
      jwt.verify(token, KEY, (error, decoded) => {
          if(error) {
              return res.finish({
                  httpCode: 401,
                  message: 'Token inválido'
              });
          } else {
              next();
          }
      });
  }

};

exports.createToken = async (req, res) => {
    const params = {
        email: req.body.email,
        pass: req.body.pass
    };
    let validator = new Validator();
    validator.isRequired(params.email, 'Email é requirido');
    validator.isRequired(params.pass, 'Senha é requirida');
    if (!validator.isValid()) {
        return res.finish({
            httpCode: 400,
            error: validator.errors()
        });
    }
    try{
        const query = await repository.generateToken(params);
        params.id = query.id;

        const token = await generateToken(params);
        return res.finish({
            content: {
                token: token
            },
            message: 'OK'
        });
    } catch(error) {
        return res.finish({
            httpCode: error.httpCode || 500,
            error
        });
    }
};

