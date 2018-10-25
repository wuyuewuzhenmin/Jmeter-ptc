//Actitivy means what user has done recently.upload new test, update test etc...

var Activity = require('../models/activity');
var moment = require('moment');
var path = require('path');

exports.addAcctivity = function(req,res){
	var _activity = {}
	_activity.user = req.session.user._id;
	_activity.action = req.body.action;
	_activity.target = req.body.testId;
	_activity.config = req.body.configId;

	var activity = new Activity(_activity)

	activity.save(function(err, activity){

	})
}

exports.getAllActivity = function(req,res){
	Activity
	.find({})
	.sort({'meta.createAt':'desc'})
	.limit(50)
	.populate('user','userName')
	.populate('target','testName')
	.populate('config','users')
	.exec(function(err, activities){
		var _activities=[];

		activities.forEach(function(A){
			var subActivity ={activity: A, createAt: moment(A.meta.createAt).fromNow()}
			_activities.push(subActivity)
			
		})
		res.send(_activities)
	})
}



