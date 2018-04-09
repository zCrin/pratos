/*
* License MIT
* « Copyright © 2018, Pratos »
* v 1.4.0
*/
var how=0;
var fs = require("fs");
var colors = require('colors');
fs.readFile( __dirname + "/conf/settings.json", 'utf8', function(err, settings){
	console.log('System : Pratos is starting, please wait.\n\nIf you have troubles with Pratos, any bug, feel free to contact the owner or its father, zCrin.'.green);
	if(isJson(settings)){

		var mongo = require('mongodb'),
		MongoClient =mongo.MongoClient,
		settings = JSON.parse(settings);
		MongoClient.connect("mongodb://localhost/pratos", function(error, db) {
    		if (error) throw error;
			if(!error){
				console.log("\nSystem : Connected to Pratos' database.".green);
				var globalVariable = [];
				globalVariable.database = {
					ObjectID: mongo.ObjectID,
					MongoClient:MongoClient,
					mongoDB:db
				};
				var express = require('express'),
				app = express(),
				fileUpload = require('express-fileupload'),
				bodyParser = require('body-parser'),
				session = require("express-session")({
    				secret: "s",
    				resave: true,
    				saveUninitialized: true
  				}),
				uuidV1 = require('uuid/v1'),
				EventEmitter = require("events").EventEmitter,
				Cookies = require("cookies"),
				cmd=require('node-cmd'),
				http = require('http'),
				httpProxy = require('http-proxy'),
				proxy = httpProxy.createProxyServer({}),
				url = require("url"),
				webpages = require("./lib/webpages.js"),
				sockets = require("./lib/sockets.js"),
				plugins = require("pratos_plugin_class"),
				style = require("pratos_style_class"),
				Accessories = require("pratos_accessories_class"),
				ioServer = require('socket.io'),
				io = new ioServer(),
				sharedsession =require('socket.io-express-session'),
				IOcookieParser = require('socket.io-cookie');
				//conditions = require('pratos_conditions_class');
				
				style.init(globalVariable);

				globalVariable.event = new EventEmitter();

				if(settings.https.https_enable){
					app.enable('trust proxy');
				}

   				function proxySend(req,res){ 
					req.headers.host = (!req.headers.host)? "": req.headers.host;
    				var hostname = ((req.headers.host).match(":"))?req.headers.host.split(":")[0] : req.headers.host,
					pathname = url.parse(req.url).pathname;
					req.headers['x-forwarded-for'] = getClientIP(req);
					if(req.headers['x-forwarded-for'] != undefined){ 
						if(settings.DNS[hostname]){
							proxy.web(req, res, { 
									target: settings.DNS[hostname],
									xforward: true,
  									changeOrigin: false,
									ws:true

								},function(e) { 
									console.log("\nSystem : There was an error while redirecting.".red);
									console.log(e.red);
									res.end("Serveur Indisponible");
							});
						}else{
							proxy.web(req, res, { 
									target: "http://localhost:"+ settings. website.webserver_port,
									xforward: true,
									ws:true,
  									changeOrigin: false

							});
						}
					}
					
				}
				function proxySendHttps(req,res){ 
				
					req.headers.host = (!req.headers.host)? "": req.headers.host;
    				var hostname = ((req.headers.host).match(":"))?req.headers.host.split(":")[0] : req.headers.host,
					pathname = url.parse(req.url).pathname;
					req.headers['x-forwarded-for'] = getClientIP(req);
					if(req.headers['x-forwarded-for'] != undefined){ 
						if(settings. https.DNS[hostname]){
							
							if(settings. https.DNS[hostname] != "http://localhost:"+settings. website.webserver_port){
							proxy.web(req, res, { 
									target: settings. https.DNS[hostname],
									xforward: true,
  									changeOrigin: false,
									secure:false,
									ws:true

								},function(e) { 
									console.log("\nSystem : There was an error while redirecting.".red);
									console.log(e.red);
									res.end("Serveur Indisponible");
							});}
							else{
								app(req,res)
							}
						}else{
							proxy.web(req, res, { 
									target: "http://localhost:"+settings. website.webserver_port,
									xforward: true,
									ws:true,
									secure:false,
  									changeOrigin: false

							});
						}
					}
					
				}
				app.use(fileUpload())
				.use(bodyParser.json())
				.use(bodyParser.urlencoded({
					extended: true
				}))
				.use(session)
				.use(function(req,res,next){
					var user_id = uuidV1();
					globalVariable[user_id] = Object();
					req.user_id = user_id;
					globalVariable[user_id].request = req;
					load_cookie(req,res,function(){
						next();
					});
				});
				function load_cookie(req,res,callback){
					globalVariable.event.emit("cookiesLoaded", new Cookies( req, res), req.user_id,callback);
					globalVariable.event.on("cookiesLoaded", cookiesLoadedCallback);
				}
				function cookiesLoadedCallback(data, user_id,callback){
					globalVariable.event.removeListener("cookiesLoaded", cookiesLoadedCallback);
					globalVariable[user_id].cookies = data;
					callback();
				}
				

				if(settings.https.https_enable){
						cmd.get("sudo kill $(sudo lsof -t -i:"+ settings.https.https_port +")", function(){
					var https = require('https');
					var httpsServer = https.createServer({
  						key: fs.readFileSync('key.pem'),
  						cert: fs.readFileSync('cert.pem')
					}, proxySendHttps).listen(settings.https.https_port);
					io.attach(httpsServer);
					start_io();
					console.log(("\nSystem : HTTPS server started on port : "+ settings.https.https_port).blue);
						});

				}
				cmd.get("sudo kill $(sudo lsof -t -i:"+ settings.website.webserver_port +")", function(){
					var serverCreated = http.createServer(proxySend ,app).listen(settings.website.webserver_port);
					
					console.log(("\nSystem : HTTP server started on port : "+ settings. website.webserver_port).blue);
				});
				cmd.get("sudo kill $(sudo lsof -t -i:"+ settings.website. proxy_port +")", function(){
						var e = app.listen(settings.website. proxy_port);
					io.attach(e);
					start_io();
				});
				plugins.list(globalVariable, app, function(data){
					globalVariable = data;
					plugins.webPages(app, globalVariable);
				});
				webpages(app,globalVariable,Accessories,style);
				app.use(express.static(__dirname + '/static'));
				
				Accessories.detect_change(globalVariable);
				
				//conditions.load(globalVariable);
				//conditions.webFiles(app,globalVariable);
				
				
				function start_io(){
					how++;
					if(how == 2){
						console.log(("\nSystem : Sockets server is starting.").blue);
						io.use(sharedsession(session, {
							autoSave:true
						}))
						.use( IOcookieParser)
						.use(function(client,next){
							var user_id = uuidV1();
							globalVariable[user_id] = {
								request:{
									user_id: user_id,
									session: client.handshake.session,
									connection:{
										remoteAddress: client.handshake.address
									},
									headers:{
										"user-agent":client.request.headers['user-agent'],
										"x-forwarded-for": client.handshake.address
									}
								},
								cookies: {
									get:function(name){
										return client.request.headers.cookie[name];
									}
								}
							};
							client.user_id = user_id;
							next();
						});
			
						sockets(io,globalVariable,Accessories,style);
					}
				}



	

					
				
				globalVariable.restart_homebridge =function(callback){
					if(homebridgeIsrestarting == 0){
						console.log(("\nSystem : Homebridge will restart.").blue);
						homebridgeIsrestarting=1;
						cmd.get("sudo /etc/init.d/homebridge restart", function(out){
							if(out){
								console.log(("\nSystem : Homebridge has restarted.").blue);
								setTimeout(function(){ console.log('Resuming homebridge restart');homebridgeIsrestarting = 0; return callback();},20000);
							}
						});
					}else{
						setTimeout(function(){ 
							console.log('Resuming homebridge restart');
							homebridgeIsrestarting = 0; 
							return callback();
						},20000);
					}
				};
			}
		});
	}else{
		console.log("\nSystem : Pratos' configuration file is not JSON format.".red);
	}
	if(err){
		console.log("\nSystem : There was an error while loading Pratos' configuration file.".red);
		console.log(err.red);
	}
});


function isJson(str) { //function to know if a variable is JSON 
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getClientIP(req){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
	patt = new RegExp(':');
	if(patt.test(ip)){
		ip = ip.split(":");
		return ip[(ip.length - 1)];
	}
return ip;
}
