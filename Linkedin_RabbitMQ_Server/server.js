	//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./routes/login');
var signup = require('./routes/signup');
var so = require('./routes/logout');
var lastlogin = require('./routes/lastlogin');

var userInformation = require('./routes/userInfo');
var eduInfo = require('./routes/educationDetails');
var expInfo = require('./routes/experienceDetails');
var s = require('./routes/skillDetails');
var updateUserInfo = require('./routes/updateUser');

var userConnection = require('./routes/connections');

var connection = amqp.createConnection({host:'127.0.0.1'});

connection.on('ready', function(){
	
	console.log("listening on login_queue,profile_queue,member_queue");

	connection.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			switch(message.type)
			{
				case 'signin':
					login.handle_request(message, function(err,res){
						if(err){
							console.log("Sign in error");
						}else{
						//return index sent
							connection.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						}
					});
					break;
					
				case 'signup':
					signup.addUser(message, function(err,res){
						if(err){
							console.log("Sign up error");
						}
						else{
							connection.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						}
					});
					break;
					
				case 'signout':
					so.signout(message, function(err,res){
						if(err){
							console.log("Signout error");
						}
						else{
							connection.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						}
					});
					break;
				
				case 'lastlogin':
					lastlogin.getLastlogin(message, function(err,res){
						if(err){
							console.log("Signout error");
						}
						else{
							connection.publish(m.replyTo, res, {
								contentType:'application/json',
								contentEncoding:'utf-8',
								correlationId:m.correlationId
							});
						}
					});
					break;
					
				default:
					console.log("Invalid choice in login queue");
			}
		});
	});
	connection.queue('profile_queue',function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			switch(message.type)
			{
				case 'Profile':
					userInformation.userInfo(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				case 'Education':
					eduInfo.educationDetails(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				case 'Experience':
					expInfo.experienceDetails(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				case 'Skills':
					s.skillDetail(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				case 'AddEdu':
					eduInfo.addEducation(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				
				case 'AddExp':
					expInfo.addExperience(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				
				case 'AddSkill':
					s.addSkill(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
				
				case 'updatefield':
					updateUserInfo.update(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
					
				case 'updateEdu':
					eduInfo.updateEducation(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
					
				case 'updateExp':
					expInfo.updateExperience(message,function(err,res){
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});
					});
					break;
					
				default:
					console.log("Invalid choice in profile queue");
			}
		});
	});	
	
	connection.queue('member_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			
			switch(message.type)
			{
				case 'showconnection':
					userConnection.inConnection(message, function(err,res){
						//return index sent
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});  
					});
					break;
				
				case 'pendingconnection':
					userConnection.pendingConnections(message, function(err,res){
						//return index sent
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});  
					});	
				
				case 'finduser':
					userConnection.searchUser(message, function(err,res){
						//return index sent
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});  
					});	
					break;
					
				case 'acceptinvitation':
					userConnection.acceptInvitation(message, function(err,res){
						//return index sent
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});  
					});	
					break;
					
				case 'sendinvitation':
					userConnection.sendInvitation(message, function(err,res){
						//return index sent
						connection.publish(m.replyTo, res, {
							contentType:'application/json',
							contentEncoding:'utf-8',
							correlationId:m.correlationId
						});  
					});	
					break;
					
				default:
					console.log("Invalid choice in member service");
			}
		});
	});

});
