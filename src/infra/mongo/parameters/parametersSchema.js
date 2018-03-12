const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({});

mongoose.model('parameters', schema, 'parameters');
