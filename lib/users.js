var uuidV1 = require('uuid/v1');

module.exports = {
    list: function (callback) {
        global.globalVariable.database.mongoDB.collection("users").find({}).toArray(function (err, result) {
            if (err)
                throw err;
            var l = result.length;
            var toReturn = [];
            for (var e = 0; e < l; e++) {
                toReturn.push({
                    userName: result[e].userName,
                    userID: result[e].userID
                })
            }
            return callback(toReturn);

        });
    },
    connect: function (password, userID, user_id, callback) {
        global.globalVariable.database.mongoDB.collection("users").find({
            "userID": userID
        }).toArray(function (err, result) {
            if (err)
                throw err;
            if (result[0]) {
                if (!result[0].is_banned) {

                    if (password == result[0].password) {
                        var uniqId = uuidV1();
                        global.globalVariable.database.mongoDB.collection("users_cookies").insert({
                            sessionID: uniqId,
                            userID: userID,
                            expiration: (Date.now() + 3.6e+6)
                        });
                        global.globalVariable[user_id].request.session.session_id = uniqId;
                        return callback("ok");
                    } else {
                        module.exports.ban(result[0], function () {
                            return callback("password");
                        });

                    }
                } else {
                    return callback("banned");
                }
            } else {
                return callback("user");
            }
        });
    },
    is_connected: function (user_id, callback) {
        //init is always connected


        if (global.globalVariable[user_id].request.session.session_id) {
            global.globalVariable.database.mongoDB.collection("users_cookies").find({
                "sessionID": global.globalVariable[user_id].request.session.session_id
            }).toArray(function (err, result) {
                if (err)
                    throw err;
                if (result[0]) {
                    if (Date.now() < result[0].expiration || result[0].expiration == "permanent") {
                        if (!result[0].expiration == "permanent") {
                            global.globalVariable.database.mongoDB.collection("users_cookies").update({
                                "sessionID": global.globalVariable[user_id].request.session.session_id
                            }, {
                                $set: {
                                    expiration: (Date.now() + 3.6e+6)
                                }
                            });
                        }
                        module.exports.unban(result[0].userID, function () {
                            delete result[0].password;
                            global.globalVariable.database.mongoDB.collection("users").find({
                                userID: result[0].userID
                            }).toArray(function (err, resultX) {
                                if (err)
                                    throw err;
                                delete resultX[0].password;
                                return callback(true, result[0], resultX[0]);
                            });
                        });
                    } else {
                        return callback('Session expired');
                    }
                } else {
                    return callback('sessionDoesntExistAnymore');
                }
            });
        } else {
            return callback('sessionDoesntExist');
        }

    },
    ban: function (data, callback) {
        if (data.tries) {
            if (data.tries == 4) {
                global.globalVariable.database.mongoDB.collection("users").update({
                    userID: data.userID
                }, {
                    $set: {
                        tries: 0,
                        is_banned: true
                    }
                }, function () {
                    callback();
                });
            } else {
                global.globalVariable.database.mongoDB.collection("users").update({
                    userID: data.userID
                }, {
                    $set: {
                        tries: (data.tries + 1)
                    }
                }, function () {
                    callback();
                });
            }
        } else {
            global.globalVariable.database.mongoDB.collection("users").update({
                userID: data.userID
            }, {
                $set: {
                    tries: 1
                }
            }, function () {

                callback();
            });
        }
    },
    unban: function (userID, callback) {
        global.globalVariable.database.mongoDB.collection("users").update({
            userID: userID
        }, {
            $set: {
                tries: 0,
                is_banned: false
            }
        }, function () {
            callback();
        });
    },
    disconnect: function (user_id, userID, callback) {
        global.globalVariable.database.mongoDB.collection("users_cookies").remove({
            "sessionID": global.globalVariable[user_id].request.session.session_id
        });
        callback();
    },
    add_always_connected: function (userID, user_agent, callback) {
        var test = uuidV1();
        global.globalVariable.database.mongoDB.collection("users_cookies").insert({
            sessionID: test,
            userID: userID,
            expiration: "permanent",
            userAgent: user_agent
        });
        return callback(test);

    },
    remove_always_connected: function (id, callback) {

        global.globalVariable.database.mongoDB.collection("users_cookies").remove({
            "sessionID": id
        }, function () {
            return callback(true);
        });

    },
    connect_permanent: function (id, user_agent, user_id, callback) {

        global.globalVariable.database.mongoDB.collection("users_cookies").find({
            "sessionID": id
        }).toArray(function (err, result) {
            if (err)
                throw err;
            if (result[0]) {

                if (user_agent == result[0].userAgent) {
                    global.globalVariable.database.mongoDB.collection("users").find({
                        "userID": result[0].userID
                    }).toArray(function (err, result) {
                        if (err)
                            throw err;
                        if (result[0]) {
                            if (!result[0].is_banned) {

                                var uniqId = uuidV1();
                                global.globalVariable.database.mongoDB.collection("users_cookies").insert({
                                    sessionID: uniqId,
                                    userID: result[0].userID,
                                    expiration: (Date.now() + 3.6e+6)
                                });
                                global.globalVariable[user_id].request.session.session_id = uniqId;
                                return callback("ok");

                            } else {
                                return callback("bannedUser");
                            }
                        }
                    });
                } else {
                    module.exports.remove_always_connected(id, function () {
                        return callback('Devicemismatch')
                    });
                }
            } else {

                callback('sessiondoesntexist')
            }
        });
    },
    userList: function (client, callback) {
        if (client.userName == "admin") {
            global.globalVariable.database.mongoDB.collection("users").find({}).sort({'userName': 1}).toArray(function (err, result) {
                if (err)
                    throw err;
              var f = result.length;
			  var NewList = [];
			  for(var e=0;e<f;e++){
				   delete result[e].password;
				  delete result[e].tries;
				  delete result[e]['_id'];
				  if(result[e].userName == "admin"){
					  NewList.push(result[e])
					   delete result[e];
				  }
				 
				 
			  }
			  callback(JSON.stringify(NewList.concat(result).filter((obj) => obj )))
			});
		}
                else {
                    return callback('{"error":"Only admin can access this list"}')
                }
            }
            };
