

var socket = io.connect("//" + document.domain, {secure: true});
var lastReceived;
 socket.on('connect', function(data) {
setInterval(function(){socket.emit('accessoriesRequest');},1000);
    socket.emit('sendAccessoriesList');
	socket.on('accessoriesList', function(data) {
lastReceived = JSON.parse(data);
               show_accessories(lastReceived);
        });
 });
function show_accessories(data){
var room = localStorage.getItem('room');

var accessories = '';
all_infos = data.accessories;
  			$.each( all_infos, function(key, val ){
				all_accessories[val.aid] = val;
				var class_attr = 'accessory-buttons ' + form_display + ' ', img = false;
				
				
				
				if(val.state_format != 'float'){
					if(val.state == 1){
						class_attr += "accessory_on ";
						if(val.icon_on){
							img = val.icon_on;
						}
						
					}
					else{
						if(val.icon_off){
							img = val.icon_off;
						}
						}
				}
				
				var accessoriesUniq = '<div ';

				if(val.iid != "" && !(/Sensor/).test(val.category)){
					accessoriesUniq += 'onClick="change_statut('+ val.aid + ')" iid="'+ val.iid + '" ';
				} 
				accessoriesUniq += 'class="'+ class_attr + '" id="'+ val.aid + '">';

				if(img){
					var img_style = '';
					if(form_display == "accessory-buttons_list"){
						img_style = "style='margin:0'";
					}
					accessoriesUniq += '<img ' + img_style + ' src="' + img +'"/>';
				}
				else{
					
					accessoriesUniq += '<div>' + val.state + '</div>';

				}
				accessoriesUniq += '<span id="accessory_name">' + val.name + "</span><span  onClick='update_accessory(" + val.aid +",\"" + val.oldName +"\")'" +" class='update_object'><i class='fa fa-pencil' aria-hidden='true'></i></span></div>";
if(room == 'all' || room == null|| val.room == room){
accessories += accessoriesUniq;
}
		});

if(first_load){
			$("#loading_accessories").hide(1000,function(){
				$('#all_accessories').html(accessories).promise().done(function(){
							$('#update').css({display: "table"});

$(document).trigger( "accessoriesLoaded");

if(is_updating){
				$('.update_object').show(1000);

}
				});
			});

			first_load = false;
}
else{
				$('#all_accessories').html(accessories);
if(is_updating){
				$('.update_object').show(1000);

}
}
}
function change_statut(aid){
	if(!is_updating){
		var newState;
		if(all_accessories[aid].state_format == 'bool'){
			newState = (all_accessories[aid].state - 1) *  (all_accessories[aid].state - 1);
			all_accessories[aid].state = newState;
		
		if(newState.length != 0){
		
			if(newState == 1){
				if(all_accessories[aid].icon_on){
					img = all_accessories[aid].icon_on;
				}
			}
			else{
				if(all_accessories[aid].icon_off){
					img = all_accessories[aid].icon_off;
				}
			}

			var url  = "/change_state/?aid=" + aid + "&iid="+ all_accessories[aid].iid + "&value=" + newState;
			$.getJSON(url, function( data ) {});
			$('#' + aid).toggleClass('accessory_on');
var img_style = " ";
			if(form_display == "accessory-buttons_list"){
						img_style = "style='margin:0'";
					}
			$('#' + aid).html('<img ' + img_style + ' src="' + img +'"/><span id="accessory_name">' + all_accessories[aid].name + '</span><span onClick="update_accessory(' + aid + ')" class="update_object"><i class="fa fa-pencil" aria-hidden="true"></i></span>');
		}
	}
}
}

	$(function(){
		 //on recupere et on affiche les accessoires
		$('#update').click(function(){//si on appuie sur le bouton modifier
			if(!is_updating){//si on est pas en cours de modification
				is_updating = true;//on indique que l'on est en cours de modification
				
				$('.update_object').show(1000);//on fait apparaitre les boutons de modifications

			}
			else{//si on est en cours de modification
				is_updating = false;//on indique que l'on arrete la modification
				
				$('.update_object').hide(1000);//on cache les boutons de modifications
				$(show_actual).hide(1000); //on cache le popup actuel
			}

		});

	});
var menuGenerated=0;
function update_accessory(aid,oldName){

if(menuGenerated != 0){
$('#update_accessory_room').selectmenu("destroy");

} 
show_actual = '.updating_page';
accesorie_editing_aid = aid;
accesorie_editing_oldName = oldName;

$('#acc_aid').val(aid);
	$('.updating_page').show(1000);
if($('#' + aid + ' > img').length){
$('#change_pic').html('<img src="' + $('#' + aid + ' > img').attr('src') +'"/>');
}
else{
$('#change_pic').html('');
}
$('#change_pic').attr('aid', aid);
$('#update_accessory_name').val($('#' + aid + ' > #accessory_name').text());
$('#update_accessory_model').val(all_accessories[aid].model);
$('#update_accessory_room').html('<option roomid="all">0. Aucune</option>');
getRooms(function(rooms){
t = rooms.length;
		for(var e=0;e<t;e++){
var isRoom = '';
if(rooms[e]["_id"] == all_accessories[aid].room){
isRoom = ' selected="selected" ';
}
$('#update_accessory_room').append('<option '+isRoom+' roomid ="'+rooms[e]["_id"]+'">'+ (e+1)+". " + rooms[e].name +'</option>');

		}

$('#update_accessory_room').selectmenu();
menuGenerated=1;
$('.ui-button:focus').css('border','1px solid #cccccc');
$('#update_accessory_room').on( "selectmenuclose", function( event, ui ) {$('.ui-button').blur();} );

$('.ui-button').css('background-color','white');
$('.ui-selectmenu-button.ui-button').css('text-align','center');
$('.ui-selectmenu-button.ui-button').css('width', ($('#update_accessory_model').css('width').replace('px','')-60)+"px");
});
$('#update_accessory_manufacturer').val(all_accessories[aid].manufacturer);

}
$("#all_acch2").click(function(){
	$.getJSON('/list_rooms/',function(rooms){
roomSaved=rooms; 
			$('.rooms_list > h2').text("Pi\350ces");
		$('.rooms_list > #listRooms_block').html("<div class='allRooms' id='roomChange'>Tous &nbsp; <i class='fa fa-caret-right'></i></div>");
		t = rooms.length;
		for(var e=0;e<t;e++){
			$('.rooms_list > #listRooms_block').append("<div class='roomToSelect' id='roomChange' roomID='"+e+"'>"+ rooms[e].name +" &nbsp; <i class='fa fa-caret-right'></i></div>");
		 }
		$('.rooms_list > #listRooms_block').append("<div id='updateRoom'>Modifier &nbsp; <i class='fa fa-cog'></i></div>");
		show_actual = '.rooms_list';
		$('.rooms_list').show(1000);
$(".roomToSelect").click(function(){
localStorage.setItem('room', rooms[$(this).attr("roomID")]['_id']);
localStorage.setItem('roomName', rooms[$(this).attr("roomID")].name);
show_accessories(lastReceived);
			$('#all_acch2').html(rooms[$(this).attr("roomID")]['name']+" &nbsp;&nbsp; <i class='fa fa-caret-down'></i>");
			$('.rooms_list').hide(500);
});
$(".allRooms").click(function(){
localStorage.setItem('room', 'all');
localStorage.setItem('roomName', "Tous les accessoires");
show_accessories(lastReceived);
			$('#all_acch2').html("Tous les accessoires &nbsp;&nbsp; <i class='fa fa-caret-down'></i>");
			$('.rooms_list').hide(500);
});

		$("#updateRoom").click(function(){

			$('.rooms_list').hide(500) .promise().done(function(){
			$('.rooms_list > h2').text("Pi\350ces : modifier");
			$('.rooms_list > #listRooms_block').html("");
			for(var e=0;e<t;e++){
				$('.rooms_list > #listRooms_block').append("<div class='roomChange  'id='roomChange' roomID='"+e+"'>"+ rooms[e].name +" &nbsp; <i class='fa fa-pencil'></i></div>");
			}
			$('.rooms_list > #listRooms_block').append("<div id='addRoom'>Ajouter &nbsp; <i class='fa fa-plus'></i></div>");
			$('.rooms_list').show(500);
		$("#addRoom").click(function(){
			$('.rooms_list').hide(500) .promise().done(function(){
			$('.rooms_list > h2').text("Pi\350ces : ajouter");
			$('.rooms_list > #listRooms_block').html("<input id='room_name' type='text' placeholder='Nom'> <button id='validate_room_creation'>Ajouter</button>");
			$('.rooms_list').show(500);
$("#validate_room_creation").click(function(){
$.get("/add_room/?name="+$("#room_name").val(),function(res){
if(res =='updated'){

			$('.rooms_list').hide(500) .promise().done(function(){
$("#all_acch2").trigger("click");

			});
}
else{
alert(res+"Erreur lors de la transmission. Rechargez la page et r\351essayez.");
}
});
});
});
});
		$(".roomChange").click(function(){
var id = $(this).attr('roomID');

			$('.rooms_list').hide(500) .promise().done(function(){
			$('.rooms_list > h2').text("Pi\350ce : "+rooms[id].name);
			$('.rooms_list > #listRooms_block').html("<input id='room_name' type='text' value='"+ rooms[id].name +"'> <button id='validate_room_update'>Valider</button> <button id='delete_room'>Supprimer</button>");
			$('.rooms_list').show(500);
$("#validate_room_update").click(function(){
$.get("/update_room/?name="+$("#room_name ").val()+"&id="+rooms[id]["_id"],function(res){
localStorage.setItem('room', rooms[id]);
localStorage.setItem('roomName', $("#room_name ").val());

			$('#all_acch2').html($("#room_name ").val() +" &nbsp;&nbsp; <i class='fa fa-caret-down'></i>");
if(res =='updated'){
			$('.rooms_list').hide(500) .promise().done(function(){
$("#all_acch2").trigger("click");
			});
}
else{
alert("Erreur lors de la transmission. Rechargez la page et r\351essayez.");
}
});
});
$("#delete_room").click(function(){
$.get("/delete_room/?id="+rooms[id]["_id"],function(res){
if(res =='updated'){
localStorage.setItem('room', "all");
localStorage.setItem('roomName',"Tous les accessoires");
show_accessories(lastReceived);
			$('#all_acch2').html("Tous les accessoires &nbsp;&nbsp; <i class='fa fa-caret-down'></i>");
			$('.rooms_list').hide(500) .promise().done(function(){
$("#all_acch2").trigger("click");
			});
}
else{
alert("Erreur lors de la transmission. Rechargez la page et r\351essayez.");
}
});
});

			});
		});
});
		});
	});
});
function getRooms(callback){
if(roomSaved == 0){
	$.getJSON('/list_rooms/',function(rooms){
roomSaved=rooms; 
return callback(rooms);
});
}
else{
return callback(roomSaved);
}
}