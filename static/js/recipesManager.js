function startRecipe() {
    $("#createNewRecipe").hide(0);
    $("#saveConditions").hide(0);
    $("#deleteConditions").hide(0);
    $("#saveConditionsFile").hide(0);
    $.get("/blocks.xml", function (blocksXml) {
        $("body").append(blocksXml);
        $.cachedScript("https://cdn.jsdelivr.net/npm/blockly@1.0.0/blockly_compressed.js").done(function (script, textStatus) {
            $.cachedScript("https://cdn.jsdelivr.net/npm/blockly@1.0.0/blocks_compressed.js").done(function (script, textStatus) {

                $.cachedScript("https://cdn.jsdelivr.net/npm/blockly@1.0.0/msg/js/fr.js").done(function (script, textStatus) {
                    $.cachedScript("https://cdn.jsdelivr.net/npm/blockly@1.0.0/javascript_compressed.js").done(function (script, textStatus) {
                        loadJS('/blocks.js', function () {
                            loadJS('/blocks.exec.js', function () {

                                $("#createNewRecipe").fadeIn(1000);
                                $.getJSON('/recipes_list/', function (data) {
                                    modifyBlocks = data;
                                    $("#deleteConditions").hide(0);
                                    $("#modifyRecipe").fadeIn(1000);

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
$("#createNewRecipe").click(function () {

    $("#blocklyDiv").html("");
    $("#blocklyDiv").css("width", "100%");
   
    $("#blocklyDiv").fadeIn(1000);
    $("#saveConditionsFile").removeAttr('idRecipe');
    workspacePlayground = Blockly.inject('blocklyDiv', {
            toolbox: document.getElementById('toolbox')
        });

    function myUpdateFunction(event) {
        var code = Blockly.JavaScript.workspaceToCode(workspacePlayground);
      $('#genratorBlockly').html(code);
    }
    workspacePlayground.addChangeListener(myUpdateFunction);
    //$("#createNewRecipe").fadeOut(500);
    $("#saveConditions").fadeIn(500);
    $("#saveConditionsFile").fadeIn(500);
	$('#showConditionCode').css('display','table');

});
function condtionsSaveForce(sate) {
    if (sate) {
        $(show_actual).hide(1000);
        var q = $("#saveConditionsFile").val();
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
                $('#rebootpopup').html("<h2>Redémarrer</h2><p>Pour appliquer votre recette, Pratos doit redémarrer. Voulez-vous redémarrer maintenant ?</p><button onClick='reboot(true)'  id='validate_ban'>Oui</button><button onClick='reboot(false)' id='validate_ban'>Non</button>");
                $('#rebootpopup').show(1000);
                show_actual = '#rebootpopup';
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
        $("#blocklyDiv").html("");
        $("#blocklyDiv").css("width", "100%");
       
        $("#blocklyDiv").fadeIn(1000);
        $("#saveConditionsFile").val(recipeName);
        $("#saveConditionsFile").attr('idRecipe', recipeId);

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
        $("#saveConditions").fadeIn(500);
        $("#saveConditionsFile").fadeIn(500);
        $("#deleteConditions").fadeIn(500);
$('#showConditionCode').css('display','table');
    });
}

function saveRecipe() {
    var q = $("#saveConditionsFile").val();

    var code = Blockly.JavaScript.workspaceToCode(workspacePlayground);

    var wk = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspacePlayground));
    var idRecipe = ($("#saveConditionsFile").attr('idRecipe')) ? $("#saveConditionsFile").attr('idrecipe') : 0;

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
                    $("#modifyRecipe").click();
                });
            } else {
                reload_recipesList();
            }
            $('#rebootpopup').html("<h2>Redémarrer</h2><p>Pour appliquer votre recette, Pratos doit redémarrer. Voulez-vous redémarrer maintenant ?</p><button onClick='reboot(true)'  id='validate_ban'>Oui</button><button onClick='reboot(false)' id='validate_ban'>Non</button>");
            $('#rebootpopup').show(1000);
            show_actual = '#rebootpopup';
            $('html, body').animate({
                scrollTop: $('h1').offset().top
            }, 500);
        }
    });

}

$("#modifyRecipe").click(function () {
    $("#blocklyDiv").html("");
    var we = Object.keys(modifyBlocks.recipes),
    w = we.length;
    for (var c = 0; c < w; c++) {
        $("#blocklyDiv").append(
            "<div class='updateRecipeSelect' onclick='updateRecipe(\"" + modifyBlocks.recipes[we[c]] + "\",\"" + we[c] + "\")'>" + modifyBlocks.recipes[we[c]] + "</div>");

    }
    $("#blocklyDiv").fadeIn(500);
	
});

function validateDeleteRecipe(state) {
    if (state) {
        var recipeId = $("#saveConditionsFile").attr('idRecipe');
        $.post("/recipe_delete/", {
            recipeId: recipeId
        }, function (data) {
            if (data == '1') {
                reload_recipesList(function () {
                    $("#modifyRecipe").click();
                });
                $('#rebootpopup').html("<h2>Redémarrer</h2><p>Pour supprimer cette recette, Pratos doit redémarrer. Voulez-vous redémarrer maintenant ?</p><button onClick='reboot(true)'  id='validate_ban'>Oui</button><button onClick='reboot(false)' id='validate_ban'>Non</button>");
                $('#rebootpopup').show(1000);
                show_actual = '#rebootpopup';
                $('html, body').animate({
                    scrollTop: $('h1').offset().top
                }, 500);
            } else if (data == '01') {
                $('#rebootpopup').html("<h2>Erreur</h2><p>Impossible de supprimer cette recette car elle n'existe pas...</p><button onClick='reboot(false)' id='validate_ban'>OK</button>");
                $('#rebootpopup').show(1000);
                show_actual = '#rebootpopup';
                $('html, body').animate({
                    scrollTop: $('h1').offset().top
                }, 500);
            } else {
                $('#rebootpopup').html("<h2>Erreur</h2><button onClick='reboot(false)' id='validate_ban'>OK</button>");
                $('#rebootpopup').show(1000);
                show_actual = '#rebootpopup';
                $('html, body').animate({
                    scrollTop: $('h1').offset().top
                }, 500);
            }
        });
    }
}

function deleteRecipe() {
    $('#rebootpopup').html("<h2>Supprimer</h2><p>Voulez-vous vraiment supprimer cette recette</p><button onClick='validateDeleteRecipe(true)'  id='validate_ban'>Oui</button><button onClick='reboot(false)' id='validate_ban'>Non</button>");
    $('#rebootpopup').show(1000);
    show_actual = '#rebootpopup';
    $('html, body').animate({
        scrollTop: $('h1').offset().top
    }, 500);
}
var codeIsShownRecipe = 0;
$("#showConditionCode").click(function(){
	if(!codeIsShownRecipe){
		$("#genratorBlockly").show(500)
		$(this).html('Cacher le code <i class="fa fa-caret-up" aria-hidden="true"></i>')
		codeIsShownRecipe=1;
	}else{
			$("#genratorBlockly").hide(500)
		$(this).html('Voir le code <i class="fa fa-caret-down" aria-hidden="true"></i>')
		codeIsShownRecipe=0;
	}
	
});