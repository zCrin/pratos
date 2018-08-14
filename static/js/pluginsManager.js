function turnPluginStart(id) {
    $.getJSON("/list_plugins/", function (data) {
        var old = put_in_object(data.plugins);
        var pluginsName = Object.keys(data.plugins),
        dataLength = pluginsName.length;
        var txt = "<div id='togglePluginsPage'  class='material-shadow-2'>";
        var arrayCheck = ['', 'checked'];
        for (var i = 0; i < dataLength; i++) {

            txt += '<div class="downloaded_plugin"><div class="downloaded_plugin_name">' + pluginsName[i].replace('pratos_', '').replace('_plugin', '') + '</div><label class="switch"><input ' + arrayCheck[data.plugins[pluginsName[i]]] + '  type="checkbox" id="' + pluginsName[i] + '"><span class="sliderSettings round"></span></label></div>';

        }
        $("#" + id + "_settingsPage").append(txt + "</div>");
        $(".switch > input").unbind();
        $(".switch > input").change(function () {
            var type = 0;
            $(".savedPluginsTurn").remove();
            if ($(this).is(":checked")) {
                type = 1;
            }
var idYG = $(this).attr('id');
            data.plugins[idYG] = type;
            if (!is_same(data.plugins, old)) {

                $("#" + id + "_settingsPage").append("<button class='savedPluginsTurn material-design-normal-button'>Sauvegarder</button>");
                $('.savedPluginsTurn').show(1000);
                $(".savedPluginsTurn").unbind();
                $(".savedPluginsTurn").click(function () {

                    $.post('/toggle_plugins/', {
                        pluginsList: data
                    }, function (response) {
                        if (response == 'reboot_allowed') {
							old = put_in_object(data.plugins)
                            var popup = new MaterialPopup({
                                    name: "Redémarrer",
                                    content: "<p id='rebootPopupText'>Pour appliquer les modifications, Pratos doit redémarrer.<br /> Voulez-vous redémarrer maintenant ?</p><div id='rebootPopupButtonBar'> <button id='dontRebootButton'  class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Non</button><button id='doRebootButton' onClick='reboot(true)' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Oui</button></div>"
                                });
                            popup.load()
                            $('#dontRebootButton').click(function () {
                                popup.close();
                                $('.savedPluginsTurn').hide(1000);
                                $(".savedPluginsTurn").remove();
                            });

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
function deletePluginStart(id) {
    $.getJSON("/list_plugins/", function (data) {
        var pluginsName = Object.keys(data.plugins),
        dataLength = pluginsName.length;
        var txt = "<div id='deletePluginsPage'  class='material-shadow-2'>";
        var arrayCheck = ['inactive_plugin', 'active_plugin'];
        for (var i = 0; i < dataLength; i++) {

            txt += '<div class="downloaded_plugin ' + arrayCheck[data.plugins[pluginsName[i]]] + '"><div class="downloaded_plugin_name">' + pluginsName[i].replace('pratos_', '').replace('_plugin', '') + '</div><input  class="delete_plugin_check" type="checkbox"></div>';

        }

        $("#" + id + "_settingsPage").append(txt + '</div>')
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

                
$("#" + id + "_settingsPage").append("<button class='savedPluginsDelete material-design-normal-button'>Sauvegarder</button>");
                $('.savedPluginsDelete').show(1000);
                $(".savedPluginsDelete").unbind();
                $(".savedPluginsDelete").click(function () {

                    $.post('/remove_plugins/', {
                        pluginsList: listPlugins
                    }, function (response) {
                        if (response == 'reboot_allowed') {
							
                            var popup = new MaterialPopup({
                                    name: "Redémarrer",
                                    content: "<p id='rebootPopupText'>Pour appliquer les modifications, Pratos doit redémarrer.<br /> Voulez-vous redémarrer maintenant ?</p><div id='rebootPopupButtonBar'> <button id='dontRebootButton'  class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Non</button><button id='doRebootButton' onClick='reboot(true)' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Oui</button></div>"
                                });
                            popup.load()
                            $('#dontRebootButton').click(function () {
                                popup.close();
                                $('.savedPluginsDelete').hide(1000);
                                $(".savedPluginsDelete").remove();
                            });
							
                           
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
