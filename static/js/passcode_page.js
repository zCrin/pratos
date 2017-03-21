/* Script de la page d'identification */

var t = setInterval(changeTime, 5000); 
function changeTime(){
	var d = new Date();
	var m = d.getMinutes();
	if(m < 10){
		m = '0' + m;
	}
	$('#current_time').text(d.getHours() + ' : ' + m);
}

var password = '';
$('button').on('click touchstart', function(event){
if(event.handled === false) return
        event.stopPropagation();
        event.preventDefault();
        event.handled = true;
	$('#password_state').append(' <i class="fa fa-circle" aria-hidden="true"></i>');
	password += $(event.target).text();
	if(password.length == 6){
		$('#password').val(password);
		$('#validate').submit();
	}
});

$('#delete_n').on('click touchstart', function(event){
if(event.handled === false) return
        event.stopPropagation();
        event.preventDefault();
        event.handled = true;
	if(password.length > 0){
		$("#password_state i:last-child").remove();
		password =password.slice(0, -1);
	}
});