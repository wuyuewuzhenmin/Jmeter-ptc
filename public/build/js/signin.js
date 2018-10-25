$(document).ready(function(){
   //login request 
    $('#login').submit(function(e){

        $.ajax({
            type: "POST",
            url: "/signin",
            data: $(this).serialize(),
            success: function(results){
                if(results.code ===200){
                    new PNotify({
                          title: 'Success',
                          text: results.msg,
                          type: 'success',
                          styling: 'bootstrap3',
                          addclass: "stack-modal"
                      })
                   // alert(results.msg)
                    setTimeout(function(){document.location.pathname= '/'},1500)
                }else{
                    new PNotify({
                          title: 'Error',
                          text: results.msg,
                          type: 'error',
                          styling: 'bootstrap3',
                          addclass: "stack-modal"
                      })
                }
            }
        })
        return e.preventDefault()
    })
})

$(document).ready(function(){
    //signup request
     $('#register').submit(function(e){

        $.ajax({
            type: "POST",
            url: "/signup",
            data: $(this).serialize(),
            success: function(results){
                if(results.code===201){
                    new PNotify({
                          title: 'Success',
                          text: results.msg,
                          type: 'success',
                          styling: 'bootstrap3',
                          addclass: "stack-modal"
                      })
                    setTimeout(function(){document.location.hash=''},1500)
                }else{
                    new PNotify({
                          title: 'Error',
                          text: results.msg,
                          type: 'error',
                          styling: 'bootstrap3',
                          addclass: "stack-modal"
                      })
                }
            }
        })
        return e.preventDefault()
    })    
})