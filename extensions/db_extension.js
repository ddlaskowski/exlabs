const mongoose = require('mongoose');
const credidentials = require('./../credidentials/credidentials.js');

const mC = require('./console_extension.js'); //Console Engine Extension
const consoleLog = mC.cL;

//--------------------------- DB BEGIN --------------------------------------------------------------------------
const mongoConnectionOptions = {
	dbName: 'exlabs_users',
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	family: 4, // Use IPv4, skip trying IPv6
};
mongoose.connect(credidentials.accessData('db'), mongoConnectionOptions);
var db = mongoose.connection;
exports.dbConnection = function (){
	db.on('error', err => { mC.cL(err, 'bad', 'ERROR CONNECT TO DB.')});
	db.once('open', function() {
		consoleLog('DB CONNECT SUCCESSFUL.', 'good');
	});
};
//--------------------------- DB  END --------------------------------------------------------------------------

