function get_accessories(){
	var accessories = '';
	$.getJSON( "/list_accessories/", function( data ) {
			 all_infos = data.accessories;
  			$.each( all_infos, function(key, val ){
				all_accessories[val.aid] = val;
				var class_attr = 'accessory-buttons ' + form_display + ' ', img = false;
				if(val.state.length == 0){
					val.state = 0;
				}
				if(val.state == 0 || val.state == 1){
					if(val.state_format.length != 0){
						img = img_correspond[val.state_format];
					}
					else{
						img = img_correspond;
					} 
				}
				
				if(val.state_format == 'bool'){
					if(val.state == 1){
						class_attr += "accessory_on ";
						if(val.icon_on){
							img = val.icon_on;
						}
						else{
							img = '/img/icons/' + img[val.category + val.state];
						}
					}
					else{
						if(val.icon_off){
							img = val.icon_off;
						}
						else{
							img = '/img/icons/' + img[val.category + val.state];
						}
					}
				}
				else{
					if(img){
						img = '/img/icons/' + img[val.category + val.state];
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
					if(val.category == "Temperature Sensor"){
						val.state = Math.round(val.state) + " \260C";
					}
					accessories += '<div>' + val.state + '</div>';

				}
				accessories += '<span id="accessory_name">' + val.name + '</span><span onClick="update_accessory(' + val.aid + ')" class="update_object"><i class="fa fa-pencil" aria-hidden="true"></i></span></div>';
		});

if(first_load){
			$("#loading_accessories").hide(1000,function(){
				$('#all_accessories').html(accessories).promise().done(function(){
							$('#update').css({display: "table"});
				});
			});
			first_load = false;
}
else{
				$('#all_accessories').html(accessories);
}
	});
}
function change_statut(aid){
	if(!is_updating){
		var newState;
		if(all_accessories[aid].state_format == 'bool'){
			newState = (all_accessories[aid].state - 1) *  (all_accessories[aid].state - 1);
			all_accessories[aid].state = newState;
		
		if(newState.length != 0){
			if(all_accessories[aid].state_format.length != 0){
				img = img_correspond[all_accessories[aid].state_format];
			}
			else{
				img = img_correspond;
			}
			img = '/img/icons/' + img[all_accessories[aid].category + newState];
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