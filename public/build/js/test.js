$(document).ready(function(){
	$.ajax({
		type: 'GET',
		url: '/task/'+document.location.search
	}).done(function(_tasks){
		$('#tabelWrap').html('<table id="datatable4" class="table table-striped dataTable no-footer no-header display responsive nowrap" role="grid" aria-describedby="datatable_info"></table>')
		$('#datatable4').dataTable({  
			"autoWidth": false,
			"aaData": _tasks,
			"order": [[2,'desc']],
			"aoColumns": [
			{"sTitle": "Test Name",
				"render": function(task){
					return '<a class="blue" target="_blank" href="http://'+ document.location.host+'/logs/'+task.id +'/dashboard/index.html">'+task.name+'</a>'
				}
			},
			{"sTitle": "Users"},
			{"sTitle": "Start Time",
				"render":function(startTime){
					if(startTime == "Invalid date"){
						return '---'
					}else{
						return startTime
					}
				}
			}
			]
		})
	})


	$('#launchTest').click(excuteTest)
	$('#delete').click(deleteTest)
	$('#update').click(function(e){
		if(checkNewParams(e)){
			updateTest()
		}
	})
	getTestDetail()
})

//re-excute a test, means to add a task base on current test's setting
function excuteTest(){
	var obj={}
	var testId = document.location.search.split('=')[1]
	obj.testId = testId
		$.ajax({
			contentType: 'application/json',
			type: 'POST',
			url: '/reExcTest',
			data:JSON.stringify(obj)
		}).done(function(result){
			if(result.code==400){
		         new PNotify({
		          title: 'Error',
		          text: result.message,
		          type: 'error',
		          styling: 'bootstrap3',
		          addclass: "stack-modal"
		      })
			}else{window.location.pathname="/test.html"}			
			//$('#datatable2').dataTable().fnAddData(task)			
	})
}

function getTestDetail(){
	$.ajax({
		type: 'GET',
		url: '/test/'+document.location.search.split('=')[1],
	}).done(function(test){
		if(test.length>0){
		//$('#datatable2').dataTable().fnAddData(task)
		$('#testName').text(test[0].testName)
		$("input[name='testName']").val(test[0].testName)
		$("input[name='caseName']").val(test[0].caseName)
		$("select[name='project']").append( "<option id=" + test[0].project._id + ">" + test[0].project.name + "</option>" )
		existingCase(test[0].caseOriginName, test[0].caseSize)
		getConfigDetail(test[0].configId)
	}else{
		$(".btn").prop("disabled",true)
	}
	})
}

//below function is to display existing case of current test
function existingCase(name, size){
	if(name){
		
		var myDropzone = Dropzone.forElement("#caseUpdate")
		// Create the mock file:
		//discut because it cause some UI issue: var mockFile = { name: caseName, size: 12345 }
		//discut becuse it only work on Chrome: var mockFile = new File([""], name,{type: "text/plain", lastModified: Date.now()})
		var blob = new Blob(["",{type: "text/plain"}])
		blob["lastModifiedDate"]=Date.now();
		blob["name"]=name;
		var mockFile=blob

		// Call the default addedfile event handler. myDropzone is defined in dropzone.js line 1484
		myDropzone.emit("addedfile", mockFile);

		// Make sure that there is no progress bar, etc...
		myDropzone.emit("complete", mockFile);

		//Manually change file size, as it's a read-only attribute, can't be faked
		if(size/1000 >1000){
			str = Math.round(size/100000)/10 + ' MB'
		}else{
			str = Math.round(size/100)/10 + ' KB'
		}

		$('.dz-size').html('<span data-dz-size=""><strong>'+str+'</strong></span>')


		// If you use the maxFiles option, make sure you adjust it to the
		// correct amount:
		// var existingFileCount = 1; // The number of files already uploaded
		// myDropzone.options.maxFiles = myDropzone.options.maxFiles - existingFileCount;
		
		myDropzone.files.push(mockFile)
		//myDropzone.removeEventListeners()
	}
}

function getConfigDetail(id){
	$.ajax({
		type: 'GET',
		url: '/config/'+id
	}).done(function(config){

		if(config.rampup){
			config.rampup /=60;
		}

		if(config.duration){
			config.duration /=60;
		}

		$('#eTime').text(config.duration);
		$('#eUser').text(config.users)		
		$("input[name='host']").val(config.host)
		$("input[name='port']").val(config.port)
		// $("input[name='users']").val(config.users)
		// $("input[name='rampup']").val(config.rampup)
		// $("input[name='duration']").val(config.duration)
		// $("input[name='iteration']").val(config.iteration)
		// $("input[name='configId']").val(config._id)

        $("#overideUser").ionRangeSlider({
          type: "single",
          min: 1,
          max: 100,
          from: config.users,
          //to: 50,
          max_interval: 50
        });

        $("#overideRampup").ionRangeSlider({
          type: "single",
          min: 0,
          max: 120,
          from: config.rampup,
          //to: 50,
          max_interval: 1
        });

        $("#overideIteration").ionRangeSlider({
          type: "single",
          min: 1,
          max: 100,
          from: config.iteration,
          //to: 50,
          max_interval: 1
        });

        $("#overideDuration").ionRangeSlider({
          type: "single",
          min: 0,
          max: 120,
          from: config.duration,
          //to: 50,
          //disable: true,
          max_interval: 120
        })
	})
}


function checkNewParams(e){
	if($('#testBasic').parsley().validate()){
		if($("input[name='caseName']").val()){
			return true
		}else{
	         new PNotify({
	          title: 'Error',
	          text: 'Please upload a JMeter case first',
	          type: 'error',
	          styling: 'bootstrap3',
	          addclass: "stack-modal"
	      })			
			return false
		}
	}else{
		return false
	}	
}

//submit a test to server
function updateTest(){
	//construct config object
	var configObj={}
	var config=["host","port","users","rampup","duration","iteration"]

	config.forEach(function(c){
		var inputVal=$("input[name="+c+"]").val()
		if(inputVal && inputVal !=0){
			configObj[c]=inputVal			
		}
	})

	//constuct test object
	var testObj={}
	var test= ["caseName","testName"]
	testObj._id = window.location.search.split('=')[1]
	
	test.forEach(function(c){
		var inputVal=$("input[name="+c+"]").val()
		if(inputVal){
		testObj[c]=inputVal			
		}
	})

	var dataObj={"config":configObj,"test":testObj}

	//send ajax to server
	$.ajax({
		contentType: 'application/json',
		type: 'POST',
		url: '/updateTest',
		data:JSON.stringify({"test":testObj,"config":configObj})
	}).done(function(result){

		if(result.code==200){
			new PNotify({
			  title: 'Success',
	          text: result.message,
	          type: 'success',
	          styling: 'bootstrap3',
	          addclass: "stack-modal"					
			})
			setTimeout(function(){window.location.pathname='/test.html'}, 1500);
		}else{
			new PNotify({
			  title: 'Error',
	          text: result.message,
	          type: 'error',
	          styling: 'bootstrap3',
	          addclass: "stack-modal"					
			})				
		}		
	})
}

function deleteTest(){
	var testId = document.location.search.split('=')[1]
	if (confirm('If you delete the test, all the execution history will be deleted too. Are you sure you want to delete the test?')){
		$.ajax({
			type: 'DELETE',
			url:'/test/'+testId
		}).done(function(result){
			if(result.code==200){
				new PNotify({
				  title: 'Success',
		          text: result.message,
		          type: 'success',
		          styling: 'bootstrap3',
		          addclass: "stack-modal"					
				})
				setTimeout(function(){window.location.pathname='/test.html'}, 1500);
			}else{
				new PNotify({
				  title: 'Error',
		          text: result.message,
		          type: 'error',
		          styling: 'bootstrap3',
		          addclass: "stack-modal"					
				})				
			}		
			//alert(result.message)
		})
	}else{
		return
	}
}

