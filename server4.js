var fs = require("fs");

function isJson(str) { //function to know if a variable is JSON 
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


fs.readFile( __dirname + "/conf/settings.json", 'utf8', function(err, settings){
			if(isJson(settings)){
				var ObjectID = require('mongodb').ObjectID;
				var MongoClient =require('mongodb').MongoClient;
			MongoClient.connect("mongodb://localhost/pratos", function(error, db) {
    if (error) throw error;
if(!error){
var globalVariable = [];
globalVariable.database = {
	ObjectID:ObjectID,
	MongoClient:MongoClient,
	mongoDB:db
};

			settings = JSON.parse(settings);

var http = require('http'),
 //proxy  = require('http-proxy-middleware'),
	EventEmitter = require("events").EventEmitter,
	express = require('express'),
	fileUpload = require('express-fileupload'),
	url = require("url"),
	session = require("express-session")({
    secret: "s",
    resave: true,
    saveUninitialized: true
  }),
sharedsession =require('socket.io-express-session'),
IOcookieParser = require('socket.io-cookie'),
	bodyParser = require('body-parser'),
	Cookies = require("cookies"),
	User = require("pratos_user_class"),
	
	 ioServer = require('socket.io'),
	  io = new ioServer(),
	app = express(),
	plugins = require("pratos_plugin_class"),
	uuidV1 = require('uuid/v1');
	
	 
	globalVariable.event = new EventEmitter(),
	cmd=require('node-cmd'),
	proxyPort=settings.website.proxy_port;
	webserverPort= settings.website.webserver_port;
var Accessories = require("pratos_accessories_class");
var style = require("pratos_style_class");
style.init(globalVariable);
/** Configuration */
var conditions = require('pratos_conditions_class');
var homebridgeIsrestarting=0;
globalVariable.restart_homebridge =function(callback){
	if(homebridgeIsrestarting == 0){
		console.log('Homebridge will restart');
		homebridgeIsrestarting=1;
	cmd.get("sudo /etc/init.d/homebridge restart", function(out){
		
  						if(out){
							console.log('Homebridge has restarted');
							setTimeout(function(){ console.log('Resuming homebridge restart');homebridgeIsrestarting = 0; return callback();},20000);
						}
		});
	}else{
	setTimeout(function(){ console.log('Resuming homebridge restart');homebridgeIsrestarting = 0; return callback();},20000);
	}
};
		

if(settings.https.https_enable){
app.enable('trust proxy');
}/*
// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
app.use (function (req, res, next) {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }
});
}*/
app
/*
.use(function(req,res,next){
		req.headers.host = (!req.headers.host)? "": req.headers.host;
    	var hostname = ((req.headers.host).match(":"))?req.headers.host.split(":")[0] : req.headers.host;
    	var pathname = url.parse(req.url).pathname;
		req.headers['x-forwarded-for'] = getClientIP(req);
		if(req.headers['x-forwarded-for'] != undefined){ 
			if(settings.DNS[hostname]){
 proxy({target:settings.DNS[hostname], changeOrigin: true,xforward: true});

			}else{
				 proxy({target:"http://localhost:"+ webserverPort, changeOrigin: true,xforward: true});
			
			}
      }
	
})*/
.use(fileUpload())
.use(bodyParser.json())
.use(bodyParser.urlencoded({
	extended: true
}))
.use(
	session
)
.use(function(req,res,next){
	var user_id = uuidV1();

	globalVariable[user_id] = Object();
	req.user_id = user_id;
	globalVariable[user_id].request = req;
	load_cookie(req,res,function(){

		next();
	});
});
conditions.load(globalVariable);
conditions.webFiles(app,globalVariable);
plugins.list(globalVariable, app, function(data){
	globalVariable = data;
	plugins.webPages(app, globalVariable);
});
//Page : index

app.get('/', function(req, res) {
	User.verify_connection(req.user_id,globalVariable, function(user_res){
		if(user_res != true){
			res.setHeader('Content-Type', 'text/html');
			res.render( __dirname + '/views/index.ejs',{content: globalVariable.contentPlugins,page_name:"index"});
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
						res.render( __dirname + '/views/admin_' + req.params.adminURI + '.ejs', {nav: res_nav, content: globalVariable.contentPlugins, homepage: res_homepage,page_name: "admin/"+req.params.adminURI});
					});
				}
else if(req.params.adminURI == "settings"){
					

require("pratos_homepage_class").construct(globalVariable.homepagePlugins, function(res_homepage){
						res.render( __dirname + '/views/admin_' + req.params.adminURI + '.ejs', {nav: res_nav, content: globalVariable.contentPlugins, page_name: "admin/"+req.params.adminURI , settings: globalVariable. pluginsSettings});
					});
				}
				else{
					res.render( __dirname + '/views/admin_' + req.params.adminURI + '.ejs', {nav: res_nav, page_name: "admin/"+req.params.adminURI , content: globalVariable.contentPlugins});

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

//page list_rooms
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
			fs.readFile( __dirname + "/conf/auto_accessories_icon.json", 'utf8', function(err, data){
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

app.get('/css/:file.ejs', function(req, res) {
	var global_color = 'rgb('+ globalVariable.colorStyle.r+","+ globalVariable.colorStyle.g+","+ globalVariable.colorStyle.b+")";
var background_color = 'rgb('+ globalVariable.secondColorStyle.r+","+ globalVariable.secondColorStyle.g+","+ globalVariable.secondColorStyle.b+")";

	globalVariable.session = req.session;
	res.setHeader('Content-Type', 'text/css');
	res.render(__dirname + '/views/css/' + req.params.file + '.ejs', {variable: globalVariable, global_color:global_color, page_name: req.params.file,background_color: background_color});

delete globalVariable[req.user_id];
});

app.get('/js/:file.ejs', function(req, res) {
	
	globalVariable.session = req.session;
	res.setHeader('Content-Type', 'application/javascript');
	res.render(__dirname + '/views/js/' + req.params.file + '.ejs', {variable: globalVariable,  page_name: req.params.file});

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
					txt[path1] = '\/' + path1;
					txt[path2] = '\/' + path2;
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



Accessories.detect_change(globalVariable);


app.use(express.static(__dirname + '/static'));
cmd.get("sudo kill $(sudo lsof -t -i:"+ webserverPort+")", function(){
	app.listen(webserverPort);

console.log("Pratos : webserver listening on port :"+ webserverPort);
});

var httpProxy = require('http-proxy'),
	proxy = httpProxy.createProxyServer({});
	app.use(bodyParser.json());
cmd.get("sudo kill $(sudo lsof -t -i:"+ proxyPort+")", function(){
	var serverCreated = http.createServer(function(req, res) {
		
		globalVariable.event.emit("http","Request Received",req);
		req.headers.host = (!req.headers.host)? "": req.headers.host;
    	var hostname = ((req.headers.host).match(":"))?req.headers.host.split(":")[0] : req.headers.host;
    	var pathname = url.parse(req.url).pathname;
		req.headers['x-forwarded-for'] = getClientIP(req);
		if(req.headers['x-forwarded-for'] != undefined){ 
			if(settings.DNS[hostname]){
//console.log(req.headers['accept']);
				proxy.web(req, res, { target: settings.DNS[hostname],
  					xforward: true,
  					changeOrigin: false // changes the origin of the host header to the target URL 
				},function(e) { 
					res.end("Serveur Indisponible");});
			}else{
				proxy.web(req, res, { target: "http://localhost:"+ webserverPort,
					xforward: true,
  					changeOrigin: false});
			}
      }
	  
	});
if(settings.https.https_enable){
	var https = require('https');

 
		var httpsServer = https.createServer({
  			key: fs.readFileSync('key.pem'),
  			cert: fs.readFileSync('cert.pem')
	}, app).listen(settings.https.https_port);
console.log("Pratos : HTTPS server started on port : "+ settings.https.https_port);
io.attach(httpsServer);

 }


io.attach(serverCreated);



io.use(sharedsession(session, {
    autoSave:true
})).use( IOcookieParser).use(function(client,next){
var user_id = uuidV1();
globalVariable[user_id] = {
request:{user_id: user_id,
session: client.handshake.session,
connection:{
	remoteAddress: client.handshake.address
},
headers:{
"user-agent":client.request.headers['user-agent'],
"x-forwarded-for": client.handshake.address
}
},
cookies: {get:function(name){return client.request.headers.cookie[name];}}
};

client.user_id = user_id;

next();
});

io.on('error', function(ex) {
  console.log("handled error");
  console.log(ex);
});

io.on('connection', function(client){

	
style.ioConnection(client, globalVariable);
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

User.verify_connection(client.user_id,globalVariable, function(user_res){
		if(user_res == true){
	

      
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
serverCreated.listen(proxyPort, function() {
    console.log('Pratos : proxyserver listening on port :' + proxyPort);
	http.get('http://'+settings.website.webserver_name)

});
// We simulate the 3 target applications


});
				}
			});
		}
});