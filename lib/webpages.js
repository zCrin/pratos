/*
* License MIT
* « Copyright © 2018, Pratos »
* v 1.4.0
*/
var User = require("pratos_user_class"),
cmd = require('node-cmd'),
 fs = require("fs"),
 uuidV1 = require('uuid/v1');

module.exports=defaultPages;

function defaultPages(app,globalVariable,Accessories,style){
	
	app.get('/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res != true){
				res.setHeader('Content-Type', 'text/html');
				res.render( '../views/index.ejs',{content: globalVariable.contentPlugins,page_name:"index"});
				delete globalVariable[req.user_id];
			}
			else{
				res.redirect('/admin/index/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/css/:file.ejs', function(req, res) {
		var global_color = 'rgb('+ globalVariable.colorStyle.r+","+ globalVariable.colorStyle.g+","+ globalVariable.colorStyle.b+")";
		var background_color = 'rgb('+ globalVariable.secondColorStyle.r+","+ globalVariable.secondColorStyle.g+","+ globalVariable.secondColorStyle.b+")";
		globalVariable.session = req.session;
		res.setHeader('Content-Type', 'text/css');
		res.render('../views/css/' + req.params.file + '.ejs', {variable: globalVariable, global_color:global_color, page_name: req.params.file,background_color: background_color});
		delete globalVariable[req.user_id];
	});
	app.post('/user_connect/', function(req, res) {
		if(req.body.password){
			User.connect_user(req.user_id,globalVariable, function(connect_res){
				if(connect_res == true){
					res.redirect('/admin/index/');
					delete globalVariable[req.user_id];
				}
				else{
					res.redirect('/');
					delete globalVariable[req.user_id];
				}
			});
		}
	});
	app.get('/user_disconnect/', function(req, res) {
		globalVariable.event.emit("user", "disconnected");
		req.session.destroy();
		res.clearCookie("device_allowed");
		res.redirect('/');
		delete globalVariable[req.user_id];
	});
	app.get('/admin/:adminURI/', function(req, res){
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				require("../node_modules/pratos_navbar_class").construct(globalVariable.navbarPlugins, function(res_nav){
				res.setHeader('Content-Type', 'text/html');
				if(req.params.adminURI == "index"){
					require("../node_modules/pratos_homepage_class").construct(globalVariable.homepagePlugins, function(res_homepage){
						res.render( '../views/admin_' + req.params.adminURI + '.ejs', {nav: res_nav, content: globalVariable.contentPlugins, homepage: res_homepage,page_name: "admin/"+req.params.adminURI});
					});
				}
				else if(req.params.adminURI == "settings"){
					require("../node_modules/pratos_homepage_class").construct(globalVariable.homepagePlugins, function(res_homepage){
						res.render( '../views/admin_' + req.params.adminURI + '.ejs', {nav: res_nav, content: globalVariable.contentPlugins, page_name: "admin/"+req.params.adminURI , settings: globalVariable. pluginsSettings});
					});
				}
				else{
					res.render('../views/admin_' + req.params.adminURI + '.ejs', {nav: res_nav, page_name: "admin/"+req.params.adminURI , content: globalVariable.contentPlugins});

				}
				delete globalVariable[req.user_id];
			});
		}
		else{
			res.redirect('/');
			delete globalVariable[req.user_id];
		}

});

});
	app.get('/js/:file.ejs', function(req, res) {
		globalVariable.session = req.session;
		res.setHeader('Content-Type', 'application/javascript');
		res.render('../views/js/' + req.params.file + '.ejs', {variable: globalVariable,  page_name: req.params.file});
		delete globalVariable[req.user_id];
	});
	app.get('/list_accessories/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'application/json');
				Accessories.list_accessories(globalVariable, function(data){
					res.end(data);
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/list_rooms/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'application/json');
				Accessories.rooms.list(globalVariable);
				globalVariable.event.on("accessories", show_list_rooms);
				function show_list_rooms (answer, data){
					if(answer == "listRooms:obtained"){
						globalVariable.event.removeListener("accessories", show_list_rooms);
						res.end(data);
						delete globalVariable[req.user_id];
					}
				}
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/add_room/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'text/html');
					Accessories.rooms.add(req.user_id, globalVariable, function(data){
						res.end(data);
						delete globalVariable[req.user_id];
					});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/update_room/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'text/html');
				Accessories.rooms.update(req.user_id, globalVariable, function(data){
					res.end(data);
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/delete_room/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'text/html');
				Accessories.rooms.remove(req.user_id, globalVariable, function(data){
					res.end(data);
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/styleChange/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'text/html');
				style.change_colorsApi(req.user_id, globalVariable, function(data){
					style. get_global_color(function(r,g,b,a){
						colorStyle = {r:r,g:g,b:b,a:a};
					});
					style. get_background_color(function(r,g,b,a){
						secondColorStyle = {r:r,g:g,b:b,a:a};
					});
					res.end(data);
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/accessories_icon/', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		fs.readFile( "../conf/auto_accessories_icon.json", 'utf8', function(err, data){
			res.end(data);
		});
	});
	app.get('/change_state/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'application/json');
				var aid = globalVariable[req.user_id].request.query.aid,
					iid = globalVariable[req.user_id].request.query.iid,
					value = globalVariable[req.user_id].request.query.value;
				Accessories.change_state(aid,iid,value,globalVariable, function(data){
					res.end(data);
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.post('/update_accessory/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'application/json');
				Accessories.update_accessories(req.user_id,globalVariable, function(data){
					res.end("true");
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/add_allowed_device/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				User.add_allowed_device(req.user_id,globalVariable, function(data){
					res.redirect('/');
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/remove_allowed_device/', function(req, res) {
		globalVariable.event.emit("user", "remove_device");
		res.clearCookie("device_allowed");
		res.redirect('/');
		delete globalVariable[req.user_id];
	});
	app.post('/register_new_icon/', function(req, res) {
		const uuidV1 = require('uuid/v1');
		var uniqId = (uuidV1()).replace(/0/g,'').replace(/1/g,'');
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				globalVariable.event.emit("accessories", "uploading_images");
				if(req.files.file1 && req.files.file2){
					var sharp = require("sharp"),
						path1 = uniqId + '1.png',
						path2 =  uniqId + '0.png';
					sharp(req.files.file1.data)
						.resize(32, 32)
						.crop(sharp.strategy.centre)
						.toFormat("png")
						.toBuffer()
						.then(function(outputBuffer) {
							fs.writeFile('../static/img/icons/' + path1, outputBuffer);
					});
					sharp(req.files.file2.data)
						.resize(32, 32)
						.crop(sharp.strategy.centre)
						.toFormat("png")
						.toBuffer()
						.then(function(outputBuffer) {
							fs.writeFile('../static/img/icons/' + path2, outputBuffer);
					});
					fs.readFile("../conf/auto_accessories_icon.json", 'utf8', function(err, data){
						var txt = JSON.parse(data);
						txt[path1] = '\/' + path1;
						txt[path2] = '\/' + path2;
						fs.writeFile("../conf/auto_accessories_icon.json", JSON.stringify(txt));
						res.setHeader('Content-Type', 'application/json');
						globalVariable.event.emit("accessories", "uploading_images:successed");
						res.end('{"icon_on":"' + path1 + '", "icon_off":"' + path2 + '"}');
						delete globalVariable[req.user_id];
					});
				}
				else{
					res.end('err');
					delete globalVariable[req.user_id];
				}
			}
			else{
				res.end('err');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/get_banned_ip/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'application/json');
				fs.readFile( "../conf/auto_ip_ban.json", 'utf8', function(err, data){
					globalVariable.event.emit("ban", "listing");
					var data = JSON.parse(data);
					res.end(JSON.stringify(data.banned_ip));
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.post('/ban_ip/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'text/html');
				globalVariable.event.emit("user_admin", "ban:adding_banned");
				var Ban = require("pratos_ban_class");
				Ban.ban_user("Banned by admin",req.body.ip,function(ans){
					globalVariable.event.emit("user_admin", "ban:added_banned");
					res.end("true");
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.post('/unban_ip/', function(req, res) {
		User.verify_connection(req.user_id,globalVariable, function(user_res){
			if(user_res == true){
				res.setHeader('Content-Type', 'text/html');
				globalVariable.event.emit("user_admin", "ban:removing_banned");
				var Ban = require("pratos_ban_class");
				Ban.unban_user(req.body.ip,function(ans){
					globalVariable.event.emit("user_admin", "ban:removed_banned");
					res.end("true");
					delete globalVariable[req.user_id];
				});
			}
			else{
				res.redirect('/');
				delete globalVariable[req.user_id];
			}
		});
	});
	app.get('/reboot/', function(req, res) {
		globalVariable.event.emit("system", "reboot");
		res.setHeader('Content-Type', 'text/html');
		res.end('rebooting');
		cmd.get("sudo /etc/init.d/pratos restart", function(err,data){
			console.log(err);
			console.log(data);
		});
	});


}