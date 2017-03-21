$('#display_list').click(function(){
$('#all_accessories').css('flex-direction', 'column');
form_display = 'accessory-buttons_list';
$('.accessory-buttons').addClass("accessory-buttons_list");
$('.accessory-buttons img').css('margin', '0');

});
$('#display_block').click(function(){
$('#all_accessories').css('flex-direction', 'row');
form_display = '';
$('.accessory-buttons').removeClass("accessory-buttons_list");
$('.accessory-buttons img').css('margin', '1% auto 3% auto');

});
var showed_options = true,
	h2_color,
closed = true;
$('#show_options').click(function(){

h2_color = $('#all_acch2').css('color');
$('h2').css('color', 'white').promise().done(function(){
$('#change_disp').toggleClass('hide_options show_options');

$('#change_dispo').toggle(1000);
showed_options = false;
$('#hide_options').show();
$('#show_options').hide();
});

});
$('#hide_options').click(function(){
$('#hide_options').hide();
$('#show_options').show();
$('#change_dispo').hide(1000, function(){
$('#change_disp').toggleClass('hide_options show_options');
showed_options = true;
$('#all_acch2').css('color', h2_color);
});
});