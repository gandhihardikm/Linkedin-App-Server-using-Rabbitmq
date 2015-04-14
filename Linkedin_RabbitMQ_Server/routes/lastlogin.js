
var mysql = require("./mysql");

exports.getLastlogin = getLastlogin;

function getLastlogin(msg,callback){
		console.log("Entered in Server lastlogin module");
		var res = {};
		//var getUser="select Last_Login from LinkedIn.User_Details where User_ID='"+msg.User_ID+"'";	
		var updateQuery="UPDATE LinkedIn.User_Details SET Last_Login='"+getdatetime()+"' WHERE User_ID='"+msg.User_ID+"'";
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}else 
			{			
				//var updateQuery="UPDATE LinkedIn.User_Details SET Last_Login='"+getdatetime()+"' WHERE User_ID='"+msg.User_ID+"'";
				//console.log("Updating token : " + updateQuery);
				//mysql.fetchData(function (err,updateresults){
				//	if(err){
				//		throw err;
				//	}else{		
						res.code = "200";
						//res.value = "Succes Login";
						//res.lastlog = results[0].Last_Login;
						callback(null,res);
				//	}
				//},updateQuery);
		}  
	},updateQuery);
}

function getdatetime(){
	var currentdate = new Date(); 
	var datetime = currentdate.getFullYear() + "-"
	                + (currentdate.getMonth()+1)  + "-" 
	                + currentdate.getDate() + " "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":" 
	                + currentdate.getSeconds();
	return datetime;
}