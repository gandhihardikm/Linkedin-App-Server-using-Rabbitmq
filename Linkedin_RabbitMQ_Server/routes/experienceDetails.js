var experience;	
var mysql = require("./mysql");

exports.experienceDetails = experienceDetails;
exports.addExperience=addExperience;
exports.updateExperience=updateExperience;

function updateExperience (message,callback){
	var res={};
	console.log("Updating Experience field");
	if (message.field === 'Start_Date' || message.field === 'End_Date') {
		var d = new Date(message.name);
		message.name = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
	}
	
	var updateEduQuery="UPDATE LinkedIn.Experience_Details SET "+ message.field +"='"+ message.name +"' where User_ID='"+message.User_ID+"' AND Exp_ID = "+message.expID+";";
	mysql.fetchData(function(err,results){
		if(err) {
			throw err;
		} else {		
				res.code="200";
				console.log("Experience Info updated Succesfully");
				callback(null,res);
		}
	}, updateEduQuery);
}

function addExperience (message, callback) {
	var res = {};
	var addExpQuery="Insert into LinkedIn.Experience_Details (User_ID,Company_Name,Start_Date,End_Date,Job_Title,Job_Profile) " +
	"values ("+message.User_ID+",'"+message.Company+"','"+message.StartDate+"','"+message.EndDate+"','"+message.JobTitle+"','"+message.JobDesc+"'); " ;
	
	console.log(addExpQuery);
	mysql.fetchData(function(err,results){
		if(err) {
			throw err;
		} else {
				res.code = "200";
				console.log("User Experience added Succesfully");
				callback(null,res);
		}
	}, addExpQuery);
}

function experienceDetails(message, callback) {
	
	console.log("Entered in server experience module");
	var res = {};
	
	var experienceDetail = "SELECT * FROM LinkedIn.Experience_Details where User_ID='"+message.userId+"'";
	console.log("Query Log : " + experienceDetail.toString());
		
		mysql.fetchData(function(err,results){
			if(err) {
				console.log(err);
				console.log(results);
				console.log(err.code);
				 
			} else {
				
				if (results.length > 0){
					console.log(results);
					experience = JSON.stringify(results);
					res.experienceDetails = experience;
					res.code = "200";
					callback(null,res);
					console.log("User experiecen found");	
				}
				else
				{
					res.code="200";
					callback(null,res);
				}
			}
		}, experienceDetail);
}

