
var socket = io.connect("http://" + document.domain);
 socket.on('connect', function(data) {
    socket.emit('sendAccessoriesList');
	socket.on('accessoriesList', function(data) {
data = JSON.parse(data);
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
				
				accessories += '<div ';

				if(val.iid != "" && !(/Sensor/).test(val.category)){
					accessories += 'onClick="change_statut('+ val.aid + ')" iid="'+ val.iid + '" ';
				} 
				accessories += 'class="'+ class_attr + '" id="'+ val.aid + '">';

				if(img){
					var img_style = '';
					if(form_display == "accessory-buttons_list"){
						img_style = "style='margin:0'";
					}
					accessories += '<img ' + img_style + ' src="' + img +'"/>';
				}
				else{
					
					accessories += '<div>' + val.state + '</div>';

				}
				accessories += '<span id="accessory_name">' + val.name + '</span><span onClick="update_accessory(' + val.aid + ')" class="update_object"><i class="fa fa-pencil" aria-hidden="true"></i></span></div>';
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
        });
 });

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
