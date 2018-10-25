var User = require('../models/user');

//signin
exports.signin = function(req,res){
	var _user = req.body.user
	var email = _user.email
	var password = _user.password

	User.findOne({email: email},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			res.send({msg: "user doesn\'t exist", code: 500})
			return
		}

		user.comparePassword(password, function(err, isMatch){
			if(err){
				console.log(err)
			}

			if(isMatch){
				req.session.user = user;
				res.send({code:200, msg:'login successfully'})
			}else{
				res.send({msg: "Password does\'t match", code: 500})
			}
		})
	})
}


//user signup
exports.signup = function(req,res){
	var _user = req.body.user

	User.find({},function(err,users){
	//Set first user's role to 1 (super user)
		if(users.length==0){
			_user.role=1;
			//console.log(_user)
		}
	})

	User.find({email: _user.email},function(err,user){
		if(err){
			console.log(err)
		}
		if(user.length >0){
			res.send({msg: "email already exist", code: 500})
			return 
		}else{
			var user = new User(_user)
			user.save(function(err,user){
				if(err) console.log(err)
					res.send({msg: "resgistration succeed", code: 201})
			})
		}
	})
}

//logout 
exports.logout = function(req,res){
	delete req.session.user
	res.redirect('/login.html')
}

//sessionUser
exports.sessionUser = function(req,res){
	if(!req.session.user){
		res.send({msg: "error msg", code: 400})
	}else{
		res.send({name:req.session.user.userName})
	}
	
}

//customized middleware, handle permission check
exports.signinRequired = function(req, res, next){
	var user = req.session.user
	if(!user){
		return res.send({msg: "not authorized", code: 400})
	}
	next()
}

exports.adminRequired = function(req, res, next){
	var user = req.session.user

	if(user.role < 10){
		return res.redirect('/login.html#signup')
	}
	next()
}