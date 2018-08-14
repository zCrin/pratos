function startRecipe() {

    $.get("/blocks.xml", function (blocksXml) {
        $("body").append(blocksXml);
        $.cachedScript("https://cdn.jsdelivr.net/npm/blockly@1.0.0/blockly_compressed.js").done(function (script, textStatus) {
            $.cachedScript("https://cdn.jsdelivr.net/npm/blockly@1.0.0/blocks_compressed.js").done(function (script, textStatus) {

                $.cachedScript("https://cdn.jsdelivr.net/npm/blockly@1.0.0/msg/js/fr.js").done(function (script, textStatus) {
                    $.cachedScript("https://cdn.jsdelivr.net/npm/blockly@1.0.0/javascript_compressed.js").done(function (script, textStatus) {
                        loadJS('/blocks.js', function () {
                            loadJS('/blocks.exec.js', function () {

                                $.getJSON('/recipes_list/', function (data) {
                                    modifyBlocks = data;
                                    $("#deleteConditions").hide(0);
                                    $("#buttonsTopRecipe").fadeIn(500);

                                });

                            }, document.body);
                        }, document.body);
                    });
                });
            });

        });
    });
}
function reload_recipesList(callback) {
    $.getJSON('/recipes_list/', function (data) {
        modifyBlocks = data;
        if (callback) {
            callback();
        }
    });
}
$("#createRecipe").click(function () {
    $("#genratorBlockly").hide(500)
    $('#showConditionCode').html('Voir le code <i class="fa fa-caret-down" aria-hidden="true"></i>')
    codeIsShownRecipe = 0;
    $("#listOldrecipesBlock").hide()
    $("#deleteConditions").hide();
    $('#saveConditionsName').val("");
    $("#blocklyDiv").html("");
    $("#blocklyDiv").css("width", "100%");
    $("#conditionsButtons").css({
        "opacity": "0",
        "display": "flex",
    }).animate({
        opacity: 1
    }, 500)
    $("#blocklyDiv").fadeIn(1000);
    $("#saveConditionsName").removeAttr('idRecipe');
    workspacePlayground = Blockly.inject('blocklyDiv', {
            toolbox: document.getElementById('toolbox')
        });

    function myUpdateFunction(event) {
        var code = Blockly.JavaScript.workspaceToCode(workspacePlayground);
        $('#genratorBlockly').html(code);
    }
    workspacePlayground.addChangeListener(myUpdateFunction);

    $("#registerConditions").fadeIn(500);
    $("#saveConditionsName").fadeIn(500);
    $('#showConditionCode').css('display', 'table');

});
function condtionsSaveForce(sate) {
    if (sate) {
        $(show_actual).hide(1000);
        var q = $("#saveConditionsName").val();
        var code = Blockly.JavaScript.workspaceToCode(workspacePlayground);
        var wk = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspacePlayground));

        $.post('/conditionsRegister', {
            name: q,
            code: code,
            changeConfirmed: "true",
            workspace: wk
        }, function (data) {
            reload_recipesList();
            data = parseInt(data);
            if (data) {
                var popup = new MaterialPopup({
                        name: "Redémarrer",
                        content: "<p id='rebootPopupText'>Pour appliquer les modifications, Pratos doit redémarrer.<br /> Voulez-vous redémarrer maintenant ?</p><div id='rebootPopupButtonBar'> <button id='dontRebootButton'  class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Non</button><button id='doRebootButton' onClick='reboot(true)' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Oui</button></div>"
                    });
                popup.load()
                $('#dontRebootButton').click(function () {
                    popup.close();

                });
                $('html, body').animate({
                    scrollTop: $('h1').offset().top
                }, 500);
            } else {
                alert('erreur');
            }
        });
    } else {
        $(show_actual).hide(1000);
    }
}
function updateRecipe(recipeName, recipeId) {
    $.post("/recipe_code/", {
        recipeId: recipeId
    }, function (data) {
        $("#listOldrecipesBlock").hide()
        $("#conditionsButtons").css({
            "opacity": "0",
            "display": "flex",
        }).animate({
            opacity: 1
        }, 500)
        $("#blocklyDiv").html("");
        $("#blocklyDiv").css("width", "100%");

        $("#blocklyDiv").fadeIn(1000);
        $("#saveConditionsName").val(recipeName);
        $("#saveConditionsName").attr('idRecipe', recipeId);

        workspacePlayground = Blockly.inject('blocklyDiv', {
                toolbox: document.getElementById('toolbox')
            });

        workspacePlayground.clear();

        Blockly.Xml.domToWorkspace(workspacePlayground, Blockly.Xml.textToDom(data));
        function myUpdateFunction(event) {
            var code = Blockly.JavaScript.workspaceToCode(workspacePlayground);
            $('#genratorBlockly').html(code);
        }

        workspacePlayground.addChangeListener(myUpdateFunction);

        $("#deleteConditions").fadeIn(500);
        $('#showConditionCode').css('display', 'table');
    });
}

function saveRecipe() {
    var q = $("#saveConditionsName").val();

    var code = Blockly.JavaScript.workspaceToCode(workspacePlayground);

    var wk = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspacePlayground));
    var idRecipe = ($("#saveConditionsName").attr('idRecipe')) ? $("#saveConditionsName").attr('idrecipe') : 0;

    $.post('/conditionsRegister', {
        name: q,
        code: code,
        workspace: wk,
        recipeId: idRecipe
    }, function (data) {
        data = parseInt(data);
        if (data) {
            if (idRecipe == 0) {
                reload_recipesList(function () {
                    $("#modifyOldRecipe").click();
                });
            } else {
                reload_recipesList();
            }
            var popup = new MaterialPopup({
                    name: "Redémarrer",
                    content: "<p id='rebootPopupText'>Pour appliquer les modifications, Pratos doit redémarrer.<br /> Voulez-vous redémarrer maintenant ?</p><div id='rebootPopupButtonBar'> <button id='dontRebootButton'  class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Non</button><button id='doRebootButton' onClick='reboot(true)' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Oui</button></div>"
                });
            popup.load()
            $('#dontRebootButton').click(function () {
                popup.close();

            });

            $('html, body').animate({
                scrollTop: $('h1').offset().top
            }, 500);
        }
    });

}

$("#modifyOldRecipe").click(function () {
    $('#conditionsButtons').hide()
    $('#blocklyDiv').hide()
    $('#showConditionCode').hide();
    $("#genratorBlockly").hide(500)
    $('#showConditionCode').html('Voir le code <i class="fa fa-caret-down" aria-hidden="true"></i>')
    codeIsShownRecipe = 0;
    $("#deleteConditions").hide();
    $("#listOldrecipesBlock").html("");
    var we = Object.keys(modifyBlocks.recipes),
    w = we.length;
    for (var c = 0; c < w; c++) {
        $("#listOldrecipesBlock").append(
            "<div data-ripple='rgba(0,0,0, 0.3)' class='material-shadow-2 material-design-normal-button updateRecipeSelect' onclick='updateRecipe(\"" + modifyBlocks.recipes[we[c]] + "\",\"" + we[c] + "\")'>" + modifyBlocks.recipes[we[c]] + "</div>");

    }
    $("#listOldrecipesBlock").fadeIn(500);

});

function validateDeleteRecipe(state) {
    if (state) {
        var recipeId = $("#saveConditionsName").attr('idRecipe');
        $.post("/recipe_delete/", {
            recipeId: recipeId
        }, function (data) {
            if (data == '1') {
                reload_recipesList(function () {
                    $("#modifyOldRecipe").click();
                });
                var popup = new MaterialPopup({
                        name: "Redémarrer",
                        content: "<p id='rebootPopupText'>Pour appliquer les modifications, Pratos doit redémarrer.<br /> Voulez-vous redémarrer maintenant ?</p><div id='rebootPopupButtonBar'> <button id='dontRebootButtohn' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Non</button><button id='doRebootButton' onClick='reboot(true)' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Oui</button></div>",

                    });
                popup.load()
                $('#dontRebootButtohn').click(function () {
                    popup.close();

                });
                $('html, body').animate({
                    scrollTop: $('h1').offset().top
                }, 500);
            } else if (data == '01') {
                $('#rebootpopup').html("<h2>Erreur</h2><p>Impossible de supprimer cette recette car elle n'existe pas...</p><button onClick='reboot(false)' id='validate_ban'>OK</button>");
                var popup = new MaterialPopup({
                        name: "Erreur",
                        content: "<p id='rebootPopupText'>Impossible de supprimer cette recette car elle n'existe pas...</p><div id='rebootPopupButtonBar'> <button id='okRebbotButton'  class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>OK</button></div>"
                    });
                popup.load()
                $('#okRebbotButton').click(function () {
                    popup.close();

                });

                $('html, body').animate({
                    scrollTop: $('h1').offset().top
                }, 500);
            } else {
                var popup = new MaterialPopup({
                        name: "Erreur",
                        content: "<div id='rebootPopupButtonBar'> <button id='okRebbotButton'  class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>OK</button></div>"
                    });
                popup.load()
                $('#okRebbotButton').click(function () {
                    popup.close();

                });

                $('html, body').animate({
                    scrollTop: $('h1').offset().top
                }, 500);
            }
        });
    }
}

function deleteRecipe() {

    var popup = new MaterialPopup({
            name: "Supprimer",
            content: "<p id='rebootPopupText'>Voulez-vous vraiment supprimer cette recette ?</p><div id='rebootPopupButtonBar'> <button id='dontRebootButton'  class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Non</button><button id='doRebootButton' onClick='validateDeleteRecipe(true)' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Oui</button></div>"
        });
    popup.load()
    $('#dontRebootButton, #doRebootButton').click(function () {
        popup.close();

    });

    $('html, body').animate({
        scrollTop: $('h1').offset().top
    }, 500);
}
var codeIsShownRecipe = 0;
$("#showConditionCode").click(function () {
    if (!codeIsShownRecipe) {
        $("#genratorBlockly").show(500)
        $(this).html('Cacher le code <i class="fa fa-caret-up" aria-hidden="true"></i>')
        codeIsShownRecipe = 1;
    } else {
        $("#genratorBlockly").hide(500)
        $(this).html('Voir le code <i class="fa fa-caret-down" aria-hidden="true"></i>')
        codeIsShownRecipe = 0;
    }

});
