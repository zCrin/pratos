function startSytleManager() {

    var global_color = $("h2").css("color");
    var background_color = $("body").css("background-color");
    $('#cp8_container').colorpicker({
        color: global_color,
        inline: true,
        container: true,
        useAlpha: false,
        format: "rgba"
    }).on('colorpickerChange colorpickerCreate', function (e) {

        $("h1,h2, #open-nav-button, .closebtn, .colored, #menu-step-back").css('color', e.color.toRgbString());
        $("header,  .settings_menu_button, .colored").css('border-color', e.color.toRgbString());

        $("#logo").css('fill', e.color.toRgbString());
        $('#nav').addClass('full-nav').promise().done(function () {
            $(".full-nav").css('border-color', e.color.toRgbString()).promise().done(function () {
                $('#nav').removeClass('full-nav');
            });
        });
    });
    $('#cp9_container').colorpicker({
        color: background_color,
        inline: true,
        container: true,

        format: "rgba",
        useAlpha: false,

    }).on('colorpickerChange colorpickerCreate', function (e) {
        $('#nav').addClass('full-nav').promise().done(function () {
            $(".full-nav").css('background-color', e.color.toRgbString()).promise().done(function () {
                $('#nav').removeClass('full-nav');
            });
        });

        $("html,body").css('background-color', e.color.toRgbString());
        $("#nav .not_colored").css('color', e.color.toRgbString());

    });

}
$("#resetNewColors").click(function () {
    $('#cp9_container').colorpicker('setValue', "#350E00");
    $('#cp8_container').colorpicker('setValue', "#05FEFF");
});
$("#saveNewColors").click(function () {
    $.post('/change_style/', {
        mainColor: $('#cp8_container').data('colorpicker').color.toRgbString(),
        secondColor: $('#cp9_container').data('colorpicker').color.toRgbString()
    }, function (res) {
        if (res = 'reload') {
            location.reload();
        }
    });

});
