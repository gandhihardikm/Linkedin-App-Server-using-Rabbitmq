var education;
var mysql = require("./mysql");

exports.educationDetails = educationDetails;
exports.addEducation=addEducation;
exports.updateEducation=updateEducation;

function updateEducation (message,callback){
	
	var res={};
	console.log("Updating Education field");
	if (message.field === 'Year_of_Joining' || message.field === 'Year_of_Ending') {
		var d = new Date(message.name);
		message.name = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
	}
	
	var updateEduQuery="UPDATE LinkedIn.Education_Details SET "+ message.field +"='"+ message.name +"' where User_ID='"+message.User_ID+"' AND Edu_ID = "+message.eduID+";";
	mysql.fetchData(function(err,results){
		if(err) {
			throw err;
		} else {		
				res.code="200";
				console.log("Education Info updated Succesfully");
				callback(null,res);
		}
	}, updateEduQuery);
}


function addEducation (message, callback) {
	var res = {};
	console.log("Adding Education");
	
	var addEduQuery="INSERT INTO LinkedIn.Education_Details(User_ID, Degree, University_Name, Courses, Year_of_Joining, Year_of_Ending) VALUES ("+message.User_ID+", '"+message.Degree+"', '"+message.University_Name+"', '"+message.Courses+"', '"+message.YOJ+"', '"+message.YOE+"');";
	
	mysql.fetchData(function(err,results){
		if(err) {
			throw err;
		} else {		
				res.code="200";
				console.log("Education Info added Succesfully");
				callback(null,res);
		}
	}, addEduQuery);
}

function educationDetails(message, callback) {
	
		console.log("Entered in server edu module");
		var res = {};
		var educationDetail = "SELECT * FROM LinkedIn.Education_Details where User_ID='"+message.userId+"'";
		
		
		mysql.fetchData(function(err,results){
			if(err) {
				console.log(err);
				console.log(results);
				console.log(err.code);
				
			
			} else {
				
					if (results.length > 0){
						//console.log(results);
						education = JSON.stringify(results);
						console.log(education);
						res.educationDetails = education;
						res.code = "200";
						
						console.log("Education Sent");
						callback(null,res);
					} 
					else
					{
						res.code="200";
						callback(null,res);
					}
				}
			
		}, educationDetail);
	
}

