
var mysql = require("./mysql");
var jwt = require('jwt-simple');
exports.signout = signout;


function signout(msg,callback){
	var res = {};
	console.log(msg.useremail + " is Signed out successfully");
	res.code = "200";
	
	callback(null,res);			
}

