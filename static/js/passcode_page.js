/* Script de la page d'identification */

$.getJSON('/users_list', function (data) {
    var l = data.length;
    for (var e = 0; e < l; e++) {
        if (data[e].userName == "admin") {
            $("#adminUserList").attr('user-id', data[e].userID)
			 $("h3").attr('user-id', data[e].userID)
        } else {
            $("#usersList").append('<div user-id="' + data[e].userID + '"id="childUser">' + data[e].userName + '</div>')
        }
    }
});
$("#slectUser").click(function () {
    $("#usersList").toggle(500)
});
var mode = 'admin';
$("#usersList > div").click(function () {
    var username = $(this).text();
	 $("h3").text($(this).text())
	  $("#usersList").toggle(500)
        $("h3").attr('user-id', $(this).attr('user-id'))
    if (username == 'Admin') {
		mode = 'admin'
		$("#user-input-password").fadeOut(500)
		$("#admin-input-password").fadeIn(500)

    }else{
		mode = 'user'
	$("#admin-input-password").fadeOut(500)
	$("#user-input-password").fadeIn(500)
	}
});
var password = '';
$(".input-button-password").click(function(){
	 $('#paswordValidation').append('<i class="fa fa-circle" aria-hidden="true"></i>').children(':last').hide().fadeIn(500);
	  password += $(this).text()
	   if (password.length == 6) {
		   $('body').append('<form id="sendPost" style="display:none" method="post" action="/connect"><input type="text" name="password" value="'+password+'"><input type="text" name="userID" value="'+ $("h3").attr('user-id')+'"></form>')
       $("#sendPost").submit();
    }
});
var t = setInterval(changeTime, 5000);
function changeTime() {
    var d = new Date();
    var m = d.getMinutes();
    if (m < 10) {
        m = '0' + m;
    }
    $('#current_time').text(d.getHours() + ' : ' + m);
}



$('#backspace-login > svg').on('click', function (event) {

    if (password.length > 0) {
        $("#paswordValidation i:last-child").fadeOut(500).promise().done(function(){
			$("#paswordValidation i:last-child").remove();
		})
        password = password.slice(0, -1);
    }
});
