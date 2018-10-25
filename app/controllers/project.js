var Project = require('../models/project')
var User = require('../models/user')
var Test = require('../models/test')
var app = require('../../app')
var _ = require('underscore')
var moment = require('moment')
var fs = require('fs')
var configObj = JSON.parse(fs.readFileSync(__dirname + '/../../config/config.json', 'utf8'))
var host = configObj.targetMachine.host

//Add a new project or update a existing project
exports.addProject = function(req,res){
	var id = req.body.project._id
	var projectObj = req.body.project
	var _project

	if(id){
		Project.findById(id,function(err,project){
			if(err){
				console.log(err)
			}else{
				_project = _.extend(project,projectObj)
				_project.save(function(err,project){
					res.redirect(req.get('referer'))
				})
			}
		})
	}else{
		projectObj.owner = req.session.user._id
		_project = new Project(projectObj)

		_project.save(function(err, project){
			if(err){
				if(err.code == 11000){
					res.send({code: 400, message:"Project name already exists"})
				}else{
					res.send({code: 400})
				}
				console.log(err)
			}else{
				var node=[project.name, project.desc, project.owner, moment(project.meta.createAt).format('YYYY/MM/DD')]
				//res.redirect(req.get('referer'))
				res.send({code:200, message: "Project created successfully"})
			}
		})
	}
}


exports.getProject = function(req,res){
	var _id=req.params.id
	Project
	.findById(_id, function(err, project){
		if(err){
			console.log(err)
		}
		res.send(project)
	})
}

exports.getAllProject = function(req, res){
	var id=req.session.user._id;
	var queryObj={};
	User.findOne({_id: id},function(err,user){
		if(user.role==0){
			queryObj.owner=id
		}
		Project
		.find(queryObj)
		.populate('owner','userName')
		.exec(function(err, projects){
			var _projects=[];
			for(var i in projects){
				var subProject=[{name:projects[i].name,id:projects[i]._id}, projects[i].desc, projects[i].owner.userName, moment(projects[i].meta.createAt).fromNow(),projects[i]._id]
				_projects.push(subProject)
			}
			res.send(_projects)
		})		
	})
}

exports.delProject = function(req,res){
	var id = req.params.id;
	if(id){
		Test
		.find({project:id})
		.exec(function(err,tests){
			if(tests.length>0){
				res.send({code:400, message:"Can not delete non-empty project"})
			}else{
				Project.remove({_id:id},function(err,project){
					res.send({code:200, message:"Deleted successfully"})
				})	
			}
		})
	}else{
		res.end();
	}
}
