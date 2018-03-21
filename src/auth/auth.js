const jwt = require('jsonwebtoken');
const KEY = '91416644';

exports.generateToken = async (data) => {
    return jwt.sign(data, KEY);
};

exports.decodeToken = async (token) => {
    const data = await jwt.verify(token, KEY);
    return data;
};

exports.authorize = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

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