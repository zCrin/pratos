/*
 * License MIT
 * « Copyright © 2018, Pratos »
 * v 1.4.1

 */
var how = 0;

var fs = require("fs");
var colors = require('colors');
fs.readFile(__dirname + "/conf/settings.json", 'utf8', function (err, settingsRaw) {
    "use strict";
    system('Pratos is starting, please wait.\n\nIf you have troubles with Pratos, any bug, feel free to contact the owner or its father, zCrin.');
    if (isJson(settingsRaw)) {

        var mongo = require('mongodb'),
        MongoClient = mongo.MongoClient,
        settings = JSON.parse(settingsRaw);
        MongoClient.connect("mongodb://localhost/pratos", function (error, db) {
            if (error)
                throw error;
            if (!error) {
                console.log("\nSystem : Connected to Pratos' database.".green);
db.collection("users_cookies").remove({expiration:{$lt:(Date.now() - 3.6e+6)}},function(){
system("Removed old sessions from database (doing this every 5 hours)");
setInterval(function(){
db.collection("users_cookies").remove({expiration:{$lt:(Date.now() - 3.6e+6)}},function(){
system("Removed old sessions from database (doing this every 5 hours)");
});
}, 1.8e+7);
});
                var globalVariable = [];
				global.globalVariable = globalVariable;
                globalVariable.database = {
                    ObjectID: mongo.ObjectID,
                    MongoClient: MongoClient,
                    mongoDB: db
                };

                var express = require('express'),
                app = express(),
                qs = require('qs'),
                Busboy = require('busboy'),

                session = require("express-session")({
                        secret: "s",
                        resave: true,
                        saveUninitialized: true
                    }),
                uuidV1 = require('uuid/v1'),
                EventEmitter = require("events").EventEmitter,
               cookieParser = require('cookie-parser'),
                cmd = require('node-cmd'),
                http = require('http'),
                httpProxy = require('http-proxy'),
                url = require("url"),
                webpages = require("./lib/webpages.js"),
                sockets = require("./lib/sockets.js"),
                plugins = require("pratos_plugin_class"),
                style = require("pratos_style_class"),
                Accessories = require("pratos_accessories_class"),
                ioServer = require('socket.io'),
                io = new ioServer(),
                sharedsession = require('socket.io-express-session'),
                IOcookieParser = require('socket.io-cookie'),
                conditions = require('pratos_conditions_class');

                style.init(globalVariable);

                globalVariable.event = new EventEmitter();

                if (settings.https.https_enable) {
                    app.enable('trust proxy');
                }

                app.use(session)
				.use(cookieParser())
                .use(function (req, res, next) {

                    var user_id = uuidV1();
                    globalVariable[user_id] = Object();
                    req.user_id = user_id;
                    globalVariable[user_id].request = req;
                    /*load_cookie(req, res, function () {
                        next();
                    });
					*/
					next();
                })

                .use(function (req, res, next) {
                    if (req.method === 'POST') {
                        if (/multipart\/form-data/.test(req.headers['content-type'])) {
                            globalVariable[req.user_id].request.bodyPratos = {}
                            var busboy = new Busboy({
                                    headers: req.headers
                                });
                            busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

                                file.on('data', function (data) {

                                    globalVariable[req.user_id].request.bodyPratos[fieldname] = data;
                                });

                            });
                            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {

                                globalVariable[req.user_id].request.bodyPratos[fieldname] = val;
                            });
                            busboy.on('finish', function () {
                                next();
                            });
                            req.pipe(busboy);
                        } else {
                            var body = '';
                            req.on('data', function (data) {
                                body += data;

                                if (body.length > 1e6) {
                                    console.log('destroyed')
                                    req.connection.destroy();
                                }
                            });

                            req.on('end', function () {
                                var multipartRegex = /multipart\/form-data/;
                                if (!multipartRegex.test(req.headers['content-type'])) {

                                    globalVariable[req.user_id].request.bodyPratos = qs.parse(body);
                                    next();
                                }
                            });
                        }
                    } else {
                        next();
                    }
                })

                .use(logErrors);
                function logErrors(err, req, res, next) {
                    console.error(err);
                    next(err);
                }

                function load_cookie(req, res, callback) {
                    globalVariable.event.emit("cookiesLoaded", new Cookies(req, res), req.user_id, callback);
                    globalVariable.event.on("cookiesLoaded", cookiesLoadedCallback);
                }
                function cookiesLoadedCallback(data, user_id, callback) {
                    globalVariable.event.removeListener("cookiesLoaded", cookiesLoadedCallback);
                    globalVariable[user_id].cookies = data;
                    callback();
                }

                if (settings.https.https_enable) {
                    cmd.get("sudo kill $(sudo lsof -t -i:" + settings.https.https_port + ")", function () {
                        var https = require('https');

                        var proxyHTTPS = httpProxy.createServer();
                        start_io();
                        var httpsServer = https.createServer({
                                key: fs.readFileSync(__dirname + '/key.pem'),
                                cert: fs.readFileSync(__dirname + '/cert.pem')
                            }, function (req, res) {
                                req.on('error', function (err) {
                                    console.log(err)

                                })
                                req.headers.host = (!req.headers.host) ? "" : req.headers.host;
                                var hostname = ((req.headers.host).match(":")) ? req.headers.host.split(":")[0] : req.headers.host,
                                pathname = url.parse(req.url).pathname;
                                req.headers['x-forwarded-for'] = getClientIP(req);
                                if (req.headers['x-forwarded-for'] != undefined) {
                                    if (settings.https.DNS[hostname]) {

                                        findTrueForward(hostname, settings.https, function (x) {

                                            proxyHTTPS.web(req, res, {
                                                target: x,
                                                xforward: true,
                                                changeOrigin: false,
                                                ws: true

                                            }, function (e) {
                                                console.log("\nSystem : There was an error while redirecting.".red);
                                                console.log(e.red);
                                                res.end("Serveur Indisponible");
                                            });
                                        });
                                    } else {
                                        console.log(("\nSystem : There was an error while redirecting to hostname : " + hostname + ".").red);
                                        res.end("DNS introuvable : " + hostname);
                                    }
                                }

                            }).listen(settings.https.https_port);
                        proxyHTTPS.on('proxyReq', function (proxyReq, req) {
                            // keep a ref
                            req._proxyReq = proxyReq;
                        });

                        proxyHTTPS.on('error', function (err, req, res) {
                            console.log(err)
                            if (req.socket.destroyed && err.code === 'ECONNRESET') {
                                req._proxyReq.abort();
                            }
                        });

                        io.attach(httpsServer);

                        console.log(("\nSystem : HTTPS server started on port : " + settings.https.https_port).blue);
                    });
                }

                cmd.get("sudo kill $(sudo lsof -t -i:" + settings.website.webserver_port + ")", function () {
                    var e = app.listen(settings.website.webserver_port);
                    io.attach(e);

                    start_io();
                    console.log(("\nSystem : HTTP server started on port : " + settings.website.webserver_port).blue);
                    http.get('http://' + settings.website.webserver_name).on("error", (err) => {
                        if (err.message == 'socket hang up') {
                            console.log("\nError (normal): init connection failed allowing new connections".yellow);
                        } else {
                            console.log("Error: " + err.message);
                        }
                    });
                });

                cmd.get("sudo kill $(sudo lsof -t -i:" + settings.website.proxy_port + ")", function () {

                    var proxyHTTP = httpProxy.createProxyServer();
                    http.createServer(function (req, res) {
                        req.on('error', function (err) {
                            console.log(err)

                        })
                        req.headers.host = (!req.headers.host) ? "" : req.headers.host;
                        var hostname = ((req.headers.host).match(":")) ? req.headers.host.split(":")[0] : req.headers.host,
                        pathname = url.parse(req.url).pathname;
                        req.headers['x-forwarded-for'] = getClientIP(req);
                        if (req.headers['x-forwarded-for'] != undefined) {
                            if (settings.DNS[hostname]) {

                                findTrueForward(hostname, settings, function (x) {

                                    proxyHTTP.web(req, res, {
                                        target: x,
                                        xforward: true,
                                        changeOrigin: false,
                                        ws: true

                                    }, function (e) {
                                        console.log("\nSystem : There was an error while redirecting.".red);
                                        console.log(e.red);
                                        res.end("Serveur Indisponible");
                                    });
                                });

                            } else {
                                console.log(("\nSystem : There was an error while redirecting to hostname : " + hostname + ".").red);

                                res.end("DNS introuvable : " + hostname);

                            }
                        }
                    }).listen(settings.website.proxy_port);

                    proxyHTTP.on('proxyReq', function (proxyReq, req) {
                        // keep a ref
                        req._proxyReq = proxyReq;
                    });

                    proxyHTTP.on('error', function (err, req, res) {
                        console.log(err)
                        if (req.socket.destroyed && err.code === 'ECONNRESET') {
                            req._proxyReq.abort();
                        }
                    });
                });
                plugins.list(globalVariable, app, function (data) {
                    globalVariable = data;
                    plugins.webPages(app, globalVariable);
                });
                webpages(app, globalVariable, Accessories, style);
                app.use(express.static(__dirname + '/static'));

                Accessories.detect_change(globalVariable, function () {

                    conditions.load(globalVariable);
                    conditions.webFiles(app, globalVariable);
                });

                function start_io() {

                    how++;
                    if (how == 2) {
                        console.log(("\nSystem : Socket server is starting.").blue);
                        io.use(sharedsession(session, {
                                autoSave: true
                            }))
                        .use(IOcookieParser)
                        .use(function (client, next) {
                            var user_id = uuidV1();
                            globalVariable[user_id] = {
                                request: {
                                    user_id: user_id,
                                    session: client.handshake.session,
                                    connection: {
                                        remoteAddress: client.handshake.address
                                    },
                                    headers: {
                                        "user-agent": client.request.headers['user-agent'],
                                        "x-forwarded-for": client.handshake.address
                                    }
                                },
                                cookies: {
                                    get: function (name) {
                                        return client.request.headers.cookie[name];
                                    }
                                }
                            };
                            client.user_id = user_id;
                            next();
                        });

                        sockets(io, globalVariable, Accessories, style);
                    }

                }

                globalVariable.restart_homebridgeState = 0;
                globalVariable.restart_homebridge = function (callback) {
                    if (globalVariable.restart_homebridgeState == 0) {
                        console.log(("\nSystem : Homebridge will restart.").blue);
                        globalVariable.restart_homebridgeState = 1;
                        cmd.get("sudo /etc/init.d/homebridge restart", function (out) {
                            if (out) {
                                console.log(("\nSystem : Homebridge has restarted.").blue);
                                setTimeout(function () {
                                    console.log('Resuming homebridge restart');
                                    globalVariable.restart_homebridgeState = 0;
                                    return callback();
                                }, 20000);
                            }
                        });
                    } else {
                        setTimeout(function () {
                            console.log('Resuming homebridge restart');
                            globalVariable.restart_homebridgeState = 0;
                            return callback();
                        }, 20000);
                    }
                };
            }
        });
        function findTrueForward(x, src, callback) {
            var v = x;
            while (src.DNS[x]) {
                v = src.DNS[x];
                x = v.replace('http://', '').replace('https://', '').split(':');
                x = x[0];

            }
            return callback(v);
        }
    } else {
        console.log("\nSystem : Pratos' configuration file is not JSON format.".red);
    }
    if (err) {
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
function getClientIP(req) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    patt = new RegExp(':');
    if (patt.test(ip)) {
        ip = ip.split(":");
        return ip[(ip.length - 1)];
    }
    return ip;
}
function system(textTo) {
    textTo = '\nSystem : ' + textTo;
    console.log(textTo.green)
}
