var mongoose = require('mongoose')
var TaskStatusSchema = require('../schemas/taskStatus')
var TaskStatus = mongoose.model('Task',TaskStatusSchema)

module.exports = TaskStatus