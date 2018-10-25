var User = require('../app/controllers/user')
var Task = require('../app/controllers/task')
var Project = require('../app/controllers/project')
var Activity = require('../app/controllers/activity')
var Test = require('../app/controllers/test')
var Config = require('../app/controllers/config')

module.exports = function(app){
	//user prehandling 
	// app.use(function(req,res,next){
	// 	var _user = req.session.user
	// 	//for debug use
	// 	console.log('Current user\'s session ' )
	// 	console.log(req.session)
	// 	app.locals.user = _user
	// 	next()
	// })




	app.post('/signin',User.signin)
	app.post('/signup',User.signup)

	//Check user session
	app.use(User.signinRequired);

	//user prehandleing
	app.use(function(req,res,next){
		var _user=req.session.user
			app.locals.user=_user
			next()	
	})


	//index page
	app.get('/',function(req,res){
		res.redirect('/index.html')
	})


	app.get('/logout',User.logout)

	//used when $(document).ready(), redirect to login page if user not login 
	app.get('/session/user',User.sessionUser)


	//Task Operation
	app.get('/task',Task.getAllTask)
	app.post('/task',Task.addTask)

	//Project Operation
	app.get('/project',Project.getAllProject)
	app.get('/project/:id', Project.getProject)
	app.post('/project',Project.addProject)
	app.delete('/project/:id',Project.delProject)

	//Test Operation
	app.get('/test',Test.getAllTest)
	app.get('/test/:id',Test.getTest)
	app.post('/test',Config.addConfig,Test.addTest,Activity.addAcctivity)
	app.post('/updateTest',Config.addConfig,Test.updateTest,Activity.addAcctivity)
	app.post('/reExcTest',Test.reExcTest,Task.addTask)
	app.post('/upload',Test.uploadCase)
	app.delete('/test/:id',Test.delTest)

	//Activity operation
	app.get('/activity',Activity.getAllActivity)

	//config
	app.get('/config',Config.getAllConfig)
	app.get('/config/:id',Config.getConfig)

	//no matched route rule
	app.use(function(req,res){
		res.redirect('/page_404.html')
	})
}

