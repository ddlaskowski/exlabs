//--------------------------- MODULES --------------------------------------------------------------------------
const bodyParser = require('body-parser'),
	express = require('express'),
	http = require('http'),
	https = require("https");
	
const mC = require('./extensions/console_extension.js');
const consoleLog = mC.cL;

const mU = require('./users/users.js');
const mA = require('./authentication/authentication.js');
const DBExtension = require('./extensions/db_extension.js');

//---------------------------END MODULES -----------------------------------------------------------------------

const app = express();
app.set('port-https', process.env.PORTHTTPS || 443);
app.set('port-http', process.env.PORTHTTP || 3003);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(mA.authentication);

//--------------------------- DB BEGIN --------------------------------------------------------------------------
DBExtension.dbConnection();
//--------------------------- DB  END --------------------------------------------------------------------------


// ------------------------------------------ ROUTES -----------------------------------------------------------
  
//USER LIST
app.get('/api/users', mU.userList());
//FIND USER BY ID
app.get('/api/user/:id', mU.findUserWithId());
//NEW USER
app.post('/api/user', mU.createUser());
//EDIT USER
app.patch('/api/user/:id', mU.editUser());
//DELETE USER
app.delete('/api/user/:id', mU.deleteUser());


// ---------------------------------------- RUN SERVER ------------------------------------------------------
/*https.createServer(options, app)
.listen(app.get('port-https'), function () {
	mC.cL('Secured SERVER ready to use on: ' + app.get('port-https'), 'good');;
});*/

const server = http.createServer(app)
.listen(app.get('port-http'), function(){
	consoleLog('Unsecured Server is ready to use on: ' + app.get('port-http'), 'good');
});
module.exports = server;