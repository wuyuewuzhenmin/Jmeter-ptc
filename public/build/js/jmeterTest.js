//used by JMeter test page (pressTesting.html)
$(document).ready(function(){

	$('#launchTest').click(commitTest);
	$('#saveTest').click(checkParams);
	showTasks();
	showProjects();
})


//check if all mandantory params are provided before submit test
function checkParams(e){
	$('#eTime').text($("#overideDuration").val());
	$('#eUser').text($("#overideUser").val())

	if($('#testBasic').parsley().validate()){
		if($("input[name='caseName']").val()){
			return
		}else{
			e.stopPropagation()
			new PNotify({
	          title: 'Error',
	          text: 'Please upload a JMeter case first',
	          type: 'error',
	          styling: 'bootstrap3',
	          addclass: "stack-modal"
	      })
		}
	}else{
		e.stopPropagation()
	}
}

//submit a test to server
function commitTest(){
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
	var test= ["caseName","testName","caseSize","caseOriginName"]
	test.forEach(function(c){
		var inputVal=$("input[name="+c+"]").val()
		if(inputVal){
		testObj[c]=inputVal			
		}
	})
	testObj.project=$("select[name='project'] option:selected" ).attr("id")

	var dataObj={"config":configObj,"test":testObj}

	//send ajax to server
	$.ajax({
		contentType: 'application/json',
		type: 'POST',
		url: '/test',
		data:JSON.stringify({"test":testObj,"config":configObj})
	}).done(function(result){
         new PNotify({
          title: 'Success',
          text: 'Test has been added, you can track execution status in below',
          type: 'info',
          styling: 'bootstrap3',
          addclass: "stack-modal"
      })

		setTimeout(function(){addTask(result)},1500)

	})
}

//get available projects and show in dropdown list
function showProjects(){
	//to get all projects from server side
	$.ajax({
		type: 'GET',
		url: '/project',
	}).done(function(projects){
		projects.forEach(function(p){
			$("select[name='project']").append( "<option id=" + p[0].id + ">" + p[0].name + "</option>" )
		})
	})
}

//get all test execution records also known as tasks
function showTasks(){
	$.ajax({
		type: 'GET',
		url: '/task'
	}).done(function(_tasks){
		$('#tabelWrap').html('<table id="datatable2" class="table table-striped table-bordered dataTable no-footer display responsive nowrap" role="grid" aria-describedby="datatable_info"></table>')
		$('#datatable2').dataTable({
			"order": [[2,'desc']],
			"autoWidth": false,
			"aaData": _tasks,
			"aoColumns": [
			{"sTitle": "Test name",
				"render": function(test){
						return '<a class="blue" href="http://'+ document.location.host+'/test.html?testId='+ test._id + '">' + test.testName +'</a>'
					}			
			},
			{"sTitle": "Commit By"},
			{"sTitle": "StartTime",
				"render": function(startTime){
					if(startTime == "Invalid date"){
						return '---'
					}else{
						return startTime
					}
				}
			},
			
			{"sTitle": "End Time",
				"render": function(endTime){
					if(endTime == "Invalid date"){
						return '---'
					}else{
						return endTime
					}
				}
			},
			{"sTitle": "Status"},
			{"sTitle": "Report",
				"render": function(Id){
					return '<a class="blue" target="_blank" href="http://'+ document.location.host+'/logs/'+Id +'/dashboard/index.html">log</a>'
					}
				}
			]
		})
	})
}

//Add a task, means test is executed for once
function addTask(obj){
		$.ajax({
			contentType: 'application/json',
			type: 'POST',
			url: '/task',
			data:JSON.stringify(obj)
		}).done(function(task){
			//console.log(task)
			//$('#datatable2').dataTable().fnAddData(task)
			window.location.pathname="/pressTesting.html"
		})
	}