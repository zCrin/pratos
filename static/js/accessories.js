

var socket = io.connect("//" + document.domain, {
        secure: true
    });

var lastReceived;
socket.on('connect', function (data) {

    setInterval(function () {
        socket.emit('accessoriesRequest');
    }, 1000);
    socket.emit('sendAccessoriesList');
    socket.on('accessoriesList', function (data) {
        lastReceived = JSON.parse(data);
        show_accessories(lastReceived);
    });
});
function show_accessories(data) {
    var room = localStorage.getItem('room');

    var accessories = '';
    all_infos = data.accessories;
    $.each(all_infos, function (key, val) {
        all_accessories[val.aid] = val;
        var class_attr = ' material-shadow-fade-3 accessory-buttons ' + form_display + ' ',
        img = false;

        if (val.state_format != 'float') {
            if (val.state == 1) {
                class_attr += "accessory_on ";
                if (val.icon_on) {
                    img = val.icon_on;
                }

            } else {
                if (val.icon_off) {
                    img = val.icon_off;
                }
            }
        }

        var accessoriesUniq = '<div ';

        if (val.iid != "" && !(/Sensor/).test(val.category)) {
            accessoriesUniq += 'data-ripple="rgba(0,0,0, 0.3)" onClick="change_statut(' + val.aid + ')" iid="' + val.iid + '" ';
        }
        accessoriesUniq += 'class="' + class_attr + '" id="' + val.aid + '">';

        if (img) {
            var img_style = '';
            if (form_display == "accessory-buttons_list") {
                img_style = "style='margin:0'";
            }
            accessoriesUniq += '<img ' + img_style + ' src="' + img + '"/>';
        } else {

            accessoriesUniq += '<div>' + val.state + '</div>';

        }
        accessoriesUniq += '<span id="accessory_name">' + val.name + "</span><span  onClick='update_accessory(" + val.aid + ",\"" + val.oldName + "\")'" + " class='update_object'><i class='fa fa-pencil' aria-hidden='true'></i></span></div>";
        if (room == 'all' || room == null || val.room == room) {
            accessories += accessoriesUniq;
        }
    });

    if (first_load) {
        $("#loading_accessories").hide(1000, function () {
            $('#all_accessories').html(accessories).promise().done(function () {
                $('#update').css({
                    display: "table"
                });

                $(document).trigger("accessoriesLoaded");

                if (is_updating) {
                    $('.update_object').show(1000);

                }
            });
        });

        first_load = false;
    } else {
        $('#all_accessories').html(accessories);
        if (is_updating) {
            $('.update_object').show(1000);

        }
    }
}
function change_statut(aid) {
    if (!is_updating) {
        var newState;
        if (all_accessories[aid].state_format == 'bool') {
            newState = (all_accessories[aid].state - 1) * (all_accessories[aid].state - 1);
            all_accessories[aid].state = newState;

            if (newState.length != 0) {

                if (newState == 1) {
                    if (all_accessories[aid].icon_on) {
                        img = all_accessories[aid].icon_on;
                    }
                } else {
                    if (all_accessories[aid].icon_off) {
                        img = all_accessories[aid].icon_off;
                    }
                }

                var url = "/change_state/?aid=" + aid + "&iid=" + all_accessories[aid].iid + "&value=" + newState;
                $.getJSON(url, function (data) {});
                $('#' + aid).toggleClass('accessory_on');
                var img_style = " ";
                if (form_display == "accessory-buttons_list") {
                    img_style = "style='margin:0'";
                }
                $('#' + aid).html('<img ' + img_style + ' src="' + img + '"/><span id="accessory_name">' + all_accessories[aid].name + '</span><span onClick="update_accessory(' + aid + ')" class="update_object"><i class="fa fa-pencil" aria-hidden="true"></i></span>');
            }
        }
    }
}

$(function () {
    //on recupere et on affiche les accessoires
    $('#update').click(function () { //si on appuie sur le bouton modifier
        if (!is_updating) { //si on est pas en cours de modification
            is_updating = true; //on indique que l'on est en cours de modification

            $('.update_object').show(1000); //on fait apparaitre les boutons de modifications

        } else { //si on est en cours de modification
            is_updating = false; //on indique que l'on arrete la modification

            $('.update_object').hide(1000); //on cache les boutons de modifications
            $(show_actual).hide(1000); //on cache le popup actuel
        }

    });

});

function update_accessory(aid, oldName) {
    var img = ($('#' + aid + ' > img').length) ? ('<img aid="' + aid + '" src="' + $('#' + aid + ' > img').attr('src') + '"/>') : "";

    var popupG = "<div id='popup-edit-header'><span id='change_pic'>" + img + "</span><input type='hidden' value='" + aid + "'id='acc_aid'/><div style='display: flex;  margin-left:5%;flex-direction: column;' id='div2'><div style='margin:0 0 0 4%;text-align: center;'><input type='text' spellcheck='false'id='update_accessory_name' value='" + $('#' + aid + ' > #accessory_name').text() + "'/></div><div class='input-div-box input-edit-accessory'><input value='" + all_accessories[aid].model + "' type='text' placeholder='Modèle' id='update_accessory_model'spellcheck='false' /></div><div class='input-div-box input-edit-accessory'><input type='text' placeholder='Fabricant' value='" + all_accessories[aid].manufacturer + "' id='update_accessory_manufacturer'spellcheck='false' /></div><div id='target1'></div>";
    selectObj = {
        name: "Pièce",
        target: "#target1",
        selected: 0,
        options: [{
                parameters: "nb='0' roomid='all'",
                text: "Aucune"
            }
        ]
    };
    getRooms(function (rooms) {
        t = rooms.length;
        for (var e = 0; e < t; e++) {
            var isRoom = '';
            if (rooms[e]["_id"] == all_accessories[aid].room) {
                isRoom = ' selected="selected" ';
                selectObj.selected = e + 1;
            }

            selectObj.options.push({
                parameters: 'nb="' + (e + 1) + '" ' + isRoom + ' roomid ="' + rooms[e]["_id"] + '"',
                text: rooms[e].name
            })

        }
        popupG += '</div></div>';
        var newSelect = new MaterialSelect(selectObj)
            var popup = new MaterialPopup({
                name: "Modifier l'accessoire",
                content: popupG,
                onExit: function () {

                    var icon_src = ($('#change_pic > img').length) ? $('#change_pic > img').attr('src') : '';
                    var roomid = (newSelect.select.selected && roomSaved[newSelect.select.selected - 1]) ? roomSaved[newSelect.select.selected - 1]['_id'] : 'all';

                    newSelect.destroy();
                    $.post('/update_accessory/', {
                        aid: aid,
                        name: $('#update_accessory_name').val(),
                        room: roomid,
                        icon_on: icon_src.replace('0', '1'),
                        icon_off: icon_src.replace('1', '0'),
                        model: $('#update_accessory_model').val(),
                        manufacturer: $('#update_accessory_manufacturer').val(),
                        oldName: oldName
                    }, function (res) {
                        if (res == 'error') {
                            alert("Erreur lors de la transmission. Rechargez la page et réessayez.");
                        } else {

                            $('#' + aid + ' > #accessory_name').text($('#update_accessory_name').val());
                            $('#' + aid + ' > img').attr('src', $('#change_pic > img').attr('src'));
                            all_accessories[aid].icon_on = icon_src.replace('0', '1');
                            all_accessories[aid].icon_off = icon_src.replace('1', '0');
                            all_accessories[aid].name = $('#update_accessory_name').val();
                            all_accessories[aid].model = $('#update_accessory_model').val();
                            all_accessories[aid].manufacturer = $('#update_accessory_manufacturer').val();
                            all_accessories[aid].room = roomid;
                            $(window).resize();
                        }
                    });
                },
                onLoad: function () {
                    inputbottombar();
                    inputplaceholder();
                    newSelect.load()
                    $('#change_pic').click(function () { //si on clique sur l'icone pour changer l'icone de l'accessoire


                        if (all_accessories[aid].state_format != 'float') {
                            var text = "<div id='select_ico'>";
                            $.each(img_correspond, function (key, val) {

                                if (key.indexOf(all_accessories[aid].state) !== -1) {
                                    if (all_accessories[aid].state_format == 'bool') {
                                        if (img_correspond[key.replace(all_accessories[aid].state, (all_accessories[aid].state - 1) * (all_accessories[aid].state - 1))]) {
                                            text += '<img class="all_ico" nb="' + val + '" src="/img/icons/' + val + '"/>';
                                        }
                                    } else {
                                        text += '<img class="all_ico" nb="' + val + '" src="/img/icons/' + val + '"/>';
                                    }
                                }
                            });
                            text += "</div><table id='image_chosen'><tr><td>Allumé</td><td><img src='' id='image_chosen1'/></td></tr><tr><td>Éteint</td><td><img src='' id='image_chosen2'/></td></tr></table><label for='upload_img' data-ripple='rgba(0,0,0, 0.3)' class='material-design-normal-button material-shadow-fade-2 ' id='importIcon'>Importer</label><div id='update_selected_pic'><label for='upload_img' class='material-design-normal-button material-shadow-2 '>Modifier</label><span  class='material-design-normal-button material-shadow-2 ' id='validateImport'>OK</span></div><input type='file' name='files' multiple id='upload_img'/></div>";
                            var popupImg = new MaterialPopup({
                                    content: text,
                                    name: "Sélectionner une icône",
                                    onLoad: function () {
                                        $(".all_ico").click(function () {

                                            $('#change_pic > img').attr('src', "/img/icons/" + $(this).attr('nb'));

                                            popupImg.close();
                                        });
                                        $("[for='upload_img']").click(function () {
                                            Snackbar.show({
                                                text: 'Sélectionnez d\'abord l\'image de l\'accessoire allumé puis celle de l\'accessoire éteint.',
                                                pos: 'top-center',
                                                showAction: true,
                                                actionText: "Aide",
                                                actionTextColor: "lightgreen",
                                                onActionClick: function () {
                                                    getHelp(512)
                                                }
                                            });
                                            $('#upload_img').change(function () {

                                                var f = this.files;
                                                for (var i = 0; i < 2; i++) {
                                                    if (f[i].type.match('image.*')) {
                                                        var reader = new FileReader();
                                                        reader.onload = function () {
                                                            var image = new Image();
                                                            image.src = this.result;
                                                            image.onload = function () {
                                                                if (this.width > 32) {
                                                                    Snackbar.show({
                                                                        text: 'La taille conseillée pour les icônes est un carré de 32 pixels',
                                                                        pos: 'top-center',
                                                                        showAction: true,
                                                                        actionText: "Aide",
                                                                        actionTextColor: "lightgreen",
                                                                        onActionClick: function () {
                                                                            getHelp(513)
                                                                        }
                                                                    });
                                                                }
                                                            };
                                                            $('#image_chosen' + (this.i + 1)).attr('src', this.result);
                                                        };
                                                        reader.i = i;
                                                        reader.readAsDataURL(f[i]);
                                                    }
                                                }
                                                $('#image_chosen').show(1000);
                                                $("#importIcon").hide(1000);
                                                $('#update_selected_pic').css('display', 'flex');

                                                $('#update_selected_pic').css('display', 'flex');

                                                $("#validateImport").click(function () {

                                                    var files = $('#upload_img').get(0).files;
                                                    var form = new FormData();
                                                    form.append("type", all_accessories[aid].state_format);
                                                    form.append('file1', files[0]);
                                                    form.append('file2', files[1]);

                                                    $.ajax({
                                                        url: '/register_new_icon/',
                                                        type: 'POST',
                                                        success: function (data) {

                                                            an = data;

                                                            if (all_accessories[aid]['state'] == 1) {
                                                                $('#change_pic > img').attr('src', "/img/icons/" + an.icon_on);

                                                                popupImg.close();

                                                            } else {

                                                                $('#change_pic > img').attr('src', "/img/icons/" + an.icon_off);

                                                                popupImg.close();
                                                            }
                                                            $.getJSON("/accessories_icon/", function (res) {
                                                                img_correspond = res;
                                                            });
                                                        },
                                                        // Form data
                                                        data: form,
                                                        //Options to tell jQuery not to process data or worry about content-type.
                                                        cache: false,
                                                        contentType: false,
                                                        processData: false
                                                    });

                                                });
                                            });

                                        });
                                    }
                                });

                            popupImg.load();
                        }

                    });
                }
            })

            popup.load();

        accesorie_editing_aid = aid;
        accesorie_editing_oldName = oldName;

    });

}

$("#all_acch2").click(function () {
    $.getJSON('/list_rooms/', function (rooms) {
        var popup = new MaterialPopup({
                name: "Pièces",
                content: content
            });

        roomSaved = rooms;

        var content = "<div id='selectRoomBox'><div class='allRooms material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)' id='changeRoom'>Tous </div>";
        t = rooms.length;
        for (var e = 0; e < t; e++) {
            content += "<div class='roomToSelect material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)' id='roomChange ' roomID='" + e + "'>" + rooms[e].name + " </div>";
        }
        content += "</div><span class='material-design-normal-button' id='updateRoom' data-ripple='rgba(0,0,0, 0.3)' >Modifier &nbsp; <i class='fa fa-cog'></i></span>";

        var popup = new MaterialPopup({
                name: "Pièces",
                content: content
            });
        popup.load()
        $(".roomToSelect").click(function () {
            localStorage.setItem('room', rooms[$(this).attr("roomID")]['_id']);
            localStorage.setItem('roomName', rooms[$(this).attr("roomID")].name);
            show_accessories(lastReceived);
            $('#all_acch2').html(rooms[$(this).attr("roomID")]['name'] + " &nbsp;&nbsp; <i class='fa fa-caret-down'></i>");
            popup.close()
        });
        $(".allRooms").click(function () {
            localStorage.setItem('room', 'all');
            localStorage.setItem('roomName', "Tous");
            show_accessories(lastReceived);
            $('#all_acch2').html("Tous &nbsp;&nbsp; <i class='fa fa-caret-down'></i>");
            popup.close();
        });

        $("#updateRoom").click(function () {

            popup.close()

            var content = "<div id='selectRoomBox'>";

            for (var e = 0; e < t; e++) {
                content += "<div class='roomChange material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)' id='roomChange' roomID='" + e + "'>" + rooms[e].name + " &nbsp; <i class='fa fa-pencil'></i></div>";
            }
            content += "</div><div data-ripple='rgba(0,0,0, 0.3)' class='material-design-normal-button'id='addRoom'>Ajouter &nbsp; <i class='fa fa-plus'></i></div>";
            var popupUP = new MaterialPopup({
                    name: "Pièces : modifier",
                    content: content
                });
            popupUP.load()
            $("#addRoom").click(function () {
                popupUP.close()

                var content = "<div class='update_roomBox'><div class='input-div-box '><input id='room_name' type='text' placeholder='Nom'></div></div> <button id='validate_room_creationButton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Ajouter</button>";
                var popupAdd = new MaterialPopup({
                        name: "Pièces : ajouter",
                        content: content,
                        onLoad: function () {
                            inputbottombar();
                            inputplaceholder();
                        }
                    });
                popupAdd.load()

                $("#validate_room_creationButton").click(function () {
                    $.get("/add_room/?name=" + $("#room_name").val(), function (res) {
                        if (res == 'updated') {

                            popupAdd.close()
                            $("#all_acch2").trigger("click");

                        } else {
                            alert(res + "Erreur lors de la transmission. Rechargez la page et r\351essayez.");
                        }
                    });
                });
            });

            $(".roomChange").click(function () {
                var id = $(this).attr('roomID');

                popupUP.close()

                var content = "<div class='update_roomBox'><div class='input-div-box '><input value='" + rooms[id].name + "' id='room_name' type='text' placeholder='Nom'></div></div> <div id='manageRoomButtonBar'><button id='delete_roomButton' class='material-design-normal-button' data-ripple='rgba(0,0,0, 0.3)'>Supprimer</button><button id='validate_room_creationButton' data-ripple='rgba(0,0,0, 0.3)' class='material-design-normal-button'>Valider</button> </div>";

                var popupEdit = new MaterialPopup({
                        name: "Pièces : " + rooms[id].name,
                        content: content,
                        onLoad: function () {
                            inputbottombar();
                            inputplaceholder();
                            $("#validate_room_creationButton").click(function () {
                                $.get("/update_room/?name=" + $("#room_name ").val() + "&id=" + rooms[id]["_id"], function (res) {
                                    localStorage.setItem('room', rooms[id]['_id']);

                                    localStorage.setItem('roomName', $("#room_name ").val());
                                    rooms[id]['name'] = $("#room_name ").val();
                                    if (res == 'updated') {

                                        show_accessories(lastReceived);
                                        $('#all_acch2').html(rooms[id]['name'] + " &nbsp;&nbsp; <i class='fa fa-caret-down'></i>");
                                        popupEdit.close()

                                    } else {
                                        alert("Erreur lors de la transmission. Rechargez la page et r\351essayez.");
                                    }
                                });
                            });
                            $("#delete_roomButton").click(function () {
                                $.get("/delete_room/?id=" + rooms[id]["_id"], function (res) {
                                    if (res == 'updated') {
                                        localStorage.setItem('room', "all");
                                        localStorage.setItem('roomName', "Tous les accessoires");
                                        show_accessories(lastReceived);
                                        $('#all_acch2').html("Tous &nbsp;&nbsp; <i class='fa fa-caret-down'></i>");
                                        popupEdit.close()

                                    } else {
                                        alert("Erreur lors de la transmission. Rechargez la page et r\351essayez.");
                                    }
                                });
                            });

                        }
                    });
                popupEdit.load()

            });

        });
    });
});
function getRooms(callback) {
    if (roomSaved == 0) {
        $.getJSON('/list_rooms/', function (rooms) {
            roomSaved = rooms;
            return callback(rooms);
        });
    } else {
        return callback(roomSaved);
    }
}
