
var mysql = require("./mysql");
var connectedPeopleList;

exports.inConnection = inConnection;
exports.pendingConnections = pendingConnections;
exports.searchUser=searchUser;
exports.acceptInvitation=acceptInvitation;
exports.sendInvitation=sendInvitation;

function sendInvitation(message,callback){
	var res={};
	console.log("server send invitation module");
	
	var sendInviteQuery="INSERT INTO LinkedIn.Invitation_Table(Invited_By_User_ID,Invited_To_User_ID,Status)VALUES("+message.User_ID+","+message.invitedUserid+",0);";
	mysql.fetchData(function(err,results){
		if(err) {
			console.log(err);
		} else {
			var sendInviteDummy="INSERT INTO LinkedIn.Invitation_Table(Invited_By_User_ID,Invited_To_User_ID,Status)VALUES("+message.invitedUserid+","+message.User_ID+",0);";
			mysql.fetchData(function(err,results){
				if(err) {
					console.log(err);
				} else {
					res.code = "200";
					console.log("Invitation sent Succesfully");
					callback(null,res);		
				}
			},sendInviteDummy);
		}
	}, sendInviteQuery);	
	
}

function acceptInvitation(message,callback){
	
	var res={};
	console.log("server accept invitation module");
	
	var acceptUserQuery = "UPDATE LinkedIn.Invitation_Table SET Status = 1 where (Invited_By_User_ID="+ message.User_ID +" AND Invited_To_User_ID="+ message.acceptedInvitationId +") OR (Invited_By_User_ID="+message.acceptedInvitationId+" AND Invited_To_User_ID="+ message.User_ID +");";
	console.log(acceptUserQuery);
	mysql.fetchData(function(err,results){
		if(err) {
			console.log(err);
		} else {
			res.code = "200";
			console.log("Accepted connection Succesfully");
			callback(null,res);
		}
	}, acceptUserQuery);	
}


function searchUser(message, callback) {
	
	var res={};
	console.log("Server search results");
	var searchQuery = "SELECT User_Details.State,User_Details.User_ID,User_Details.User_Name,Invitation_Table.Status from User_Details LEFT JOIN Invitation_Table On User_Details.User_ID=Invitation_Table.Invited_To_User_ID where User_Details.User_ID != "+message.User_ID+" AND User_Details.User_Name like '%"+ message.searchString+"%';";
	
	mysql.fetchData(function(err,results){
		if(err) {
			
			console.log(err);
		} else {
			if (results.length > 0){
				console.log(results);
				searchPeopleList = JSON.stringify(results);
				res.searchPeopleList = searchPeopleList;
				res.code = "200";
				console.log("User Found Succesfully");
				callback(null,res);
			} else {
				res.code = "201";
				console.log("Details Not Present");
				callback(null,res);
			}
		}
	}, searchQuery);
}


function inConnection(message, callback) {
	var res={};
	console.log("server connection module");
	var connectedPeople = "select * from User_Details where User_ID in(select Invited_To_User_ID from Invitation_Table where Invited_By_User_ID="+ message.User_ID +" and Status="+1+");";
	
	mysql.fetchData(function(err,results){
		if(err) {
			
			console.log(err);
		} else {
			if (results.length > 0){
				console.log(results);
				connectedPeopleList = JSON.stringify(results);
				console.log(connectedPeopleList);
				res.connectedPeopleList = connectedPeopleList;
				res.code = "200";
				console.log("Connections Found Succesfully");
				callback(null,res);
					
			} else {
				res.code = "200";
				console.log("Details Not Present");
				callback(null,res);
			}
		}
	}, connectedPeople);
}

function pendingConnections(message, callback) {
	console.log("server pending connections module");
	var res={};
	var pendingConnection = "select * from User_Details where User_ID in(select Invited_By_User_ID from Invitation_Table where Invited_To_User_ID="+ message.User_ID +" and Status="+0+");";
	
	mysql.fetchData(function(err,results){
		if(err) {
			
			console.log(err);
		} else {
			if (results.length > 0){
				console.log(results);
				pendingConnectionList = JSON.stringify(results);
				res.pendingConnectionList = pendingConnectionList;
				res.code = "200";
				console.log("Pending connections found Succesfully");
				callback(null,res);
			} else {
				res.code="200";
				console.log("Pending conneciton not Present");
				callback(null,res);
			}
		}
	}, pendingConnection);
}



