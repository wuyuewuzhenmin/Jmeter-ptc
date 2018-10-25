//used by tests page
$(document).ready(function(){
	getCurrentTests();
	getCurrentProject();
	$('#delProject').click(delCurrentProject);
})

function getCurrentTests(){
	$.ajax({
		type: 'GET',
		url: '/test/'+document.location.search
	}).done(function(_tests){
		$('#tabelWrap').html('<table id="datatable3" class="table table-striped dataTable no-footer display responsive nowrap" role="grid" aria-describedby="datatable_info"></table>')
		$('#datatable3').dataTable({
			"order": [[3,'desc']],
			"autoWidth": false,
			"aaData": _tests,
			"aoColumns": [
			{"sTitle": "Test name",
				"render": function(test){
						return '<a class="blue" href="http://'+ document.location.host+'/test.html?testId='+ test.id + '">' + test.name +'</a>'
					}
				},
			{"sTitle": "Owner"},
			//{"sTitle": "Type"},
			{"sTitle": "Users"},
			{"sTitle": "Created At"},
			{"sTitle": "Delete",
				"render": function(id){
					var _id = "'"+id+"'"
					return '<button onclick="delTest('+_id+')" class="btn btn-danger btn-sm" id="'+id+'">Delete</button>'
				}
			}
			]
		})
	})	
}

function getCurrentProject(){
		$.ajax({
			type: 'GET',
			url: '/project/'+document.location.search.split('=')[1],
		}).done(function(project){		
			$('#projectId').val(document.location.search.split('=')[1]);
			$('#project-name').val(project.name);
			$('#project-desc').val(project.desc);
			$('#project-created').text(project.meta.createAt)
		})
}

function delCurrentProject(){
		$.ajax({
			type: 'DELETE',
			url: '/project/'+document.location.search.split('=')[1],
		}).done(function(result){
				if(result.code==200){
		         new PNotify({
		          title: 'Success',
		          text: result.message,
		          type: 'success',
		          styling: 'bootstrap3',
		          addclass: "stack-modal"
		      })
		      setTimeout(function(){window.location.pathname='/'}, 1500);
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

function delTest(id){
	if (confirm('If you delete the test, all the execution history will be deleted too. Are you sure you want to delete the test?')){
		$.ajax({
			type: 'DELETE',
			url:'/test/'+ id
		}).done(function(result){
			if(result.code==200){
				new PNotify({
				  title: 'Success',
		          text: result.message,
		          type: 'success',
		          styling: 'bootstrap3',
		          addclass: "stack-modal"					
				})
				setTimeout(function(){window.location.pathname='/tests.html'}, 1500);
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
	}else{
		return
	}
}