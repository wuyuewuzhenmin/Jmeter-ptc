var mongoose = require('mongoose')
var TestSchema = require('../schemas/test')
var Test = mongoose.model('Test',TestSchema)

module.exports = Test