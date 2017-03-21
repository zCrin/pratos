var http = require('http');
var EventEmitter = require("events").EventEmitter;
var express = require('express');
const fileUpload = require('express-fileupload');
var url = require("url");
var session = require('express-session');
var bodyParser = require('body-parser');
var Cookies = require("cookies");
var User = require("pratos_user_class");
var fs = require("fs");
var globalVariable = [];
var event = new EventEmitter();
var app = express();
globalVariable.event = event;

//require("test_f").listen(globalVariable); //load event listener exemple

/** Configuration */
app.use(bodyParser.json())
.use(fileUpload())
.use(bodyParser.urlencoded({
	extended: true
}))
.use(
	session({
		secret : 's',
		saveUninitialized : false,
		resave : false
	}
));
/*
 globalVariable.navbarPlugins = Object();
globalVariable.contentPlugins = Array();
fs.readFile( __dirname + "/conf/settings.json", 'utf8', function(err, data){
	var txt = JSON.parse(data);
	var pluginsName = Object.keys(txt.plugins);
	var numberOfPlugins = pluginsName.length;
	for(var i = 0; i < numberOfPlugins; i++){
		if(txt.plugins[pluginsName[i]].action.GET){
			require(pluginsName[i] + "_plugin").get(app,globalVariable);
		}
		 if(txt.plugins[pluginsName[i]].action.POST){
			require(pluginsName[i] + "_plugin").post(app,globalVariable);
		}
		 if(txt.plugins[pluginsName[i]].action.navbar){
			globalVariable.navbarPlugins[pluginsName[i]] = pluginsName[i] + "_plugin";
		}
 if(txt.plugins[pluginsName[i]].action.on_content){
	globalVariable.contentPlugins = require(pluginsName[i] + "_plugin").content(globalVariable.contentPlugins);
		}

	}

});
*/
 globalVariable.navbarPlugins = Object();
globalVariable.contentPlugins = Array();
fs.readFile( __dirname + "/conf/settings.json", 'utf8', function(err, data){
	var txt = JSON.parse(data);
	var pluginsName = txt.plugins;
	var numberOfPlugins = pluginsName.length;
	for(var i = 0; i < numberOfPlugins; i++){
		var conf = require(pluginsName[i] + "_plugin").config();
		if(conf.navbar){
			globalVariable.navbarPlugins[pluginsName[i]] = pluginsName[i] + "_plugin";
		}
		if(conf.GET){
			require(pluginsName[i] + "_plugin").get(app,globalVariable);
		}
		if(conf.POST){
			require(pluginsName[i] + "_plugin").post(app,globalVariable);
		}
		if(conf.on_content){
			globalVariable.contentPlugins = require(pluginsName[i] + "_plugin").content(globalVariable.contentPlugins);
		}
	}
});
//Page : index
app.get('/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res != true){
			res.setHeader('Content-Type', 'text/html');
			res.render( __dirname + '/views/index.ejs', {variable: globalVariable});		}
		else{
			res.redirect('/admin/index/');
		}
	});
});

//page user_connect.ejs
app.post('/user_connect/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	if(req.body.password){
			User.connect_user(globalVariable, function(connect_res){
				if(connect_res == true){
					res.redirect('/admin/index/');
				}
				else{
					res.redirect('/');
				}
			});
	}
});

//page user_disconnect
app.get('/user_disconnect/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	globalVariable.event.emit("user", "disconnected");
	req.session.destroy();
	res.clearCookie("device_allowed");
	res.redirect('/');
});

//load all admin page
app.get('/admin/:adminURI/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
require("pratos_navbar_class").construct(globalVariable.navbarPlugins, function(res_nav){
				res.setHeader('Content-Type', 'text/html');
				res.render( __dirname + '/views/admin_' + req.params.adminURI + '.ejs', {nav: res_nav, content: globalVariable.contentPlugins});
			});
		}
		else{
			res.redirect('/');
		}
	});
});

//page list_accessories
app.get('/list_accessories/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
			res.setHeader('Content-Type', 'application/json');
			var Accessories = require("pratos_accessories_class");
				Accessories.list_accessories(globalVariable);
				globalVariable.event.on("accessories", show_list_accessories);
				function show_list_accessories (answer, data){
					if(answer == "list:obtained"){
						globalVariable.event.removeListener("accessories", show_list_accessories);
						res.end(data);
					}
				}
			}
		else{
			res.redirect('/');
		}
	});
});


app.get('/accessories_icon/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
			res.setHeader('Content-Type', 'application/json');
			fs.readFile( __dirname + "/conf/auto_accessories_icon.json", 'utf8', function(err, data){
				res.end(data);
			});
		}
		else{
			res.redirect('/');
		}
	});
});

app.get('/change_state/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
			res.setHeader('Content-Type', 'application/json');
			var Accessories = require("pratos_accessories_class");
				Accessories.change_state(globalVariable, function(data){
					res.end(data);
			});
		}
		else{
			res.redirect('/');
		}
	});
});
app.post('/update_accessory/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
			res.setHeader('Content-Type', 'application/json');
			var Accessories = require("pratos_accessories_class");
				Accessories.update_accessory(globalVariable, function(data){
					res.end("true");
			});
		}
		else{
			res.redirect('/');
		}
	});
});

app.get('/add_allowed_device/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
			
			User.add_allowed_device(globalVariable, function(data){
					res.redirect('/');
			});
		}
		else{
			res.redirect('/');
		}
	});
});

app.get('/remove_allowed_device/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	globalVariable.event.emit("user", "remove_device");
	res.clearCookie("device_allowed");
	res.redirect('/');
});

app.get('/css/:file.ejs', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.session = req.session;
	res.setHeader('Content-Type', 'text/css');
	res.render(__dirname + '/views/css/' + req.params.file + '.ejs', {variable: globalVariable});
});


app.post('/register_new_icon/', function(req, res) {
	const uuidV1 = require('uuid/v1');
	var uniqId = (uuidV1()).replace(/0/g,'').replace(/1/g,'');
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
			globalVariable.event.emit("accessories", "uploading_images");
			if(req.files.file1 && req.files.file2){
				var sharp = require("sharp");
				var path1 = uniqId + '1.png';
				var path2 =  uniqId + '0.png';
sharp(req.files.file1.data)
  .resize(32, 32)
  .crop(sharp.strategy.centre)
  .toFormat("png")
  .toBuffer()
  .then(function(outputBuffer) {
fs.writeFile(__dirname + '/static/img/icons/' + path1, outputBuffer);
  });
				
sharp(req.files.file2.data)
  .resize(32, 32)
  .crop(sharp.strategy.centre)
  .toFormat("png")
  .toBuffer()
  .then(function(outputBuffer) {
fs.writeFile(__dirname + '/static/img/icons/' + path2, outputBuffer);
  });
				fs.readFile( __dirname + "/conf/auto_accessories_icon.json", 'utf8', function(err, data){
					var txt = JSON.parse(data);
					txt[req.body.type][path1] = '\/' + path1;
					txt[req.body.type][path2] = '\/' + path2;
					fs.writeFile(__dirname + "/conf/auto_accessories_icon.json", JSON.stringify(txt));
					res.setHeader('Content-Type', 'application/json');
					globalVariable.event.emit("accessories", "uploading_images:successed");
					res.end('{"icon_on":"' + path1 + '", "icon_off":"' + path2 + '"}');
				});
			}
			else{
				res.end('err');
			}
		}
		else{
			res.end('err');
		}
	});
	
});

app.get('/get_banned_ip/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
			res.setHeader('Content-Type', 'application/json');
			fs.readFile( __dirname + "/conf/auto_ip_ban.json", 'utf8', function(err, data){
globalVariable.event.emit("ban", "listing");
				var data = JSON.parse(data);
				res.end(JSON.stringify(data.banned_ip));
			});
		}
		else{
			res.redirect('/');
		}
	});
});

app.post('/ban_ip/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
			res.setHeader('Content-Type', 'text/html');
			globalVariable.event.emit("user_admin", "ban:adding_banned");
				var Ban = require("pratos_ban_class");
				Ban.ban_user("Banned by admin",req.body.ip,function(ans){
globalVariable.event.emit("user_admin", "ban:added_banned");
res.end("true");
				});
		
		}
		else{
			res.redirect('/');
		}
	});
});

app.post('/unban_ip/', function(req, res) {
	globalVariable.cookies = new Cookies( req, res);
	globalVariable.request = req;
	User.verify_connection(globalVariable, function(user_res){
		if(user_res == true){
			res.setHeader('Content-Type', 'text/html');
				globalVariable.event.emit("user_admin", "ban:removing_banned");
				var Ban = require("pratos_ban_class");
				Ban.unban_user(req.body.ip,function(ans){
globalVariable.event.emit("user_admin", "ban:removed_banned");
res.end("true");
				
			});
		}
		else{
			res.redirect('/');
		}
	});
});

app.use(express.static(__dirname + '/static'));

app.listen(3000);
console.log("Serveur web lancé sur localhost:3000 ...");