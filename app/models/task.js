var mongoose = require('mongoose')
var TaskSchema = require('../schemas/task')
var Task = mongoose.model('Task',TaskSchema)

module.exports = Task