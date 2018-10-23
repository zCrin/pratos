var addGroupBox = 0, dId, initedLongTapBox = 0, savedGroups;
function startGroupManager(id, callback) {

    dId = id;
    $("#" + id + "_settingsPage > .manage_groupsBox").remove();

    $.getJSON("/get_groupsList/", function (res) {
        if (!res.error) {
            var e = res.length;
            var x = e;
            res[0].subordonnatedTo = null;
            savedGroups = res;
            // var tree = treeify(res, "id", "subordonnatedTo");

            $("#" + id + "_settingsPage").append("<div class='manage_groupsBox'><div class='substrate' substrateid='-1'><span groupId='" + res[0].id + "' data-ripple='rgba(0,0,0, 0.3)' class='groupButtonBoxTree material-shadow-2 material-design-normal-button' groupId='" + res[0].id + "' >" + res[0].name + "</span><div class='substrate substrateHidden'  style='height:0px' substrateid='" + res[0].id + "'></div></div></div>");
            var styleBox = "<style>";
            for (var d = 1; d < e; d++) {
                if (d == e - 1) {
                    setTimeout(
                        function () {
                        if (callback) {
                            callback();
                        }
                    }, 1000);
                }
                var style = "background-color:" + ((res[d].subordonnatedTo != "0") ? "#" + res[d].subordonnatedTo.substring(res[d].subordonnatedTo.length - 6) + "; color:" + ((res[d].subordonnatedTo != "0" && !is_light(res[d].subordonnatedTo.substring(res[d].subordonnatedTo.length - 6), "hex") ? "white" : "black")) : "blueviolet; color: white;")
                    if ($(".manage_groupsBox div[substrateid='" + res[d].subordonnatedTo + "']").length) {

                        if ($("div[substrateid='" + res[d].subordonnatedTo + "'] > .groupButtonBoxTree").length) {
                            $("div[substrateid='" + res[d].subordonnatedTo + "']  .groupButtonBoxTree:first-child").after("<span data-ripple='rgba(0,0,0, 0.3)' class='material-shadow-2 material-design-normal-button groupButtonBoxTree substrateHiddenB' dependsOf='" + res[d].subordonnatedTo + "'groupId='" + res[d].id + "'   >" + res[d].name + "</span>");

                        } else {

                            $("div[substrateid='" + res[d].subordonnatedTo + "']").append("<span data-ripple='rgba(0,0,0, 0.3)' class='material-shadow-2 material-design-normal-button groupButtonBoxTree substrateHiddenB' dependsOf='" + res[d].subordonnatedTo + "'groupId='" + res[d].id + "' >" + res[d].name + "</span>");
                        }
                        styleBox += ".groupButtonBoxTree[groupid = \"" + res[d].id + "\"]:not(.disabledGrouptButton){ " + style + "}";
                        $("div[substrateid='" + res[d].subordonnatedTo + "']").append("<div style='height:0px' class='substrate substrateHidden' substrateid='" + res[d].id + "'></div>");

                    } else {

                        if (e - x < 1000) {
                            res[e] = res[d];
                            e++;
                        } else {
                            console.log(res[d])
                        }
                    }

            }

            $("body").append(styleBox + "</style>")
            $(".groupButtonBoxTree:not(.disabledGrouptButton)").click(reveal);
            $(".disabledGrouptButton").click(hidePrevious);
            $(".groupButtonBoxTree").longTap({
                onStartDelay: 0,
                timeout: 1000,

                preventSelect: true,
                mouseEvents: true,
                touchEvents: true,
                preventContext: true,
                onReject: longTapPopupEdit,
                onSuccess: longTapPopupEdit,
                onEnd: (event, self) => {
                    if (initedLongTapBox) {
                        setTimeout(function () {
                            $("#manageGrouptmButtonBar").animate({
                                'opacity': 1
                            }, 500);

                            initedLongTapBox = 0;
                        }, 500);
                    } else {
                        initedLongTapBox = 0;
                    }

                },
            });

        }
    });

}
var isRevealed = {}

function reveal(id, callback) {

    var id = (id.length) ? id : $(this).attr("groupid");
    var that = $(".groupButtonBoxTree[groupid='" + id + "']");
    if (isRevealed[id]) {

        $("div[substrateid=" + id + "]").animate({
            height: "0px"
        }, 500);
        setTimeout(function () {

            $("div[substrateid=" + id + "]").toggleClass('substrateVisible substrateHidden') //.css('display','none');


            $('html, body').clearQueue().animate({
                scrollTop: $("span[groupId=" + id + "]").offset().top
            }, 2000);

        }, 50)
        $("div[substrateid=" + that.parent().attr("substrateid") + "] > .disabledGrouptButton").unbind("click", hidePrevious).bind("click", reveal)
        $("div[substrateid=" + that.parent().attr("substrateid") + "] > .groupButtonBoxTree").not(".groupButtonBoxTree[groupid='" + id + "']").removeClass("disabledGrouptButton");
        isRevealed[id] = false;
    } else {

        $("div[substrateid=" + that.parent().attr("substrateid") + "] > .groupButtonBoxTree").not(".groupButtonBoxTree[groupid='" + id + "']").addClass("disabledGrouptButton");
        $("div[substrateid=" + that.parent().attr("substrateid") + "] > .disabledGrouptButton").unbind("click", reveal).bind("click", hidePrevious)

        isRevealed[id] = true;

        $("div[substrateid=" + id + "]").show(500);
        setTimeout(function () {

            autoHeightAnimate($("div[substrateid=" + id + "]"), 500)

            $("div[substrateid=" + id + "]").toggleClass('substrateVisible substrateHidden') //.css('display','none');
            $('html, body').clearQueue().animate({
                scrollTop: $("div[substrateid=" + id + "]").offset().top
            }, 2000);
            if (callback) {
                callback();
            }
        }, 50);
    }
    $("div[substrateid=" + id + "] > .groupButtonBoxTree").toggleClass('substrateVisibleB substrateHiddenB');

}

function treeify(list, idAttr, parentAttr, childrenAttr) {
    if (!idAttr)
        idAttr = 'id';
    if (!parentAttr)
        parentAttr = 'parent';
    if (!childrenAttr)
        childrenAttr = 'children';

    var treeList = [];
    var lookup = {};
    list.forEach(function (obj) {
        lookup[obj[idAttr]] = obj;
        obj[childrenAttr] = [];
    });
    list.forEach(function (obj) {
        if (obj[parentAttr] != null) {
            lookup[obj[parentAttr]][childrenAttr].push(obj);
        } else {
            treeList.push(obj);
        }
    });
    return treeList;
};

function MaterialPlaceholderStandard(text, target) {
    return {
        text: text,
        target: target,
        empty: "empty-input-userEdit",
        not_empty: "not_empty-input-userEdit"
    }
}
function error_input(target, text, help) {
    $(target).css({
        borderColor: 'red',
        color: 'red'
    }).focusin(function () {
        $(this).css({
            borderColor: 'lightgrey',
            color: 'black'
        })
    });
    Snackbar.show({
        text: text,
        pos: 'top-center',
        showAction: true,
        actionText: "Aide",
        actionTextColor: 'red',
        onActionClick: function () {
            getHelp(help)
        }
    });
}
function dealResponse(resp, trueF, defaultF) {
    switch (resp) {
    case "true":
        trueF();
        break;
    case "Unauthorized access":
        Snackbar.show({
            text: "Seul l'admin peut réaliser cette action",
            pos: 'top-center',
            showAction: true,
            actionText: "Aide",
            actionTextColor: 'red',
            onActionClick: function () {
                getHelp(663)
            }
        });
        break;
    case "Not connected":
        window.location = "/";
        break;
    case "emptyGroupName":
        error_input("#group_name", "Nom invalide", 668);
        break;
    default:
        if (defaultF) {
            defaultF();
        } else {
            Snackbar.show({
                text: "Erreur lors de la modification",
                pos: 'top-center',
                showAction: true,
                actionText: "Aide",
                actionTextColor: 'red',
                onActionClick: function () {
                    getHelp(662);
                }
            });
        }
        break;

    }
}
function autoHeightAnimate(element, time) {
    var curHeight = element.height(), // Get Default Height
    autoHeight = element.css('height', 'auto').height(); // Get Auto Height
    element.height(curHeight); // Reset to Default Height
    element.stop().animate({
        height: autoHeight
    }, time).promise().done(function () {
        element.css('height', 'auto')
    }) // Animate to Auto Height
}
function hidePrevious() {
    $(this).siblings().not(".disabledGrouptButton").click();
    var id = $(this).attr("groupid");
    setTimeout(function () {
        reveal(id);
    }, 500);
}
function longTapPopupEdit(event, self) {

    var groupId = $(self).attr('groupId')
        var popupUpdate = new MaterialPopup({
            name: $(self).text(),
            content: "<div id='manageGrouptmButtonBar'><button id='updateGroupButton' data-ripple='rgba(0,0,0, 0.3)' class='material-design-normal-button'><i class='fa fa-cog' aria-hidden='true'></i> Modifier</button><button id='showusersGroupButton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'><i class='fa fa-users'></i> Voir utilisateurs</button><button id='addGroupButton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'><i class='fa fa-plus' aria-hidden='true'></i> Ajouter un groupe</button></div>",
            onLoad: function () {
                initedLongTapBox = 1;
                var h = groupId;
                var f = [];
                while (h) {
                    if (h != '-1') {
                        f.push(h)
                    }
                    h = $("span[groupId=" + h + "]").parent().attr('substrateid');

                }
                $("#updateGroupButton").click(function (id) {

                    var popupAdd = new MaterialPopup({
                            name: "Modifier le groupe",

                            content: '<div class="add_group_box"><div class="input-div-box input-name-group"><input type="text" placeholder="Nom du groupe" id="group_name" spellcheck="false"></div><div id=\'manageRoomButtonBar\'><div id=\'deleteGroupButton\' data-ripple=\'rgba(0,0,0, 0.3)\' class=\'material-design-normal-button\'>Supprimer</div><div id=\'updateGroupInfoButton\' class=\'material-design-normal-button\' data-ripple=\'rgba(0,0,0, 0.3)\'>Créer</div></div></div>',
                            onLoad: function () {

                                new MaterialPlaceholder({
                                    text: "Nom du groupe",
                                    target: "#group_name"
                                }).load();
                                $("#deleteGroupButton").click(function () {
                                    if (has_child(groupId) || has_users(groupId)) {
                                        Snackbar.show({
                                            text: "Groupe non vide",
                                            pos: 'top-center',
                                            showAction: true,
                                            actionText: "Aide",
                                            actionTextColor: 'red',
                                            onActionClick: function () {
                                                getHelp(670);
                                            }
                                        })
                                    } else {
                                        var popupDelete = new MaterialPopup({
                                                name: "Supprimer",
                                                content: "<p>Voulez-vous vraiment supprimer ce groupe ? <br /> Cette action est définitive et toutes les données de cet utilisateur seront perdues.</p><div id='manageRoomButtonBar'><button id='cancelUserDeletionButton' data-ripple='rgba(0,0,0, 0.3)' class='material-design-normal-button'>Annuler</button><button id='deleteUserValidatebutton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Supprimer</button></div>",
                                                onLoad: function () {
                                                    $("#cancelUserDeletionButton").click(function () {
                                                        popupAdd.close()
                                                    });
                                                    $("#deleteUserValidatebutton").click(function () {

                                                        $.post("/admin_delete_group/", {
                                                            groupId: groupId
                                                        }, function (r) {
                                                            dealResponse(r, function () {
                                                                Snackbar.show({
                                                                    text: "Groupe supprimé",
                                                                    pos: 'top-center',
                                                                    showAction: false
                                                                });
                                                            }, function () {
                                                                Snackbar.show({
                                                                    text: "Groupe non vide",
                                                                    pos: 'top-center',
                                                                    showAction: true,
                                                                    actionText: "Aide",
                                                                    actionTextColor: 'red',
                                                                    onActionClick: function () {
                                                                        getHelp(670);
                                                                    }
                                                                })
                                                            });
                                                        });

                                                    });
                                                }
                                            });
                                        popupDelete.load();
                                    }
                                });
                            }
                        });

                    popupAdd.load();
                });
                $("#addGroupButton").click(function (id) {

                    var popupAdd = new MaterialPopup({
                            name: "Créer un groupe dépendant",

                            content: "<div class='add_group_box'><div class=\"input-div-box input-name-group\"><input type=\"text\" placeholder=\"Nom du groupe\" id=\"group_name\" spellcheck=\"false\"></div><div id='updatePasswordButton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Créer</div></div>",
                            onLoad: function () {

                                new MaterialPlaceholder({
                                    text: "Nom du groupe",
                                    target: "#group_name"
                                }).load();

                                $("#updatePasswordButton").click(function () {
                                    var name = $("#group_name").val();
                                    if (name.trim() != "") {

                                        $.post("/admin_create_group/", {
                                            name: name,
                                            subordonnatedTo: groupId
                                        }, function (re) {
                                            popupAdd.close();
                                            popupUpdate.close();
                                            dealResponse(re, function () {

                                                startGroupManager(dId, function () {
                                                    isRevealed = {};

                                                    revealD(f, (f.length - 1));

                                                });
                                                Snackbar.show({
                                                    text: "Groupe créé",
                                                    pos: 'top-center',
                                                    showAction: false
                                                });

                                            }, function () {

                                                Snackbar.show({
                                                    text: "Erreur lors de la création",
                                                    pos: 'top-center',
                                                    showAction: true,
                                                    actionText: "Aide",
                                                    actionTextColor: 'red',
                                                    onActionClick: function () {
                                                        getHelp(666);
                                                    }
                                                });

                                            });
                                        });

                                    } else {
                                        error_input("#group_name", "Nom invalide", 668);
                                    }
                                });

                            }
                        });
                    popupAdd.load();
                });
            }
        });
    popupUpdate.load();
}
function revealD(f, n) {
    if (n != -1) {
        reveal(f[n].toString())
        setTimeout(function () {
            revealD(f, (n - 1))
        }, 500);
    }
}
function has_child(id) {
    for (var e = savedGroups.length; e--; ) {
        if (savedGroups[e].subordonnatedTo == id) {
            return true;
        }
    }
    return false;
}
function has_users(id) {

    $.getJSON("/get_userList/", function (res) {
        for (var e = res.length; e--; ) {
            if (res[e].groupId == id) {
                return true;
            }
        }
        return false;
    });
}
