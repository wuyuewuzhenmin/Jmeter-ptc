var Control = require('./control')
var mongoose = require('mongoose')
var Task = require('../models/task');
var Task = require('../models/task');

var dbUrl = 'mongodb://localhost:27017/ptc'


mongoose.connect(dbUrl, function(err){
	if(err){
		console.log(err)
	}else{
		console.log('db conncetion established')
	}
})

mongoose.Promise = global.Promise

Task
	.find({name:'Chrome'})
	.sort({'meta.recordAt':'desc'})
	.limit(1)
	.exec(function(err, task){
		task[0].name='TEST'
		console.log(task)
		task[0].save(function(err,task){
			if(err){console.log(err)}
				console.log('success')
		})
	})


	nohup sleep 300 & echo $!