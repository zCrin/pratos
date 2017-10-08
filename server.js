var http = require('http'),
	EventEmitter = require("events").EventEmitter,
	express = require('express'),
	fileUpload = require('express-fileupload'),
	url = require("url"),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	Cookies = require("cookies"),
	User = require("pratos_user_class"),
	fs = require("fs"),
	globalVariable = [],
	app = express(),
	plugins = require("pratos_plugin_class"),
	uuidV1 = require('uuid/v1');
	globalVariable.event = new EventEmitter(),
	cmd=require('node-cmd'),
	proxyPort=3000; 
	
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
))
.use(function(req,res,next){
	var user_id = uuidV1();

	globalVariable[user_id] = Object();
	req.user_id = user_id;
	globalVariable[user_id].request = req;
	load_cookie(req,res,function(){

		next();
	});
});


plugins.list(globalVariable, app, function(data){
	globalVariable = data;
	plugins.webPages(app, globalVariable);
});
//Page : index

app.get('/', function(req, res) {
	User.verify_connection(req.user_id,globalVariable, function(user_res){
		if(user_res != true){
			res.setHeader('Content-Type', 'text/html');
			res.render( __dirname + '/views/index.ejs');
delete globalVariable[req.user_id];
}
		else{
			res.redirect('/admin/index/');
delete globalVariable[req.user_id];
		}
	});

});

//page user_connect.ejs
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

//page user_disconnect
app.get('/user_disconnect/', function(req, res) {
	globalVariable.event.emit("user", "disconnected");
	req.session.destroy();
	res.clearCookie("device_allowed");
	res.redirect('/');
delete globalVariable[req.user_id];
});

//load all admin page
app.get('/admin/:adminURI/', function(req, res){
	User.verify_connection(req.user_id,globalVariable, function(user_res){
		if(user_res == true){
			require("pratos_navbar_class").construct(globalVariable.navbarPlugins, function(res_nav){
			res.setHeader('Content-Type', 'text/html');
				if(req.params.adminURI == "index"){
					require("pratos_homepage_class").construct(globalVariable.homepagePlugins, function(res_homepage){
						res.render( __dirname + '/views/admin_' + req.params.adminURI + '.ejs', {nav: res_nav, content: globalVariable.contentPlugins, homepage: res_homepage});
					});
				}
				else{
					res.render( __dirname + '/views/admin_' + req.params.adminURI + '.ejs', {nav: res_nav, content: globalVariable.contentPlugins});

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

//page list_accessories
app.get('/list_accessories/', function(req, res) {
	
	
	User.verify_connection(req.user_id,globalVariable, function(user_res){
		if(user_res == true){
			res.setHeader('Content-Type', 'application/json');
			var Accessories = require("pratos_accessories_class");
				Accessories.list_accessories(globalVariable);
				globalVariable.event.on("accessories", show_list_accessories);
				function show_list_accessories (answer, data){
					if(answer == "list:obtained"){
						globalVariable.event.removeListener("accessories", show_list_accessories);
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


app.get('/accessories_icon/', function(req, res) {

	
	
		
			res.setHeader('Content-Type', 'application/json');
			fs.readFile( __dirname + "/conf/auto_accessories_icon.json", 'utf8', function(err, data){
				res.end(data);
			});

});

app.get('/change_state/', function(req, res) {

	
	User.verify_connection(req.user_id,globalVariable, function(user_res){
		if(user_res == true){
			res.setHeader('Content-Type', 'application/json');
			var Accessories = require("pratos_accessories_class");
				Accessories.change_state(req.user_id,globalVariable, function(data){
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
			var Accessories = require("pratos_accessories_class");
				Accessories.update_accessory(req.user_id,globalVariable, function(data){
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

app.get('/css/:file.ejs', function(req, res) {
	
	globalVariable.session = req.session;
	res.setHeader('Content-Type', 'text/css');
	res.render(__dirname + '/views/css/' + req.params.file + '.ejs', {variable: globalVariable});
delete globalVariable[req.user_id];
});


app.post('/register_new_icon/', function(req, res) {
	const uuidV1 = require('uuid/v1');
	var uniqId = (uuidV1()).replace(/0/g,'').replace(/1/g,'');
	
	
	User.verify_connection(req.user_id,globalVariable, function(user_res){
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
			fs.readFile( __dirname + "/conf/auto_ip_ban.json", 'utf8', function(err, data){
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
function getClientIP(req){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
var patt = new RegExp(':');
if(patt.test(ip)){
		ip = ip.split(":");
//fs.appendFile(__dirname + '/log/robots.log', "\n" + " " + Date.now() + " : "+ ip[(ip.length - 1)]);
return ip[(ip.length - 1)];
}
return ip;
}
function load_cookie(req,res,callback){
globalVariable.event.emit("cookiesLoaded", new Cookies( req, res), req.user_id,callback);
globalVariable.event.on("cookiesLoaded", cookiesLoadedCallback);

}
function cookiesLoadedCallback(data, user_id,callback){
globalVariable.event.removeListener("cookiesLoaded", cookiesLoadedCallback);
globalVariable[user_id].cookies = data;
callback();
}
app.use(express.static(__dirname + '/static'));
cmd.get("sudo kill $(sudo lsof -t -i:3003)", function(){
	app.listen(3003);
});
fs.readFile( __dirname + "/conf/settings.json", 'utf8', function(err, data){
						var settings = JSON.parse(data);
var httpProxy = require('http-proxy'),

    proxy = httpProxy.createProxyServer({});
cmd.get("sudo kill $(sudo lsof -t -i:"+ proxyPort+")", function(){


http.createServer(function(req, res) {
globalVariable.event.emit("http","Request Received",req);
req.headers.host = (!req.headers.host)? "": req.headers.host;
    var hostname = ((req.headers.host).match(":"))?req.headers.host.split(":")[0] : req.headers.host;
    var pathname = url.parse(req.url).pathname;
req.headers['x-forwarded-for'] = getClientIP(req);
if(req.headers['x-forwarded-for'] != undefined){ 
		if(settings.DNS[hostname]){

			proxy.web(req, res, { target: settings.DNS[hostname],
  
    xforward: true,
  
  changeOrigin: false // changes the origin of the host header to the target URL 
},function(e) { res.end("Serveur Indisponible");});
		}else{
proxy.web(req, res, { target: "http://localhost:3003",
xforward: true,
  changeOrigin: false});
}
        }
}).listen(proxyPort, function() {
    console.log('Proxy:listening on port : ' + proxyPort);
});
});
// We simulate the 3 target applications

console.log("Serveur web lancé sur localhost:3003 ...");
});