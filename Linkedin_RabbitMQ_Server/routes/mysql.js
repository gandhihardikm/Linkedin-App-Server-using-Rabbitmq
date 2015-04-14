var mysql = require('mysql');
exports.fetchData=fetchData;
var pool = [];
var waitlist = [];
var queueItem = {cb:"",sqlQuery:""}
var count=0;

function getConnection(){
	var connection = mysql.createConnection({
		host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'LinkedIn'
	});
	return connection;
}

var PoolOfConnection = new createConnectionsInPool(25);

function createConnectionsInPool(numberOfConnections){
	console.log(pool);
	for(var i=0;i<numberOfConnections;i++){
		pool.push(getConnection());	
	}
}

createConnectionsInPool.prototype.getConnectionFromPool = function(){
	var connection = pool.pop();
	//console.log("\nConnection popped from stack.");
	return connection;	
}

function checkWaitList(){
		if(waitlist.length > 0){
				pendingQuery = waitlist.shift();
				console.log("Request fetched from queue");
				fetchData(pendingQuery.cb,pendingQuery.sqlQuery);
		}
}

function fetchData(callback,sqlQuery){
	//console.log("\nSQL Query::"+sqlQuery);
	
	if(pool.length === 0){
			//if(waitlist.length < 20)
			//{	
					queueItem.cb = callback;
					queueItem.sqlQuery = sqlQuery;
					waitlist.push(queueItem);
					//console.log("Request added in Queue");
			//}else{
			//		callback(err,null);
			//}
	}
	else{
			var connection = PoolOfConnection.getConnectionFromPool();
		
			connection.query(sqlQuery, function(err, rows, fields) {
			if(err){
				console.log("FetchData ERROR: " + err.message);
			}
			else {	// return err or result
				//console.log("DB Results:"+JSON.stringify(rows));		
				pool.push(connection);
				//console.log("\nConnection pushed on stack." +   ++count);
				checkWaitList();
				callback(err, rows);
			}
		});		
	}
}	

/*var ejs= require('ejs');
var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'LinkedIn'
	});
	return connection;
}


function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}	

exports.fetchData=fetchData;*/