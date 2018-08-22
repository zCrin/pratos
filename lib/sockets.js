/*
* License MIT
* « Copyright © 2018, Pratos »
* v 1.4.0
*/
var sharedsession =require('socket.io-express-session'),
		IOcookieParser = require('socket.io-cookie'),
		uuidV1 = require('uuid/v1'),
		session = require("express-session")({
    secret: "s",
    resave: true,
    saveUninitialized: true
  }),
 User = require("pratos_user_class");
var user = require(__dirname+'/users.js');
module.exports=defaultSockets;
function defaultSockets(io,globalVariable,Accessories,style){
						
	io.on('connection', function(client){

		client.emit('ping');
		client.on('pong',function(data){
			client.emit('ping');
			delete globalVariable[client.user_id];
		});
		//style.ioConnection(client, globalVariable);
		
		var nPluginsSocket = globalVariable.socketPlugins.length;
		for(var ze=0;ze<nPluginsSocket;ze++){
			require(globalVariable.socketPlugins[ze]).socket(client,globalVariable);
		}
		client.on("disconnect",function(data){
			
			delete globalVariable[client.user_id];

		});
		client.on('error', function(data) {
			console.log(data);
		});

		client.on('sendAccessoriesList', function(data) {

			user.is_connected(client.user_id, function (response,user_res) {
			if (response== true) {

					Accessories.list_accessories(globalVariable,function(data){
						client.emit('accessoriesList', data);
					});
					globalVariable.event.on("accessories", send_accessories_message);
					function send_accessories_message(answer,data){
						if(answer == "change:detected"){
							client.emit('accessoriesList', data);
						}
					}

				}
			});
		});
	});
}