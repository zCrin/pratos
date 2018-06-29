
var toSay = {
    'password': {
        text: 'Mot de passe invalide',
        action: 'Perdu',
        onActionClick: function () {
            redirect('askPassword')
        }
    },
    'Session expired': 'La session a expiré',
    'sessionDoesntExistAnymore': 'La session a expiré',
    'user': 'Utilisateur invalide',
    'banned': {
        text: 'Utilisateur banni',
        action: 'Aide',
        onActionClick: function () {
            getHelp(301)
        }
    },
    'disconnected': 'Déconnecté',
    'alreadyDisconnected': 'Déjà déconnecté',
    'addedAllowed': {
        text: 'Appareil autorisé',
        action: 'Aide',
        color: 'lightgreen',
        onActionClick: function () {
            getHelp(306)
        }
    },
    'removedAllowed': {
        text: 'Appareil désautorisé',
        action: 'Aide',
        color: 'lightgreen',
        onActionClick: function () {
            getHelp(306)
        }
    },
    'connect_autoOK': {
        text: 'Connexion automatique réussie',
        action: 'Aide',
        color: 'lightgreen',
        onActionClick: function () {
            getHelp(307)
        }
    },
};

if (toSay[message]) {
    if (!toSay[message].action) {
        Snackbar.show({
            text: toSay[message],
            pos: 'top-center',
            showAction: false
        });
    } else {
        Snackbar.show({
            text: toSay[message].text,
            pos: 'top-center',
            showAction: true,
            actionText: toSay[message].action,
            actionTextColor: ((toSay[message].color) ? toSay[message].color : 'red'),
            onActionClick: toSay[message].onActionClick
        });
    }

}
function getHelp(nb) {
    alert(nb)
}
function redirect(page) {
    alert(page)
}
jQuery(function ($) {

    // MAD-RIPPLE // (jQ+CSS)
    $(document).on("mousedown touchstart", "[data-ripple]", function (e) {

        var $self = $(this);

        if ($self.is(".btn-disabled")) {
            return;
        }
        if ($self.closest("[data-ripple]")) {
            e.stopPropagation();
        }

        var initPos = $self.css("position"),
        offs = $self.offset(),
        x = e.pageX - offs.left,
        y = e.pageY - offs.top,
        dia = Math.min(this.offsetHeight, this.offsetWidth, 100), // start diameter
        $ripple = $('<div/>', {
                class: "ripple",
                appendTo: $self
            });

        if (!initPos || initPos === "static") {
            $self.css({
                position: "relative"
            });
        }

        $('<div/>', {
            class: "rippleWave",
            css: {
                background: $self.data("ripple"),
                width: dia,
                height: dia,
                left: x - (dia / 2),
                top: y - (dia / 2),
            },
            appendTo: $ripple,
            one: {
                animationend: function () {
                    $ripple.remove();
                }
            }
        });
    });

});

function popup(content, callback) {
    $('.material-popup').remove();
    $('.material-popup-background').remove();
    $('body').append("<div class='material-popup-background'data-ripple='rgba(0,0,0, 0.3)' onClick='popup_close()'></div><div class='material-popup material-shadow-2'>" + content + "</div>")
    $('.material-popup').animate({
        left: "50%"
    }, 200)
    $('.material-popup-background').animate({
        height: "100%"
    }, 200)
    if (callback) {
        callback();
    }
}
function popup_close() {
    $('.material-popup-background').animate({
        top: "100%",
        height: "0px"
    }, 200);
    $('.material-popup').css({
        left: "200%"
    })

}

function inputbottombar() {
    $('input').blur(function () {
        $('.material-input-focus').toggleClass('material-input-focus-scale material-input-focus-unscale');
    });
    $('input').focusin(function () {
    

            $(this).attr('tabindex', "0")
            $('.material-input-focus').remove()
            $('<hr class="material-input-focus">').insertAfter($(this)).promise().done(function () {

                $('.material-input-focus').addClass('material-input-focus-scale');

            });

    })
}

var nb = 0;
function inputplaceholder() {
    setTimeout(function () {
        $("input[placeholder]").each(function () {
            $(this).focusin().blur();

        });
    }, 500);
    $("input[placeholder]").focusin(function () {
        var t = $(this);
        var marginTop = t.css('margin-top')
            t.css('margin-top', '0')
            var id = t.attr('placeholderID')
            if (!id) {
                nb++;
                id = nb;
                t.attr('placeholderID', id)
                var placeholder = t.attr('placeholder')

                    $('<span theplaceholderID="' + id + '"style="margin-top:' + marginTop + '"class="material-input-placeholder">' + placeholder + '</span>').insertBefore($(this).parent()).promise().done(function () {
                        $('body').append("<style input-placeholder-style='" + id + "'>input[placeholderID='" + id + "']::placeholder {color:white;}</style>");

                    });
            }
            if (t.val() != "") {
                $("[theplaceholderID='" + id + "'").css('color', $('h1').css('color'))
            } else {
                var placeholder = t.attr('placeholder')

                    $('<span theplaceholderID="' + id + '"style="margin-top:' + marginTop + '"class="material-input-placeholder">' + placeholder + '</span>').insertBefore($(this).parent()).promise().done(function () {
                        $('body').append("<style input-placeholder-style='" + id + "'>input[placeholderID='" + id + "']::placeholder {color:white;}</style>");

                    });
            }

            t.css('margin-top', '0')
            t.blur(function () {
                console.log('is not focused')
                if (t.val() != "") {
                    $("[theplaceholderID='" + id + "'").css('color', 'grey')
                    console.log('has text')
                } else {
                    console.log('has no text')

                    $("[input-placeholder-style='" + id + "']").remove();

                    t.css('margin-top', $("[theplaceholderID='" + id + "'").css('margin-top'))
                    $("[theplaceholderID='" + id + "'").hide('1000').remove();
                }
            })

    })

}

function is_light() {
    var rgb = $('body').css('background-color').match(/\d+/g);
    var e = rgbToHsl(rgb[0], rgb[1], rgb[2])
        if (e[2] >= 0.85) {
            $('.is_lighttext').css('color', 'grey')
            $('.is_lightborder').css('border-color', 'grey')
            console.log('Too light')
        }
}
function rgbToHsl(r, g, b) {
    r /= 255,
    g /= 255,
    b /= 255;

    var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
    var h,
    s,
    l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = (b - r) / d + 2;
            break;
        case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
    }

    return [h, s, l];
}
