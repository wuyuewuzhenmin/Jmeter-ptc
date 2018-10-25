//Task control. Start/Monitor/Kill JMeter, update database status
var fs = require('fs')
var SSH = require('simple-ssh')
var Task = require('../models/task')
var Test = require('../models/test')
var Config = require('../models/config')
var child_process = require('child_process')

var moment = require('moment')


//Read confirguration from config.json
var configObj = JSON.parse(fs.readFileSync(__dirname + '/../../config/config.json', 'utf8'))

//new SSH connection to execute case located on another server
/*var SSHObj = {
    host: configObj.targetMachine.host,
    user: configObj.targetMachine.user,
    pass: configObj.targetMachine.pass
}

//Execute a jmx case located on another server using SSH
function startTask(doc){
	
	var name
	var id=doc._doc._id
	var configString=" "
	var configItems=['host','users','rampup','iteration']
	
	Test
	.findById(doc.testId,function(err,test){
		name=test._doc.caseName
	})

	Config
	.findById(doc.configId,function(err,config){
		configItems.forEach(function(c){
			if(config._doc[c]){
				configString += '-J'+c+'='+config[c]+' '
			}
		})

	var ssh = new SSH(SSHObj)	
	ssh
	.exec(' bash /usr/PTC/start.sh ' + id + ' ' + name + configString,{
		out: function(pId){
		if(pId){
			doc.status=2
			doc.pId = parseInt(pId)
			doc.meta.startAt = Date.now()
			doc.save(function(err, doc){
					if (err){
						console.log(err)
					} 
				})
			}},
		exit: function(code){
			//retry 10 times, if task still can't be executed successfully, set status to 5 unknown
			if(doc.retry < 10){
				// console.log(doc.retry)
				doc.retry+=1
				doc.save()
			}else{
				doc.status = 5
				doc.meta.endAt = Date.now()
				doc.save(function(err, doc){
					console.log('start task failed, error code is: ')
					console.log(code)
				})
			}
		}	
		}).start()
	})				
}
*/

//Execute a test located on localserver
function startTask(doc){
	
	var name
	var id=doc._doc._id
	var configString=" "
	var configItems=['host','port','users','rampup','iteration','duration']
	
	Test
	.findById(doc.testId,function(err,test){
		name=test._doc.caseName
	})
	Config
	.findById(doc.configId,function(err,config){
		configItems.forEach(function(c){
			if(config._doc[c]){
				configString += '-G'+c+'='+config[c]+' '
			}
		})

	var remoteHosts="" || process.env.slaves

	console.log('/opt/PTC/app/bashScripts/start.sh '+id+' '+name+' '+remoteHosts+' '+configString);
	var cp = child_process.exec('/opt/PTC/app/bashScripts/start.sh '+id +' '+name+' '+remoteHosts+' '+configString);
	cp.stdout.on('data', (data) => {
		  var pId=parseInt(data); 
		  if(!isNaN(pId)){
		    console.log(`Remote test starts, PID is: ${data}`);

		    //remove ondata listner to avoid performance issue
		    cp.removeListener('data',()=>{})

			doc.status=2
			doc.pId = pId
			doc.meta.startAt = Date.now()
			doc.save(function(err, doc){
					if (err){
						console.log(err)
					}
		 		})
			}
		});

	cp.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`);
	});

	cp.on('close', (code) => {
	  console.log(`cp closed with code: ${code}`);
		if(code===0 && doc.meta.startAt){
			doc.status = 3
			doc.meta.endAt = Date.now()
			doc.save()
		}else{
		//If task is not executed as expected, retry up to 5 times
			if(doc.retry < 5){
				// console.log(doc.retry)
				doc.retry+=1
				doc.save()
			}else{
				doc.status = 5
				doc.meta.endAt = Date.now()
				doc.save(function(err, doc){
					console.log('start task failed, error code is: ')
					console.log(code)
				})
			}					
		}
	})
	})				
}

//unfortunately there is no command provided by JMeter to stop remote server
function killTask(doc){
	var ssh = new SSH(SSHObj)
	ssh
	.exec('kill -9 '+doc.pId,{
		exit: function(code){
			if(code ===1){
				doc.status = 5
				doc.meta.endAt = Date.now()
				doc.save()
			}else{
				doc.meta.endAt = Date.now()
				doc.save()
			}
		},
		out:function(result){
			console.log('time\'s up, kill task' )
			doc.meta.endAt = Date.now()
			doc.save()
	}}).start()
}

// Below functions will be invoked in interval loop 

// if there are pending tasks, execute it accordingly Status: 1 pending, 2 running, 3 finished, 4 killed, 5 unknown
exports.execTask = function(){

	var runningTasks;
	Task.find({status:2}).count(function(err,count){
		if(err){
			console.log(err)
		}else{
			runningTasks=count
				var maxConTasks = configObj.maxConTasks;
			if(runningTasks<maxConTasks){
				Task
				.find({status:1})
				.sort({'meta.recordAt':'desc'})
				.limit(1)
				.exec(function(err, tasks){
					var _task = tasks[0]
					if(_task){
						startTask(_task)		
					}
				})
			}else{
				return
			}
		}
	})
}



//kill expired tasks
exports.killExpired = function(){
	//read maximum duration (min *60*1000-> s) time from config file
	//var maxDurTime = configObj.maxDurTime*60*1000
	Task
	.find({status:2})
	.exec(
		function(err,tasks){
			if(err){
				console.log(err)
			}
			tasks.forEach(function(t){
				Config
				.findById(t.configId,function(err,config){
					var duration = Date.now()-t.meta.startAt.getTime()
					if(duration>=config.duration*60*1000){
						t.status = 4
						t.save(function(err){
							if(err){
								console.log(err)
							}
							killTask(t)
						})
					}				
				})
			})
		})
	}

//Finish task
/*exports.FinishTask = function(){
	Task
	.find({status:2})
	.exec(
		function(err, tasks){
			if(err){
				console.log(err)
			}
			tasks.forEach(function(t) {
				if(t.pId){
					var ssh = new SSH(SSHObj)
					ssh
					.exec('ps -p '+t.pId+' -o s=',{
						exit: function(code) {
							if (code === 1) {
								//console.log('exit code ==1, PID does\'t exist. Task has finished')
								t.status = 3
								t.meta.endAt = Date.now()
								t.save()
							}		
						},
						out: function(result){
							// console.log('task is still running')
							// console.log(result)
						}
					}).start()					
				}
			})
		}
	)
}*/