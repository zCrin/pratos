var addUserBox = 0;
/* TODO :
[]	- bouton sur icone pour editer image
[]	- crééer groupe + admin de groupe pour faire une hierarchie
ajouter les privilèges (héreditaires)
 */
function startUserManager(id) {
    $("#addUserButton").click(function () {

        if (addUserBox) {
            addUserBox.openSetting();
        } else {
            var me = new Settings({
                    target: "#" + id + "_settingsPage",
                    title: "Ajouter un utilisateur",
                    content: "<div class='add_user_box'><div class='flex-edit_user_box'> <div class='input-edit_user_box'> <div class='first-input-edit_user_box'> <div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input placeholder='Pseudo' type='text' id='update_username' spellcheck='false'/> </div></div><div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input type='text' placeholder='Email' id='update_email' spellcheck='false'/></div></div></div></div><div id='passwordChangeTitle'>Mot de passe</div><div class='input-edit_user_box passwordEditBox'><div class='first-input-edit_user_box'> <div class='group-input-edit-box-password'><div class='input-div-box input-edit-username'><input type='password' placeholder='Nouveau' id='update_newPassword' spellcheck='false'/> </div></div><div class='group-input-edit-box-password'> <div class='input-div-box input-edit-username'> <input type='password' placeholder='Confirmer' id='update_confirmPassword' spellcheck='false'/></div></div></div><div id='admin-digicode-input'><input style=' margin-right: 25px;' class='delete_plugin_check' type='checkbox'/>Digicode (mot de passe à 6 chiffres)</div><div id='updatePasswordButton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Créer</div></div></div></div>",
                    onLoad: function (that) {
                        addUserBox = that;
                        $("div[box-id=" + that.id + "]").hide();
                        that.openSetting();
                    },
                    onOpened: function (x) {
                        inputbottombar();
                        new MaterialPlaceholder(MaterialPlaceholderStandard("Pseudo", "#update_username")).load();
                        new MaterialPlaceholder(MaterialPlaceholderStandard("Email", "#update_email")).load();
                        new MaterialPlaceholder(MaterialPlaceholderStandard("Nouveau", "#update_newPassword")).load();
                        new MaterialPlaceholder(MaterialPlaceholderStandard("Confirmer", "#update_confirmPassword")).load();
                        $("#updatePasswordButton").click(function () {
                            var userName = $("#update_username").val();
                            if (userName.trim() != "") {
                                var email = $("#update_email").val();
                                if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase())) {
                                    var isDigit = $("#admin-digicode-input > input").is(':checked');
                                    var newPassword = $("#update_newPassword").val();
                                    if (newPassword != "") {
                                        if (isDigit && newPassword.length == 6 && /^\d+$/.test(newPassword) || !isDigit) {
                                            var newPasswordC = $("#update_confirmPassword").val();
                                            if (newPasswordC == newPassword) {
                                                $.post("/admin_create_user/", {
                                                    username: userName,
                                                    email: email,
                                                    isDigitPassword: isDigit,
                                                    password: newPassword,
                                                    passwordConfirm: newPasswordC
                                                }, function (re) {

                                                    dealResponse(re, function () {

                                                        Snackbar.show({
                                                            text: "Utilisateur créé",
                                                            pos: 'top-center',
                                                            showAction: false
                                                        });
                                                        $("#" + id + "_settingsPage > .settings_menu_button").remove();
                                                        get_users(id, function () {
                                                            $("." + x + "_settingsBack").click();
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
                                                error_input("#update_newPassword", "Les 2 mots de passe ne correspondent pas", 661);
                                                error_input("#update_confirmPassword", "Les 2 mots de passe ne correspondent pas", 661);
                                            }
                                        } else {
                                            error_input("#update_newPassword", "Format digicode invalide", 660);
                                        }
                                    } else {
                                        error_input("#update_newPassword", "Mot de passe vide", 666);
                                    }
                                } else {
                                    error_input("#update_email", "Email invalide", 655);
                                }
                            } else {
                                error_input("#update_username", "Pseudo invalide", 654);
                            }
                        });
                    }
                }).load();
        }
    });

    get_users(id);

}
function get_users(id, callback) {
    $("#" + id + "_settingsPage > .settings_menu_button").remove();
    $.getJSON("/get_userList/", function (res) {
        if (!res.error) {
            var e = res.length;
            for (var f = 0; f < e; f++) {
                var user = res[f];
                var me = new Settings({
                        target: "#" + id + "_settingsPage",
                        title: ((user.icon) ? "<img src='" + user.icon + "' class='user-manage-icon'/>" : "<div class='user-manage-icon' style='background-color:#" + user.userID.substring(0, 6) + ";'></div>") + "<span class='user-manage-username'>" + user.userName + "</span>",
                        boxName: "Modifier profil",
                        content: "<div class='edit_user_box'> <div class='flex-edit_user_box'> <div style='position:relative;'><div class='img-edit_user_box' style='background-color:#" + user.userID.substring(0, 6) + ";'></div><div class='img-edit_user_box-button'><i class='fa fa-pencil' aria-hidden='true'></i><p>Editer</p></div></div><div class='input-edit_user_box'> <div class='first-input-edit_user_box'> <div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input placeholder='Pseudo' f='" + f + "' userID='" + user.userID + "'value='" + user.userName + "'  type='text' id='update_username' spellcheck='false'/> </div></div><div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input value='" + ((user.email) ? user.email : "") + "' type='text' placeholder='Email' id='update_email' spellcheck='false'/> </div></div></div><div class='first-input-edit_user_box'><div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input value='" + ((user.name) ? user.name : "") + "' type='text' placeholder='Nom' id='update_name' spellcheck='false'/> </div></div><div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input value='" + ((user.surname) ? user.surname : "") + "' type='text' placeholder='Prénom' id='update_surname' spellcheck='false'/> </div></div></div><div class='first-input-edit_user_box'> <div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input placeholder='Téléphone' value='" + ((user.phone) ? user.phone : "") + "'  type='text' id='update_phone' spellcheck='false'/> </div></div><div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <div id='input-birthday-userEdit'> <span class='material-input-placeholder-birthday'>Date d'anniversaire</span> <div class='box-input-birthday-userEdit'> <div> <input value='" + ((user.birthdayDay) ? user.birthdayDay : "") + "' placeholder='JJ' type='text' id='date-input-birthday-userEdit'/> </div></div><span class='separator-input-birthday-userEdit'>/</span> <div class='box-input-birthday-userEdit'> <div> <input value='" + ((user.birthdayMonth) ? user.birthdayMonth : "") + "' placeholder='MM' id='month-input-birthday-userEdit' type='text'/> </div></div><span class='separator-input-birthday-userEdit'>/</span> <div id='year-input-birthday-userEdit' class='box-input-birthday-userEdit'> <div> <input type='text' value='" + ((user.birthdayYear) ? user.birthdayYear : "") + "' placeholder='AAAA'/> </div></div></div></div></div></div><div id='updateUserInfoButton' class='material-design-normal-button'  data-ripple='rgba(0,0,0, 0.3)'>Sauvegarder</div></div><div id='passwordChangeTitle'>Mot de passe</div><div class='input-edit_user_box passwordEditBox'> <div class='first-input-edit_user_box'> " + ((f == 0) ? "<div class='group-input-edit-box-password'> <div class='input-div-box input-edit-username'> <input placeholder='Ancien' type='password' id='update_oldPassword' spellcheck='false'/> </div></div>" : "") + "<div class='group-input-edit-box-password'> <div class='input-div-box input-edit-username'> <input type='password' placeholder='Nouveau' id='update_newPassword' spellcheck='false'/> </div></div><div class='group-input-edit-box-password'> <div class='input-div-box input-edit-username'> <input type='password' placeholder='Confirmer' id='update_confirmPassword' spellcheck='false'/> </div></div></div><div id='admin-digicode-input'><input  style='    margin-right: 25px;' class='delete_plugin_check' type='checkbox'>Digicode (mot de passe à 6 chiffres)</div><div id='updatePasswordButton' class='material-design-normal-button'  data-ripple='rgba(0,0,0, 0.3)'>Changer</div></div>" + ((f == 0) ? "" : "<div id='banTitle'>" + ((user.is_banned) ? "Cet utilisateur est verrouillé" : "Cet utilisateur est déverrouillé") + "</div><div class='input-edit_user_box banBox'><div onClick='" + ((user.is_banned) ? "unlockUser()" : "lockUser()") + "' id='UserButton" + ((user.is_banned) ? "Banned" : "Unbanned") + "' class='material-design-normal-button'  data-ripple='rgba(0,0,0, 0.3)'>" + ((user.is_banned) ? "Déverrouiller" : "Verrouiller") + "</div></div>") + ((f == 0) ? "" : "<div id='banTitle'>Supprimer</div><div class='input-edit_user_box deleteBox'><div onClick='deleteUser(" + id + ")' id='UserButtonDelete' class='material-design-normal-button'  data-ripple='rgba(0,0,0, 0.3)'>Supprimer</div></div>") + "</div></div>",
                        onOpened: function (id) {
                            $("#update_username").attr('x', id)
                            inputbottombar();
                            $("#updatePasswordButton").click(function () {
                                var isDigit = $("#admin-digicode-input > input").is(':checked');
                                var newPassword = $("#update_newPassword").val();
                                if (newPassword != "") {
                                    if (isDigit && newPassword.length == 6 && /^\d+$/.test(newPassword) || !isDigit) {
                                        var newPasswordC = $("#update_confirmPassword").val();
                                        if (newPasswordC == newPassword) {
                                            var oldPassword = "";
                                            if ($("#update_username").attr('f') == 0) {
                                                oldPassword = $("#update_oldPassword").val();
                                            }
                                            $.post("/admin_update_userPassword/", {
                                                userID: $("#update_username").attr('userID'),
                                                isDigitPassword: isDigit,
                                                password: newPassword,
                                                passwordConfirm: newPasswordC,
                                                oldPassword: oldPassword
                                            }, function (re) {
                                                dealResponse(re, function () {
                                                    Snackbar.show({
                                                        text: "Mot de passe mis à jour",
                                                        pos: 'top-center',
                                                        showAction: false
                                                    });
                                                });

                                            });
                                        } else {
                                            error_input("#update_newPassword", "Les 2 mots de passe ne correspondent pas", 661);
                                            error_input("#update_confirmPassword", "Les 2 mots de passe ne correspondent pas", 661);
                                        }
                                    } else {
                                        error_input("#update_newPassword", "Format digicode invalide", 660);
                                    }
                                } else {
                                    error_input("#update_newPassword", "Mot de passe vide", 666);
                                }
                            });
                            $("#updateUserInfoButton").click(function () {
                                var userName = $("#update_username").val();
                                if (userName.trim() != "") {
                                    var email = $("#update_email").val();
                                    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase())) {
                                        var phoneVal = $("#update_phone").val();
                                        var phone = "";
                                        if (phoneVal) {
                                            if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phoneVal)) {
                                                phone = phoneVal;
                                            } else {
                                                error_input("#update_phone", "Téléphone invalide", 656);
                                            }
                                        }
                                        var nameVal = $("#update_name").val();
                                        var name = (nameVal != "") ? nameVal : "";
                                        var surnameVal = $("#update_surname").val();
                                        var surname = (surnameVal != "") ? surnameVal : "";
                                        var birthdayDayVal = $("#date-input-birthday-userEdit").val();
                                        var birthdayDay = "";
                                        if (birthdayDayVal) {
                                            if (/^\d+$/.test(birthdayDayVal) && parseInt(birthdayDayVal) <= 31 && birthdayDayVal.length <= 2) {
                                                birthdayDay = (birthdayDayVal.length < 2) ? "0" + birthdayDayVal : birthdayDayVal;
                                            } else {
                                                error_input("#date-input-birthday-userEdit", "Date d'anniversaire invalide", 657);
                                            }
                                        }
                                        var birthdayMonthVal = $("#month-input-birthday-userEdit").val();
                                        var birthdayMonth = "";
                                        if (birthdayMonthVal) {
                                            if (/^\d+$/.test(birthdayMonthVal) && parseInt(birthdayMonthVal) <= 31 && birthdayMonthVal.length <= 2) {
                                                birthdayMonth = (birthdayMonthVal.length < 2) ? "0" + birthdayMonthVal : birthdayMonthVal;
                                            } else {
                                                error_input("#month-input-birthday-userEdit", "Mois d'anniversaire invalide", 658);
                                            }
                                        }
                                        var birthdayYearVal = $("#year-input-birthday-userEdit input").val();
                                        var birthdayYear = "";
                                        if (birthdayYearVal) {
                                            var de = new Date().getFullYear();
                                            if (birthdayYearVal.length == 4 && parseInt(birthdayYearVal) <= de && parseInt(birthdayYearVal) >= (de - 120)) {
                                                birthdayYear = birthdayYearVal;
                                            } else {
                                                error_input("#year-input-birthday-userEdit input", "Année d'anniversaire invalide", 659);
                                            }
                                        }
                                        $.post("/admin_update_user/", {
                                            userID: $("#update_username").attr('userID'),
                                            username: userName,
                                            name: name,
                                            surname: surname,
                                            phone: phone,
                                            email: email,
                                            birthdayDay: birthdayDay,
                                            birthdayMonth: birthdayMonth,
                                            birthdayYear: birthdayYear
                                        }, function (re) {
                                            dealResponse(re, function () {
                                                Snackbar.show({
                                                    text: "Données mises à jour",
                                                    pos: 'top-center',
                                                    showAction: false
                                                });
                                                $("div[box-id=" + id + "] > span").html(userName);
                                            });

                                        });
                                    } else {
                                        error_input("#update_email", "Email invalide", 655);
                                    }
                                } else {
                                    error_input("#update_username", "Pseudo invalide", 654);
                                }
                            });
                            new MaterialPlaceholder(MaterialPlaceholderStandard("Pseudo", "#update_username")).load();
                            new MaterialPlaceholder(MaterialPlaceholderStandard("Nom", "#update_name")).load();
                            new MaterialPlaceholder(MaterialPlaceholderStandard("Email", "#update_email")).load();
                            new MaterialPlaceholder(MaterialPlaceholderStandard("Prénom", "#update_surname")).load();
                            new MaterialPlaceholder(MaterialPlaceholderStandard("Téléphone", "#update_phone")).load();
                            if ($("#update_username").attr('f') == "0") {
                                new MaterialPlaceholder(MaterialPlaceholderStandard("Ancien", "#update_oldPassword")).load();
                            }
                            new MaterialPlaceholder(MaterialPlaceholderStandard("Nouveau", "#update_newPassword")).load();
                            new MaterialPlaceholder(MaterialPlaceholderStandard("Confirmer", "#update_confirmPassword")).load();
                            new MaterialPlaceholder(MaterialPlaceholderStandardBirthday("JJ", "#date-input-birthday-userEdit")).load();
                            new MaterialPlaceholder(MaterialPlaceholderStandardBirthday("MM", "#month-input-birthday-userEdit")).load();
                            new MaterialPlaceholder(MaterialPlaceholderStandardBirthday("AAAA", "#year-input-birthday-userEdit input")).load();
                            var LCDBE = "";
                            $("#date-input-birthday-userEdit").keyup(function () {
                                var d = $(this).val();
                                if (/^\d+$/.test(d) && parseInt(d) <= 31 || d == "") {
                                    LCDBE = d;
                                    if (d.length >= 2) {
                                        LCDBE = d;
                                        $("#month-input-birthday-userEdit").focus()
                                    }
                                } else {
                                    var d = $(this).val(LCDBE);
                                }
                            });
                            var LCDME = "";
                            $("#month-input-birthday-userEdit").keyup(function () {
                                var d = $(this).val();
                                if (/^\d+$/.test(d) && parseInt(d) <= 12 || d == "") {
                                    LCDME = d;
                                    if (d.length >= 2) {
                                        LCDME = d;
                                        $("#year-input-birthday-userEdit input").focus()
                                    }
                                } else {
                                    var d = $(this).val(LCDME);
                                }
                            });
                            var LCDYE = "";
                            $("#year-input-birthday-userEdit input").keyup(function () {
                                var d = $(this).val();
                                var de = new Date().getFullYear();
                                if (/^\d+$/.test(d) || d == "") {
                                    if (d.length == 4) {
                                        if (parseInt(d) > de || parseInt(d) < (de - 120)) {
                                            var d = $(this).val("");
                                        } else {
                                            LCDME = d;
                                        }
                                    } else if (d.length > 4) {
                                        var d = $(this).val(LCDME);
                                    } else {
                                        LCDME = d;
                                    }
                                } else {
                                    var d = $(this).val(LCDME);
                                }
                            }).focusout(function () {
                                var d = $(this).val();
                                var de = new Date().getFullYear();
                                if (d.length == 4) {
                                    if (parseInt(d) > de || parseInt(d) < (de - 120)) {
                                        var d = $(this).val("");
                                    } else {
                                        LCDME = d;
                                    }
                                } else {
                                    var d = $(this).val("");
                                }
                            });
                        }
                    }).load();
            }
        }
        if (callback) {
            return callback();
        }
    });

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
function MaterialPlaceholderStandard(text, target) {
    return {
        text: text,
        target: target,
        empty: "empty-input-userEdit",
        not_empty: "not_empty-input-userEdit"
    }
}
function MaterialPlaceholderStandardBirthday(text, target) {
    return {
        text: text,
        target: target,
        empty: "empty-input-userEditBirthday",
        not_empty: "not_empty-input-userEditBirthday"
    }
}
function lockUser() {
    $.post("/admin_ban_user/", {
        userID: $("#update_username").attr('userID'),
        tries: 4
    }, function (re) {

        dealResponse(re, function () {

            Snackbar.show({
                text: "Utilisateur déverrouillé",
                pos: 'top-center',
                showAction: false
            });
            $("#banTitle").text("Cet utilisateur est verrouillé");
            $('.banBox').html("<div id='UserButtonBanned' class='material-design-normal-button'  onClick='unlockUser()' data-ripple='rgba(0,0,0, 0.3)'>Déverrouiller</div>");
        });
    });
}
function unlockUser() {
    $.post("/admin_unban_user/", {
        userID: $("#update_username").attr('userID')
    }, function (re) {
        dealResponse(re, function () {
            Snackbar.show({
                text: "Utilisateur déverrouillé",
                pos: 'top-center',
                showAction: false
            });
            $("#banTitle").text("Cet utilisateur est déverrouillé");
            $('.banBox').html("<div id='UserButtonUnbanned' class='material-design-normal-button'  onClick='lockUser()' data-ripple='rgba(0,0,0, 0.3)'>Verrouiller</div>");
        });

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
    case "emptyEU":
        error_input("#update_email", "Email et/ou pseudo invalide(s)", 667);
        error_input("#update_username", "Email et/ou pseudo invalide(s)", 667);
        break;
    case "notDigit":
        error_input("#update_newPassword", "Format digicode invalide", 660);
        break;
    case "unmatching":
        error_input("#update_newPassword", "Les 2 mots de passe ne correspondent pas", 661);
        error_input("#update_confirmPassword", "Les 2 mots de passe ne correspondent pas", 661);
        break;
    case "oldPasswordWrong":
        error_input("#update_oldPassword", "L'ancien mot de passe est incorrect", 664);
        break;
    case "empty":
        error_input("#update_newPassword", "Mot de passe vide", 666);
        break;
    }
}
function deleteUser(id) {
    var popupAdd = new MaterialPopup({
            name: "Supprimer",
            content: "<p>Voulez-vous vraiment supprimer cet utilisateur ? <br /> Cette action est définitive et toutes les données de cet utilisateur seront perdues.</p><div id='manageRoomButtonBar'><button id='cancelUserDeletionButton' data-ripple='rgba(0,0,0, 0.3)' class='material-design-normal-button'>Annuler</button><button id='deleteUserValidatebutton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Supprimer</button></div>",
            onLoad: function () {
                $("#cancelUserDeletionButton").click(function () {
                    popupAdd.close()
                });
                $("#deleteUserValidatebutton").click(function () {

                    $.post("/admin_delete_user/", {
                        userID: $("#update_username").attr('userID')
                    }, function (re) {
                        dealResponse(re, function () {
                            Snackbar.show({
                                text: "Utilisateur supprimé",
                                pos: 'top-center',
                                showAction: false
                            });

                            get_users(id, function () {
                                var f = $("#update_username").attr('x');
                                $("." + f + "_settingsBack").click();
                                popupAdd.close();
                            });

                        });

                    });
                });

            }
        });
    popupAdd.load()
}