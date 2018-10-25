var mongoose = require('mongoose')
var ConfigSchema = require('../schemas/config')
var Config = mongoose.model('Config',ConfigSchema)

module.exports = Config