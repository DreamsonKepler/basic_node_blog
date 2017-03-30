$(document).ready(function(){
    $('button').on('click', function(event) {
        event.preventDefault()
        var input = $("#comment").val()
        $("#comment").val('')
        $.post('/comment', {comment: input}, function(data) {
            console.log('logging data')
            console.log(data);
            $('#commentbox').append('<p>' + data.comment  + '</p>')
        })
    })
   
});
