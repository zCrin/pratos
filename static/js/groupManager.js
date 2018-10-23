var addGroupBox = 0;
function startGroupManager(id) {
	
    get_groups(id);
    $("#addUserButton").click(function () {

        if (addGroupBox) {
            addGroupBox.openSetting();
        } else {
            var me = new Settings({
                    target: "#" + id + "_settingsPage",
                    title: "Créer un groupe",
                    content: "<div class='add_user_box'><div class='flex-edit_user_box'><div class='input-edit_user_box'><div class='first-input-edit_user_box'><div class='group-input-edit-box'><div class='input-div-box input-edit-username'><input placeholder='Nom du groupe' type='text' id='group_name' spellcheck='false' /></div></div><div id='selectGroupUpper'><div id='selectGroupUpperTarget'></div></div></div><div id='updatePasswordButton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Créer</div></div></div></div>",
                    onLoad: function (that) {
                        addGroupBox = that;
                        $("div[box-id=" + that.id + "]").hide();
                        that.openSetting();
                    },
                    onOpened: function (x) {

                        var selectObj = {
                            name: "Subordonné à",
                            target: "#selectGroupUpperTarget",
                            selected: 0,

                            options: []
                        };
                        $.getJSON("/get_groupsList/", function (groups) {
                            if (!groups.error) {

                                t = groups.length;
                                var newSelect;
                                for (var e = 0; e < t; e++) {
                                    var groupSelected = '';
                                    if (e == 0) {
                                        groupSelected = ' selected="selected" ';

                                    }

                                    selectObj.options.push({
                                        parameters: 'nb="' + e + '" ' + groupSelected + ' groupid="' + groups[e]["id"] + '"',
                                        text: groups[e].name
                                    })

                                    if (e == t - 1) {
                                        newSelect = new MaterialSelect(selectObj);
                                        newSelect.load();
										  inputbottombar();

                        new MaterialPlaceholder(MaterialPlaceholderStandard("Nom du groupe", "#group_name")).load();

                        $("#updatePasswordButton").click(function () {
                            var name = $("#group_name").val();
                            if (name.trim() != "") {
                                var groupId = (newSelect.select.selected && groups[newSelect.select.selected]) ? groups[newSelect.select.selected]['id'] : '0';
                                $.post("/admin_create_group/", {
                                    name: name,
                                    subordonnatedTo: groupId
                                }, function (re) {

                                    dealResponse(re, function () {

                                        Snackbar.show({
                                            text: "Groupe créé",
                                            pos: 'top-center',
                                            showAction: false
                                        });
                                        $("#" + id + "_settingsPage > .settings_menu_button").remove();
                                        get_groups(id, function () {
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
                                error_input("#group_name", "Nom invalide", 668);
                            }
                        });
                  
                                    }

                                }
                            }
                        });

                        }
                }).load();
        }

    });
}
function get_groups(id, callback) {
    $("#" + id + "_settingsPage > .settings_menu_button").remove();
    $.getJSON("/get_groupsList/", function (res) {
        if (!res.error) {
            var e = res.length;
            console.log(res)
            for (var f = 0; f < e; f++) {
                var group = res[f];
                var me = new Settings({
                        target: "#" + id + "_settingsPage",
                        title: "<div class='user-manage-icon' style='background-color:" + ((f == 0) ? "red" : "#" + group.id.substring(0, 6)) + ";'></div><span class='user-manage-username'>" + group.name + "</span>",
                        boxName: "Modifier groupe",
                        content: "<div class='add_user_box'><div class='flex-edit_user_box'><div class='input-edit_user_box'><div class='first-input-edit_user_box'><div class='group-input-edit-box'><div class='input-div-box input-edit-username'><input placeholder='Nom du groupe' f='" + f + "' group-id='" + group.id + "'  value='" + group.name + "' type='text' id='group_name' spellcheck='false' /></div></div><div id='selectGroupUpper'><div id='selectGroupUpperTarget'></div></div></div><div id='updatePasswordButton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Modifier</div></div></div></div>",
                        onOpened: function (x) {

                            var selectObj = {
                                name: "Subordonné à",
                                target: "#selectGroupUpperTarget",
                                selected: 0,

                                options: []
                            };
                            $.getJSON("/get_groupsList/", function (groups) {
                                if (!groups.error) {

                                    t = groups.length;

                                    for (var e = 0; e < t; e++) {
                                        var groupSelected = '';
                                        if (e == 0) {
                                            groupSelected = ' selected="selected" ';

                                        }

                                        selectObj.options.push({
                                            parameters: 'nb="' + e + '" ' + groupSelected + ' groupid="' + groups[e]["id"] + '"',
                                            text: groups[e].name
                                        })
                                        if (e == t - 1) {
                                            var newSelectX = new MaterialSelect(selectObj);
                                            newSelectX.load();
                                        }

                                    }
                                }
                            });

                            inputbottombar();

                            new MaterialPlaceholder(MaterialPlaceholderStandard("Nom du groupe", "#group_name")).load();
                        }
                        /* content: "<div class='edit_user_box'> <div class='flex-edit_user_box'><div class='input-edit_user_box'> <div class='first-input-edit_user_box'> <div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input placeholder='Pseudo' f='" + f + "' userID='" + user.userID + "'value='" + user.userName + "'  type='text' id='update_username' spellcheck='false'/> </div></div><div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input value='" + ((user.email) ? user.email : "") + "' type='text' placeholder='Email' id='update_email' spellcheck='false'/> </div></div></div><div class='first-input-edit_user_box'><div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input value='" + ((user.name) ? user.name : "") + "' type='text' placeholder='Nom' id='update_name' spellcheck='false'/> </div></div><div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input value='" + ((user.surname) ? user.surname : "") + "' type='text' placeholder='Prénom' id='update_surname' spellcheck='false'/> </div></div></div><div class='first-input-edit_user_box'> <div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <input placeholder='Téléphone' value='" + ((user.phone) ? user.phone : "") + "'  type='text' id='update_phone' spellcheck='false'/> </div></div><div class='group-input-edit-box'> <div class='input-div-box input-edit-username'> <div id='input-birthday-userEdit'> <span class='material-input-placeholder-birthday'>Date d'anniversaire</span> <div class='box-input-birthday-userEdit'> <div> <input value='" + ((user.birthdayDay) ? user.birthdayDay : "") + "' placeholder='JJ' type='text' id='date-input-birthday-userEdit'/> </div></div><span class='separator-input-birthday-userEdit'>/</span> <div class='box-input-birthday-userEdit'> <div> <input value='" + ((user.birthdayMonth) ? user.birthdayMonth : "") + "' placeholder='MM' id='month-input-birthday-userEdit' type='text'/> </div></div><span class='separator-input-birthday-userEdit'>/</span> <div id='year-input-birthday-userEdit' class='box-input-birthday-userEdit'> <div> <input type='text' value='" + ((user.birthdayYear) ? user.birthdayYear : "") + "' placeholder='AAAA'/> </div></div></div></div></div></div><div id='updateUserInfoButton' class='material-design-normal-button'  data-ripple='rgba(0,0,0, 0.3)'>Sauvegarder</div></div><div id='passwordChangeTitle'>Mot de passe</div><div class='input-edit_user_box passwordEditBox'> <div class='first-input-edit_user_box'> " + ((f == 0) ? "<div class='group-input-edit-box-password'> <div class='input-div-box input-edit-username'> <input placeholder='Ancien' type='password' id='update_oldPassword' spellcheck='false'/> </div></div>" : "") + "<div class='group-input-edit-box-password'> <div class='input-div-box input-edit-username'> <input type='password' placeholder='Nouveau' id='update_newPassword' spellcheck='false'/> </div></div><div class='group-input-edit-box-password'> <div class='input-div-box input-edit-username'> <input type='password' placeholder='Confirmer' id='update_confirmPassword' spellcheck='false'/> </div></div></div><div id='admin-digicode-input'><input  style='    margin-right: 25px;' class='delete_plugin_check' type='checkbox'>Digicode (mot de passe à 6 chiffres)</div><div id='updatePasswordButton' class='material-design-normal-button'  data-ripple='rgba(0,0,0, 0.3)'>Changer</div></div>" + ((f == 0) ? "" : "<div id='banTitle'>" + ((user.is_banned) ? "Cet utilisateur est verrouillé" : "Cet utilisateur est déverrouillé") + "</div><div class='input-edit_user_box banBox'><div onClick='" + ((user.is_banned) ? "unlockUser()" : "lockUser()") + "' id='UserButton" + ((user.is_banned) ? "Banned" : "Unbanned") + "' class='material-design-normal-button'  data-ripple='rgba(0,0,0, 0.3)'>" + ((user.is_banned) ? "Déverrouiller" : "Verrouiller") + "</div></div>") + ((f == 0) ? "" : "<div id='banTitle'>Supprimer</div><div class='input-edit_user_box deleteBox'><div onClick='deleteUser(" + id + ")' id='UserButtonDelete' class='material-design-normal-button'  data-ripple='rgba(0,0,0, 0.3)'>Supprimer</div></div>") + "</div></div>",
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
                         */

                    }).load();
            }
        }
        if (callback) {
            return callback();
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