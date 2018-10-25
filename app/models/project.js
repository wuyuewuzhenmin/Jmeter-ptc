var mongoose = require('mongoose')
var ProjectSchema = require('../schemas/project')
var Project = mongoose.model('Project',ProjectSchema)

module.exports = Project