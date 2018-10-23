var uuidV1 = require('uuid/v1');
module.exports = {
    list: function (callback) {

        module.exports.get_admin(function (adminID) {
            global.globalVariable.database.mongoDB.collection("users").find({}).toArray(function (err, result) {
                if (err)
                    throw err;
                var l = result.length;
                var toReturn = [];
                var NewList = [];
                for (var e = 0; e < l; e++) {
                    if (result[e].userID == adminID) {
                        NewList.push({
                            userName: result[e].userName,
                            userID: result[e].userID,
                            isDigit: ((result[e].isDigitPassword) ? result[e].isDigitPassword : false)
                        })
                        delete result[e];
                    } else {
                        toReturn.push({
                            userName: result[e].userName,
                            userID: result[e].userID,
                            isDigit: ((result[e].isDigitPassword) ? result[e].isDigitPassword : false)
                        })
                    }
                }
                return callback(NewList.concat(toReturn).filter((obj) => obj));

            });
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
                                module.exports.isAdmin(result[0].userID, function (re) {
                                    resultX[0].isAdmin = re;
                                    return callback(true, result[0], resultX[0]);
                                });
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
        if (client.isAdmin) {
            module.exports.get_admin(function (adminID) {
                global.globalVariable.database.mongoDB.collection("users").find({}).sort({
                    'userName': 1
                }).toArray(function (err, result) {
                    if (err)
                        throw err;
                    var f = result.length;
                    var NewList = [];
                    for (var e = 0; e < f; e++) {
                        delete result[e].password;
                        delete result[e].tries;
                        delete result[e]['_id'];

                        if (result[e].userID == adminID) {
                            NewList.push(result[e])
                            delete result[e];
                        }

                    }
                    callback(JSON.stringify(NewList.concat(result).filter((obj) => obj)))
                });
            });
        } else {
            return callback('{"error":"Only admin can access this list"}')
        }
    },
	groupsList: function (client, callback) {
        if (client.isAdmin) {
            
                global.globalVariable.database.mongoDB.collection("groups").find({}).sort({
                    'subordonnatedTo': 1
                }).toArray(function (err, result) {
                    if (err)
                        throw err;
                   
                    callback(JSON.stringify(result))
                });
           
        } else {
            return callback('{"error":"Only admin can access this list"}')
        }
    },
    isAdmin: function (userID, callback) {
        module.exports.get_admin(function (res) {

            if (userID == res) {
                return callback(true);
            } else {
                return callback(false);
            }
        });
    },
    update_user: function (data, callback) {
        if (data.email.trim() != "" && data.username.trim() != "") {
            global.globalVariable.database.mongoDB.collection("users").update({
                userID: data.userID
            }, {
                $set: {
                    userName: data.username,
                    name: data.name,
                    surname: data.surname,
                    phone: data.phone,
                    email: data.email,
                    birthdayDay: data.birthdayDay,
                    birthdayMonth: data.birthdayMonth,
                    birthdayYear: data.birthdayYear
                }
            }, function () {
                callback("true");
            });
        } else {
            callback("emptyEU")
        }
    },
    delete_user: function (data, callback) {

        global.globalVariable.database.mongoDB.collection("users").remove({
            userID: data.userID
        }, function () {
            callback("true");
        });

    },
	  delete_group: function (client,data, callback) {
module.exports.groupsList(client,function(res){
	res = JSON.parse(res);
	module.exports.userList(client,function(resy){
	resy = JSON.parse(resy);
		if(has_child(res,data.groupId) ||  has_users(resy,data.groupId)){
			    callback("false");
		}else{
        global.globalVariable.database.mongoDB.collection("groups").remove({
            id: data.groupId
        }, function () {
            callback("true");
        });
		}
});
});
    },
    /* L'admin doit prendre ses responsabilités; c'est à dire qu'il n'a pas besoin de leur mot de passe pour modifier les informations des utilisateurs;
    en effet s' il reste connecté, une personne mal intentionnée peut modifier les mots de passe des utilisateurs*/
    update_user_password: function (data, callback) {
        if (data.password != "") {
            if (data.isDigitPassword == "true" && data.password.length == 6 && /^\d+$/.test(data.password) || data.isDigitPassword == "false") {

                if (data.passwordConfirm == data.password) {
                    module.exports.get_admin(function (res) {

                        if (data.userID == res) {
                            global.globalVariable.database.mongoDB.collection("users").find({
                                "userID": data.userID
                            }).toArray(function (err, result) {
                                if (err)
                                    throw err;
                                if (result[0]) {
                                    if (result[0].password == data.oldPassword) {
                                        global.globalVariable.database.mongoDB.collection("users").update({
                                            userID: data.userID
                                        }, {
                                            $set: {
                                                password: data.password,
                                                isDigitPassword: data.isDigitPassword
                                            }
                                        }, function () {
                                            callback("true");
                                        });

                                    } else {
                                        callback("oldPasswordWrong")
                                    }
                                }
                            });
                        } else {
                            global.globalVariable.database.mongoDB.collection("users").update({
                                userID: data.userID
                            }, {
                                $set: {
                                    password: data.password,
                                    isDigitPassword: data.isDigitPassword
                                }
                            }, function () {
                                callback("true");
                            });
                        }
                    });
                } else {
                    callback("unmatching")
                }

            } else {
                callback("notDigit")
            }
        } else {
            callback("empty")
        }

    },
    add_user: function (data, callback) {
        if (data.email && data.username) {
            if (data.password != "") {
                if (data.isDigitPassword == "true" && data.password.length == 6 && /^\d+$/.test(data.password) || data.isDigitPassword == "false") {

                    if (data.passwordConfirm == data.password) {

                        global.globalVariable.database.mongoDB.collection("users").insert({
                            userID: uuidV1(),

                            password: data.password,
                            isDigitPassword: data.isDigitPassword,
                            userName: data.username,
                            email: data.email

                        }, function () {
                            callback("true");
                        });

                    } else {
                        callback("unmatching")
                    }

                } else {
                    callback("notDigit")
                }
            } else {
                callback("empty")
            }
        } else {
            callback("emptyEU")
        }
    },
    add_group: function (data, callback) {
        if (data.name) {

            global.globalVariable.database.mongoDB.collection("groups").insert({
                "id": uuidV1(),

                subordonnatedTo: data.subordonnatedTo,

                name: data.name

            }, function () {
                callback("true");
            });

        } else {
            callback("emptyGroupName")
        }
    },
    get_admin: function (callback) {
        global.globalVariable.database.mongoDB.collection("settings").findOne(function (err, res) {
            if (err)
                throw err;

            return callback(res.adminID);
        });
    }
};
function has_child(res,id){
	for(var e = res.length; e--;){
		if(res[e].subordonnatedTo == id){
			return true;
		}
	}
	return false;
}
function has_users(res,id){
	
   
       for(var e = res.length; e--;){
		if(res[e].groupId == id){
			return true;
		}
	}
	return false;
	
}