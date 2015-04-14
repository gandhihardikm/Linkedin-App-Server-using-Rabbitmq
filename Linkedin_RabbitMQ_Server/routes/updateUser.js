
var mysql = require("./mysql");

function update (message,callback) {
	var res = {};
		var updateUser = "UPDATE LinkedIn.User_Details SET "+ message.field +"='"+ message.name +"' where User_ID='"+message.User_ID+"'";
		console.log("Query Log : " + updateUser.toString());
		
		mysql.fetchData(function(err,results){
			if(err) {
			
			} else {
					res.code="200"
					console.log("User Found Succesfully");
					callback(null,res);
			}
		}, updateUser);
}

exports.update = update;