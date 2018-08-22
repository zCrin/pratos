
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
//select material design class
var MaterialSelect = function (obj) {
    this.build(obj)
}
MaterialSelect.prototype.build = function (obj) {
    this.select = obj
}
MaterialSelect.prototype.load = function () {
    var that = this;
    var Select = this.select;
    var target = $(Select.target);
    if (Select.selected) {
        var parameters = (Select.options[Select.selected].parameters) ? Select.options[Select.selected].parameters : "";
        target.html("<span " + parameters + " class='material-design-selected'>" + Select.options[Select.selected].text + "</span><i class='material-design-selected fa fa-caret-down'></i>")
    } else {
        target.html("<span class='material-design-selected'>" + Select.name + "</span><i class='material-design-selected fa fa-caret-down'></i>")
    }

    target.addClass('material-select')
    that.selectOpt(Select.selected)
    target.click(function () {
        $(this).attr('tabindex', "0")
        $('.material-input-focus').remove()
        $('<hr class="material-input-focus">').insertAfter($(this)).promise().done(function () {
            $('.material-input-focus').addClass('material-input-focus-scale');
            $("[selected-placeholderID='" + Select.name + "']").css('color', $('h1').css('color'))
            var options = '';
            var h = Select.options.length;
            for (var d = 0; d < h; d++) {
                var x = Select.options[d];
                options += "<div id='options-list-" + d + "' " + x.parameters + "><span>" + x.text + "</span><i class='fa fa-caret-right'></i></div>";
            }
            $("body").append("<div class='material-select-background'  id='material-select-bck-" + Select.name + "'data-ripple='rgba(0,0,0, 0.3)'></div><div id='material-select-" + Select.name + "' class='material-selct material-shadow-2'><span class='material-select-title'>" + Select.name + "</span>" + options + "</div>")

            $('.material-selct').animate({
                left: "50%"
            }, 200)
            $('.material-select-background').animate({
                height: "100%"
            }, 200)
            if (Select.loaded) {
                Select.loaded();
            }
            $("#material-select-bck-" + Select.name).click(function () {
                that.close(function () {
                    if (Select.earlyLeave) {
                        Select.earlyLeave();
                    }
                });
            });
            $('.material-selct >div').click(function () {
                var nb = $(this).attr('id').replace('options-list-', '');

                that.selectOpt(nb);
                that.close(function () {
                    if (Select.onSelect) {
                        Select.onSelect(nb);
                    }
                });
            });
        });

    })
}

$('h2').css('top', (-20) - (parseFloat($('#open-nav-button').css('padding-bottom').replace('px', ''))) / 2 + 'px');
$(window).resize(function () {
    $('h2').css('top', (-20) - (parseFloat($('#open-nav-button').css('padding-bottom').replace('px', ''))) / 2 + 'px');
});
MaterialSelect.prototype.close = function (callback) {
    var Select = this.select;
    var target = $(Select.target);
    $("[selected-placeholderID='" + Select.name + "']").css('color', 'grey')
    $('#material-select-bck-' + Select.name).animate({
        top: "100%",
        height: "0px"
    }, 200);
    $('#material-select-' + Select.name).css({
        left: "200%"
    })
    $('.material-input-focus').toggleClass('material-input-focus-scale material-input-focus-unscale');
    $(window).resize()
    setTimeout(function () {
        $('#material-select-' + Select.name).remove()
        $('#material-select-bck-' + Select.name).remove()
        if (Select.earlyLeave) {
            Select.earlyLeave();
        }
    }, 1000);

}
MaterialSelect.prototype.selectOpt = function (nb) {
    var Select = this.select;
    Select.selected = nb;
    if (Select.options[Select.selected] && Select.options[Select.selected].text && Select.options[Select.selected].text != "") {
        $(Select.target).html("<span " + Select.options[nb].parameters + " class='material-design-selected material-design-option''>" + Select.options[nb].text + "</span><i class='material-design-selected fa fa-caret-down'></i>")
        var marginTop = ($("[selected-placeholderID='" + Select.name + "']").css('margin-top')) ? $("[selected-placeholderID='" + Select.name + "']").css('margin-top') : $(Select.target).css('margin-top');

        $("[selected-placeholderID='" + Select.name + "']").remove()
        $('<span selected-placeholderID="' + Select.name + '"style="margin-top:' + marginTop + '"class="material-select-placeholder">' + Select.name + '</span>').insertBefore($(Select.target))
        $(Select.target).css('margin-top', '0')
    }
}
MaterialSelect.prototype.destroy = function () {
    delete this;
}
//Material Popup
MaterialPopup = function (obj) {
    this.build(obj)

}
MaterialPopup.prototype.build = function (obj) {
    this.Popup = obj;
    this.id = Date.now();
}
MaterialPopup.prototype.load = function () {
    $("html, body").animate({
        scrollTop: 0
    }, "slow")
    var that = this;
    var name = (this.Popup.name) ? "<span class='material-popup-title '>" + this.Popup.name + "</span>" : "";

    $('body').append("<div class='material-popup-background' popupBckID='" + this.id + "'data-ripple='rgba(0,0,0, 0.3)'></div><div class='material-popup material-shadow-2' popupID='" + this.id + "'>" + name + this.Popup.content + "</div>")
    $("[popupID='" + this.id + "']").animate({
        left: "50%"
    }, 200)
    $("[popupBckID='" + this.id + "']").animate({
        height: "100%"
    }, 200)

    if (this.Popup.onLoad) {
        this.Popup.onLoad();
    }
    $("[popupBckID='" + this.id + "']").click(function () {
        that.close();
    });
}
MaterialPopup.prototype.close = function () {
    var that = this;

    $("[popupBckID='" + that.id + "']").animate({
        top: "100%",
        height: "0px"
    }, 200);

    $("[popupID='" + that.id + "']").css({
        left: "200%"
    })
    if (that.Popup.onExit) {
        that.Popup.onExit();
    }

    $(window).resize();
    setTimeout(function () {
        $("[popupID='" + that.id + "']").remove();
        $("[popupBckID='" + that.id + "']").remove();
    }, 1000);
}
var noPla = 0;
MaterialPlaceholder = function (obj) {
    this.build(obj)
}
MaterialPlaceholder.prototype.build = function (obj) {
    this.Placeholder = obj;
	noPla++;
    this.id =noPla;
}
MaterialPlaceholder.prototype.load = function () {
    var that = this;
    var Placeholder = this.Placeholder;
    var target = Placeholder.target;
    this.marginTop = $(target).css('margin-top');

    if ($(target).val() != "") {
        $(target).css('margin-top', '0')
        $('<span theplaceholderID="' + this.id + '"style="color:grey;margin-top:' + this.marginTop + '"class="material-input-placeholder">' + Placeholder.text + '</span>').insertBefore($(target).parent()).promise().done(function () {

            $('body').append("<style input-placeholder-style='" + that.id + "'>" + target + "::placeholder {color:white;}</style>");

        });

    } else {
        if (Placeholder.empty) {
            if (Placeholder.not_empty) {
                $(target).parent().removeClass(Placeholder.not_empty);
            }
            $(target).parent().addClass(Placeholder.empty);
        }
    }
    $(target).focusin(function () {
        if (Placeholder.not_empty) {
            $(target).parent().removeClass(Placeholder.empty);
            $(target).parent().addClass(Placeholder.not_empty);
        }
        $("[theplaceholderID='" + that.id + "']").remove();
        $(target).css('margin-top', '0')
        $('<span theplaceholderID="' + that.id + '"style="margin-top:' + that.marginTop + '"class="material-input-placeholder">' + Placeholder.text + '</span>').insertBefore($(target).parent()).promise().done(function () {
            $(target).attr('placeholderID', that.id)
            $('body').append("<style input-placeholder-style='" + that.id + "'>" + target + "::placeholder {color:white;}</style>");
            $("[theplaceholderID='" + that.id + "'").css('color', $('h1').css('color'))
        });
    });
    $(target).blur(function () {

        if ($(target).val() != "") {
            $("[theplaceholderID='" + that.id + "']").remove();
            $(target).css('margin-top', '0')
            $('<span theplaceholderID="' + that.id + '"style="color:grey;margin-top:' + that.marginTop + '"class="material-input-placeholder">' + Placeholder.text + '</span>').insertBefore($(target).parent()).promise().done(function () {
                $(target).attr('placeholderID', that.id)
                $('body').append("<style input-placeholder-style='" + that.id + "'>" + target + "	::placeholder {color:white;}</style>");

            });

        } else {

            $("[input-placeholder-style='" + that.id + "']").remove();

            $(target).css('margin-top', $("[theplaceholderID='" + that.id + "'").css('margin-top'))

            $("[theplaceholderID='" + that.id + "'").hide('1000', function () {
                $(this).remove();

                if (Placeholder.empty) {
                    if (Placeholder.not_empty) {
                        $(target).parent().removeClass(Placeholder.not_empty);
                    }
                    $(target).parent().addClass(Placeholder.empty);

                }

            });
        }
    })

}
