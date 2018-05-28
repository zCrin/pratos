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

        $("h1,h2, #nav .fa-bars, #nav .closebtn, #nav .colored, #menu-step-back").css('color', e.color.toRgbString());
        $("header,  .settings_menu_button,#nav .colored").css('border-color', e.color.toRgbString());
        $(".settings_pagebox input:checked").css('background-color', e.color.toRgbString());
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
$("#resetColors").click(function () {
    $('#cp9_container').colorpicker('setValue', "#350E00");
    $('#cp8_container').colorpicker('setValue', "#05FEFF");
});
$("#saveColors").click(function () {

    var colorSet = 0;
    var socket = io.connect("//" + document.domain, {
            secure: true
        });
    var lastReceived;
    var nC = $('#cp8_container').data('colorpicker').color.toRgbString();
    var nO = $('#cp9_container').data('colorpicker').color.toRgbString();
    socket.on('connect', function (data) {
        if (!colorSet) {

            socket.emit('updateCSSRequest', nC, nO);
            $("#styleBox button").hide(1000);
            $("#flexStyle").html("<div id='progressbar'></div> <div id='styleState'>Chargement...<br /> Cela peut prendre quelques minutes. </div>");
            $("#progressbar").progressbar({
                value: false
            });
            $("#progressbar").find(".ui-progressbar-value").css("background-color", nC);
            socket.on('disconnect', function () {
                alert('eror socket disconnected');
            });

            socket.on('ping', function (data) {
                socket.emit('pong');

            });
            socket.on('updateCSSERROR', function (x) {
                alert(x);
            });
            socket.on('updateCSS', function (ans, step) {
                setInterval(function () {
                    socket.emit('updateCSSRECONNECTION');
                }, 1000);
                setTimeout(function () {
                    alert("Quelque chose a disfonctionné");
                    location.reload();
                }, 360000);

                if (step == 6) {
                    socket.emit('updateCSSConfirm');
                    setTimeout(function () {
                        location.reload();
                    }, 2000);

                }

                colorSet = 1;
            });
        }
    });
});
