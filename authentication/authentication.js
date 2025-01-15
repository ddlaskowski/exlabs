const mC = require('./../extensions/console_extension.js'); //Console Engine Extension
const consoleLog = mC.cL;

const credidentials = require('./../credidentials/credidentials.js');

exports.authentication = function(req, res, next) {
    const clientCredidentials = req.headers.authorization;
     // If no credidentials
    if (!clientCredidentials) {
        let err = new Error();
		consoleLog('NO AUTHENTICATION', 'bad');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
    //decode authorization header to user credidential
    const auth = new Buffer.from(clientCredidentials.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    const accessData = credidentials.accessData('auth');

    if (user === accessData.user && pass === accessData.pass) {
        // If Authorized user
        next();
    } 
     // If Unauthorized user
    else {
        let err = new Error();
		consoleLog('NO AUTHENTICATION', 'bad');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
}