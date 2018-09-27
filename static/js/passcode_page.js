/* Script de la page d'identification */
var password = '';
var alwaysConnectedId = localStorage.getItem('alwaysAllowedId');
if (alwaysConnectedId) {
    $.post('/connect_permanent', {
        id: alwaysConnectedId
    }, function (resp) {
        switch (resp) {
        case "bannedUser":
            Snackbar.show({
                text: "Auto-connection : utilisateur banni",
                pos: 'top-center',
                showAction: true,
                actionText: "aide",
                actionTextColor: 'red',
                onActionClick: function () {
                    getHelp(303)
                }
            });
			window.history.pushState("", "", '/');
            break;
        case "Devicemismatch":
            localStorage.setItem('alwaysAllowedId', "");
            Snackbar.show({
                text: "Auto-connection : erreur de sécurité",
                pos: 'top-center',
                showAction: true,
                actionText: "aide",
                actionTextColor: 'red',
                onActionClick: function () {
                    getHelp(304)
                }
            });
			window.history.pushState("", "", '/');
            break;
        case "sessiondoesntexist":
            localStorage.setItem('alwaysAllowedId', "");
			window.history.pushState("", "", '/');
            break;
        default:
            window.location.replace(resp);
			break;
        }
    });
}
var mode = 'admin';
$.getJSON('/users_list', function (data) {
    var l = data.length;
    for (var e = 0; e < l; e++) {
        if (e == 0) {
            $("#usersList").append('<div id="adminUserList" isDigit="' + data[e].isDigit + '"user-id="' + data[e].userID + '">' + data[e].userName + '</div>')
        } else {
            $("#usersList").append('<div isDigit="' + data[e].isDigit + '"user-id="' + data[e].userID + '"class="childUser">' + data[e].userName + '</div>')
        }
    }
    var userIDOld = localStorage.getItem('userID');
    if (userIDOld) {
        selectUser($("div[user-id='" + userIDOld + "']"), true)
    }
    $("#usersList > div").click(function () {
        selectUser($(this));
    });
});
$("#slectUser").click(function () {
    $("#usersList").toggle(500)
});
function selectUser(selector, opt) {
    var username = $(selector).text();
    $("h3").text(username);
	if (!opt) {
        $("#usersList").toggle(500)
    }
    localStorage.setItem('userID', $(selector).attr('user-id'));
    $("h3").attr('user-id', $(selector).attr('user-id'))
	if ($(selector).attr('isDigit') == 'true') {
        mode = 'admin';
		$("#user-input-password").fadeOut(500).promise().done(function () {
                $("#admin-input-password").fadeIn(500)
				password = "";
				reset_position();
            });
    } else {
        mode = 'user' 
		$("#admin-input-password").fadeOut(500).promise().done(function () {
                $("#user-input-password").fadeIn(500)
				reset_position();
                inputbottombar()
            });
    }
}
$(".input-button-password").click(function () {
    $('#paswordValidation').append('<i class="fa fa-circle" aria-hidden="true"></i>').children(':last').hide().fadeIn(500);
    password += $(this).text()
	if (password.length == 6) {
        $('body').append('<form id="sendPost" style="display:none" method="post" action="/connect"><input type="text" name="password" value="' + password + '"><input type="text" name="userID" value="' + $("h3").attr('user-id') + '"></form>')
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
        $("#paswordValidation i:last-child").fadeOut(500).promise().done(function () {
            $("#paswordValidation i:last-child").remove();
        })
		password = password.slice(0, -1);
    }
});
$('.button-send-user-password').click(function (e) {
    $('body').append('<form id="sendPost" style="display:none" method="post" action="/connect"><input type="text" name="password" value="' + $("#userPassword").val() + '"><input type="text" name="userID" value="' + $("h3").attr('user-id') + '"></form>')
	$("#sendPost").submit();
});
