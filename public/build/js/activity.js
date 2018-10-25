$(document).ready(function(){
	$.ajax({
		type: 'GET',
		url: '/activity',
	}).done(function(activities){
		activities.forEach(function(A){
			var _element = $('<li>').html(
				'<div class="block"><div class="block_content"><div class="byline"> <span>'+A.createAt+'</span> <a>'+A.activity.user.userName+'</a></div> <h2 class="title"> '+A.activity.action+' test <a class="blue" href="http://'+document.location.host+ '/test.html?testId='+A.activity.target._id+'">'+A.activity.target.testName+'</a> (<span>'+A.activity.config.users+'</span> virtual users)</h2></div></div>')
			$('.list-unstyled').append(_element)
		})
	})	
	//console.log(activities)
})
