exports.accessData = function (type){
    const auth = { //credidentials to authorization client connection to the server
        user: 'admin',
        pass: 'admin',
    }

    const authType = 'Basic'; //type of authorization for test purpose

    const dbCredidentials = { //MongoDB connection details
        user: 'exlabs',
        pass: '97Y5VVWerFAAKRXE',
        cluster: 'users',
        link: 'phg78.mongodb.net',
    }

    switch (type) {
        case 'auth':
            return auth;
            break;
        case 'client': //for tests purpose make authorization header
            const clientAuth = authType + ' ' + Buffer.from(auth.user + ':' + auth.pass).toString('base64');
            return clientAuth;
          break;
        case 'db': //db connection link
          const mongodbLink = 'mongodb+srv://' + dbCredidentials.user + ':' + dbCredidentials.pass + '@' + dbCredidentials.cluster + '.' + dbCredidentials.link + '/';
          return mongodbLink;
          break;
        case 'default':
          return false;
          break;
          }
}