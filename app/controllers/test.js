var Test = require('../models/test');
var Config = require('../models/config')
var User = require('../models/user')
var Activity = require('../models/activity')
var Task = require('../models/task')
var app = require('../../app')
var _ = require('underscore');
var moment = require('moment');
var fs  = require('fs');
var path = require('path');


exports.addTest = function(req,res,next){
	var testObj=req.body.test
	var id = req.body.test._id
	var _test

	testObj.owner=req.session.user._id;

	_test= new Test(testObj)

	_test.save(function(err,test){
		if(err){
			console.log(err)
		}
		var id=test._doc._id;

		res.send({testId:test._doc._id,configId:test._doc.configId})

		req.body.testId = test._doc._id;
		req.body.configId = test._doc.configId
		req.body.action = 'created'
		next();	    //res.redirect(req.get('referer'))
	})
}

exports.updateTest = function(req,res,next){
		var id = req.body.test._id
		var testObj=req.body.test
		var _test
		
		if(id){
		Test.findById(id,function(err,test){
			if(err){
				console.log(err)
				res.send({code:400,message:'failed'})
			}else if(!test){
				res.send({code: 400, message: "test doesn't exist"})
			}else{
				_test = _.extend(test,testObj)
				_test.save(function(err,test){
					res.send({code:200,message:'test updated successfully'})
					
					req.body.testId = test._doc._id;
					req.body.configId = test._doc.configId
					req.body.action = 'updated'
					
					next()
				})
			}
		})
	}else{
		res.end()
	}
}

exports.getAllTest = function(req, res){
	var id=req.session.user._id;
	var queryObj={};

	//role=0 normal user, role=1 super user. Normal user can only see recorded commited by him/herself
	User.findOne({_id: id},function(err,user){

	if(user.role=0){
		queryObj.commitId=id;
	}

	if(req.query.testId || req.params.id){
		queryObj._id=req.query.testId || req.params.id
	}

	if(req.query.projectId){
		queryObj.project=req.query.projectId
	}

		Test
		.find(queryObj)
		.populate('owner','userName')
		.populate('type','testType')
		.populate('project','name')
		.populate('configId','users')
		.exec(function(err, tests){
			if(err){console.log(err)}
			var _tests=[];
			for(var i in tests){
				var subTest=[{name:tests[i].testName,id:tests[i]._id},tests[i].owner.userName,tests[i].configId.users, moment(tests[i].meta.createAt).fromNow(),tests[i]._id]
				_tests.push(subTest)					
			}			
			res.send(_tests)
		})		
	})
}
	// else{
	// 	Test
	// 	.find({})
	// 	.populate('owner','userName')
	// 	.populate('type','testType')
	// 	.populate('project','name')
	// 	.exec(function(err, tests){
	// 		if(err){console.log(err)}
	// 			res.send(tests)
	// 	})		
	// }


exports.getTest = function(req, res){
	var id=req.session.user._id;
	var queryObj={"_id":req.query.projectId || req.params.id};

	User.findOne({_id: id},function(err,user){

	if(user.role==0){
		queryObj.commitId=id;
	}	

	Test
	.find(queryObj)
	.populate('owner','userName')
	.populate('type','testType')
	.populate('project','name')	
	.exec(function(err, test){
		if(err){console.log(err)}
			res.send(test)
	})
})}
//upload a new case
exports.uploadCase= function(req,res,next){
	var caseData = req.files.uploadCase
	var filePath = caseData.path
	var size = caseData.size
	var originalFilename = caseData.originalFilename

	if(originalFilename){
		fs.readFile(filePath, function(err,data){
			var timestamp = Date.now();
			var type = caseData.type.split('/')[1];
			var newName = timestamp+'.'+'jmx';
			var newPath = path.join(__dirname,'../../','/public/cases/'+newName);
			fs.writeFile(newPath,data,function(err){
				if(err) console.log(err)
				res.send({
					caseName: newName,
					size: size,
					originalFilename: originalFilename
				})
				//next()
			})
		})
	}else{next()}
}

//re-excute a test
exports.reExcTest = function(req,res,next){
	var _id = req.body.testId
	var configId
		if(_id){
		Test
		.findById(_id,function(err,test){
			if(err){
				console.log(err)
			}else if(! test){
				res.send({code:400,message:"Test doesn't exist"})
			}
			else{
				req.body.configId = test._doc.configId
				next()
			}
		})		
	}
}

//delete a test
exports.delTest = function(req,res){
	var id = req.params.id
	if(id){
		Test
		.find({_id:id})
		.exec(function(err,test){
			if(test.length>0){
			//Delete test
				Test.remove({_id:id},function(err,test){
					//delete task and related config
					Task
					.find({testId:id})
					.exec(function(err,tasks){
						tasks.forEach(function(T){
							Config.remove({_id:T.configId},function(err,config){
								//console.log("delete config " + T.configId)
							})
							Task.remove({_id:T._id},function(err,task){
								//console.log("delete task "+ T._id)
							})
						})

						res.send({code:200,message:"Test is deleted successfully"})
					})
					//delete activity
					Activity
					.find({target:id})
					.exec(function(err,activities){
						activities.forEach(function(A){
							Activity.remove({_id:A._id},function(err,activity){
								//console.log("delete activity "+ A._id)
							})
						})
					})
				}) 
			}else{
				res.send({code:400, message:"Test doesn't exist"})
			}
		})
	}else{
		res.end()
	}
}
