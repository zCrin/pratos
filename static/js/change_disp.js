
$('.material-button').click(function () {
    if ($('.material-button >i').hasClass('fa-list')) {
        localStorage.setItem('accessoriesDisplay', 'list');
        $('#all_accessories').css('flex-direction', 'column');
        form_display = 'accessory-buttons_list';
        $('.accessory-buttons').addClass("accessory-buttons_list");
        $('.accessory-buttons img').css('margin', '0');
    } else {
        localStorage.setItem('accessoriesDisplay', 'block');
        $('#all_accessories').css('flex-direction', 'row');
        form_display = '';
        $('.accessory-buttons').removeClass("accessory-buttons_list");
        $('.accessory-buttons img').css('margin', '1% auto 3% auto');
        setTimeout(function () {
            $(window).resize()
        }, 500);

    }
    $('.material-button >i').toggleClass('fa-list fa-th')
});
$(window).resize(function () {

    if ($('.material-button >i').hasClass('fa-list')) {
        $('.accessory-buttons > span').css('font-size', $('.accessory-buttons').width() / 5.5);

    }
})
var showed_options = true,
h2_color,
closed = true;

$(document).on('accessoriesLoaded', function (e) {
    var y = localStorage.getItem('accessoriesDisplay');

    switch (y) {
    case 'list':
        $('.material-button >i').addClass('fa-list')
        $('.material-button >i').removeClass('fa-th')

        $('.material-button').trigger('click');
        break;
    default:
        $('.material-button').trigger('click');
        break;
    }
});
