var Config = require('../models/config');
var app = require('../../app')
var _ = require('underscore');
var moment = require('moment');
var fs  = require('fs');
var path = require('path');


exports.addConfig = function(req,res,next){
		var configObj=req.body.config
	//handle rampup and duration conversion
		if (configObj.rampup){
			configObj.rampup *=60;
		}

		if (configObj.duration){
			configObj.duration *=60;
		}		


		var id = configObj._id
		var _config

	if(id){
		Config.findById(_id,function(err,config){
			_config = _.extend(config,configObj)
			_config.save(function(err,config){
		    	next()	
			})
		})
	}else{
		_config= new Config(configObj)
		_config.save(function(err,config){
			if(err){
				console.log(err)
				next()
			}
		    req.body.test.configId=config._id;
		    next()		
		}
	)}
}

exports.getConfig = function(req, res){
	var _id=req.params.id
	Config
	.findById(_id,function(err,config){
		if(err){console.log(err)}
			res.send(config)
	})
}

exports.getAllConfig = function(req,res){
	Config
	.find({})
	.exec(function(err, configs){
		if(err){console.log(err)}
		res.send(configs)
	})
}


