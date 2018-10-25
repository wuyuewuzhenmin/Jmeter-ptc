$(document).ready(showProjecs)

function showProjecs(){
	$.ajax({
		type: 'GET',
		url: '/project'
	}).done(function(_pro){
		$('#tabelWrap').html('<table id="datatable6" class="table table-striped dataTable no-footer display responsive nowrap" role="grid"></table>')
		$('#datatable6').dataTable({

			"autoWidth": false,
			"aaData": _pro,
			"aoColumns": [
			{"sTitle": "Project Name",
				"render": function(obj){
					return '<a class="blue" href="http://'+ document.location.host+'/tests.html?projectId='+obj.id + '">' +obj.name +'</a>'
				}
			},
			{"sTitle": "Description"},
			{"sTitle": "owner"},
			{"sTitle": "Created At"},
			{"sTitle": "Delete",
					"render": function(id){
					var _id = "'"+id+"'"
					return '<button onclick="delProject('+_id+')" class="btn btn-danger btn-sm" id="'+id+'">Delete</button>'
				}
			}
			]
		})
	})
}

$('#addProject').submit(function(e){
	if(! $('#addProject').parsley().validate()){
		return
	}else{
	    $.ajax({
	        type: "POST",
	        url: "/project",
	        data: $(this).serialize(),
	        success: function(results){
	            if(results.code ===200){
	                new PNotify({
	                      title: 'Success',
	                      text: results.message,
	                      type: 'success',
	                      styling: 'bootstrap3',
	                      addclass: "stack-modal"
	                  })
	               // alert(results.msg)
	                //setTimeout(function(){document.location.pathname= '/'},1500)
	                //setTimeout(function(){location.reload()},1500)
	                $('.close').click();
	                showProjecs()
	            }else{
	                new PNotify({
	                      title: 'Error',
	                      text: results.message,
	                      type: 'error',
	                      styling: 'bootstrap3',
	                      addclass: "stack-modal"
	                  })
	            }
	        }
	    })
	    return e.preventDefault()
	}
})

function delProject(id){
		$.ajax({
			type: 'DELETE',
			url: '/project/'+id,
		}).done(function(result){
				if(result.code==200){
		         new PNotify({
		          title: 'Success',
		          text: result.message,
		          type: 'success',
		          styling: 'bootstrap3',
		          addclass: "stack-modal"
		      })
		      //setTimeout(function(){location.reload()},1500)
	                showProjecs()
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