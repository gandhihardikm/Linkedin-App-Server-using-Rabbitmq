
var mysql = require("./mysql");
var passwordHash = require("password-hash");		
var clientUrl = "http://10.0.0.152:5564";

exports.addUser = addUser;

function addUser(msg,callback){
	console.log("Entered in Server signup module");
	var res = {};
	checkForExistingUser(msg.newUserEmail,function(err,results){
		if(results){
			console.log("User already Exist.");
//			response.header("Access-Control-Allow-Origin", clientUrl);
//			response.header("Access-Control-Allow-Credentials","true");
			res.code = "0";
			callback(null,res);
		}else{
			var hashedpassword = passwordHash.generate(msg.newUserPassword);
			console.log(hashedpassword);
			var insertUserQuery="INSERT into LinkedIn.User_Details(User_Name,Email_ID,Password) VALUES('"+msg.name+"','"+ 
			msg.newUserEmail+"','"+hashedpassword+"');"
			console.log(insertUserQuery);
			mysql.fetchData(function(err,results){
				if(err){
					throw err;
				}else{
					console.log("new User info added");
//					response.header("Access-Control-Allow-Origin", clientUrl);
//					response.header("Access-Control-Allow-Credentials","true");
					res.code = "200";
					callback(null,res);
				}
			},insertUserQuery);
		}
	});	
}

function checkForExistingUser(newUserEmail,callback){
	var getUser="select * from User_Details where Email_ID='"+newUserEmail+"'";	
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}else {
			callback(err,results.length>0);
		}  
	},getUser);
}



