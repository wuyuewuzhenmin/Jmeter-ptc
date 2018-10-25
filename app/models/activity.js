var mongoose = require('mongoose')
var ActivitySchema = require('../schemas/activity')
var Activity = mongoose.model('Activity',ActivitySchema)

module.exports = Activity