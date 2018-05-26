function turnPluginStart() {
    $.getJSON("/list_plugins/", function (data) {
        var old = put_in_object(data.plugins);
        var pluginsName = Object.keys(data.plugins),
        dataLength = pluginsName.length;
        var txt = '';
        var arrayCheck = ['', 'checked'];
        for (var i = 0; i < dataLength; i++) {

            txt += '<div class="downloaded_plugin"><div class="downloaded_plugin_name">' + pluginsName[i].replace('pratos_', '').replace('_plugin', '') + '</div><label class="switch"><input ' + arrayCheck[data.plugins[pluginsName[i]]] + '  type="checkbox" id="' + pluginsName[i] + '"><span class="sliderSettings round"></span></label></div>';

        }
        $("#turnPluginsBox").html('<h2>Gérer</h2> ' + txt);
        $(".switch > input").unbind();
        $(".switch > input").change(function () {
            var type = 0;
            $(".savedPluginsTurn").remove();
            if ($(this).is(":checked")) {
                type = 1;
            }
            data.plugins[$(this).attr('id')] = type;
            if (!is_same(data.plugins, old)) {

                $("#turnPluginsBox").append("<div class='savedPluginsTurn ' id='savedPlugins'><button>Sauvegarder</button></div>");
                $('.savedPluginsTurn').show(1000);
                $(".savedPluginsTurn > button").unbind();
                $(".savedPluginsTurn > button").click(function () {

                    $.post('/toggle_plugins/', {
                        pluginsList: data
                    }, function (response) {
                        if (response == 'reboot_allowed') {
                            $('#rebootpopup').html("<h2>Redémarrer</h2><p>Pour appliquer les modifications, Pratos doit redémarrer. Voulez-vous redémarrer maintenant ?</p><button onClick='reboot(true)'  id='validate_ban'>Oui</button><button onClick='reboot(false)' id='validate_ban'>Non</button>");
                            $('#rebootpopup').show(1000);
                            show_actual = '#rebootpopup';
                        } else {
                            alert('Erreur');
                        }
                    });

                });
            } else {
                $('.savedPluginsTurn').hide(1000);
                $(".savedPluginsTurn").remove();
            }
        });
    });
}
function deletePluginStart() {
    $.getJSON("/list_plugins/", function (data) {
        var pluginsName = Object.keys(data.plugins),
        dataLength = pluginsName.length;
        var txt = '';
        var arrayCheck = ['inactive_plugin', 'active_plugin'];
        for (var i = 0; i < dataLength; i++) {

            txt += '<div class="downloaded_plugin ' + arrayCheck[data.plugins[pluginsName[i]]] + '"><div class="downloaded_plugin_name">' + pluginsName[i].replace('pratos_', '').replace('_plugin', '') + '</div><input  class="delete_plugin_check" type="checkbox"></div>';

        }
        $("#deletePluginsBox").html('<h2>Supprimer</h2> ' + txt);
        $(".delete_plugin_check").change(function () {
            var has_checked = 0;
            var listPlugins = Array();
            $(".delete_plugin_check").each(function () {

                if ($(this).is(':checked')) {
                    listPlugins.push('pratos_' + $(this).siblings('.downloaded_plugin_name').text() + '_plugin');
                    has_checked = 1;
                }

            });
            if (has_checked) {
                has_checked = 0;
                $(".savedPluginsDelete").remove();
                $("#deletePluginsBox").append("<div class='savedPluginsDelete' id='savedPlugins'><button>Sauvegarder</button></div>");

                $('.savedPluginsDelete').show(1000);
                $(".savedPluginsDelete > button").unbind();
                $(".savedPluginsDelete > button").click(function () {

                    $.post('/remove_plugins/', {
                        pluginsList: listPlugins
                    }, function (response) {
                        if (response == 'reboot_allowed') {
                            $('#rebootpopup').html("<h2>Redémarrer</h2><p>Pour appliquer les modifications, Pratos doit redémarrer. Voulez-vous redémarrer maintenant ?</p><button onClick='reboot(true)'  id='validate_ban'>Oui</button><button onClick='reboot(false)' id='validate_ban'>Non</button>");
                            $('#rebootpopup').show(1000);
                            show_actual = '#rebootpopup';
                        } else {
                            alert('Erreur');
                        }
                    });
                });
            } else {
                $('.savedPluginsDelete').hide(1000);
                $(".savedPluginsDelete").remove();
            }
        });
    });

}
