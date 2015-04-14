var skillQuery;
var mysql = require("./mysql");

exports.skillDetail = skillDetail;
exports.addSkill=addSkill;

function addSkill (message, callback) {
	var res = {};
	var addSkillQuery="INSERT INTO LinkedIn.Skill_Details(User_ID, Skill_Name) VALUES ("+message.User_ID+", '"+message.Skill+"');";
	
	mysql.fetchData(function(err,results){
		if(err) {
			throw err;
		} else {
				res.code = "200";
				console.log("User Skill added Succesfully");
				callback(null,res);
		}
	}, addSkillQuery);
}

function skillDetail(message,callback) {
	
	console.log("Entered in Server skill module");
	var res = {};
	
		var skillQuery = "SELECT * FROM LinkedIn.Skill_Details where User_ID='"+message.userId+"'";
		console.log("Query Log : " + skillDetail.toString());
		
		mysql.fetchData(function(err,results){
			if(err) {
				console.log(err);
			} else {
				if (results.length > 0){
					console.log(results);
					skillDetail = JSON.stringify(results);
					res.skillDetails = skillDetail;
					res.code = "200";
					console.log("User skill Sent");
					callback(null,res);
				} 
				else
				{
					res.code="200";
					callback(null,res);
				}
			}
		}, skillQuery);
	
}

