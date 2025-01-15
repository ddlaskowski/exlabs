const mongoose = require('mongoose');

const mDbScheme = require('./../model/dbschemes.js'); //DB Scheme Structure
const userSchema = new mongoose.Schema(mDbScheme.userSchema);
const User = mongoose.model('User', userSchema);

const mC = require('./../extensions/console_extension.js');
const consoleLog = mC.cL;

exports.userList = function ()
{
	return function (req, res) {
        consoleLog('GET /api/users', 'info');
        const {role} = req.query;
        if (role) { //search for user by role
            consoleLog('Search users by role: '+role, 'good');
            User.find({role: role}).select('-_id -__v')
            .then(result => {
                res.status(200).send(result);
            }).catch(err => {
                const message = 'ERROR while search for users by role: ' + role + '.';
                consoleLog(err, 'bad', message);
                res.status(400).send(message);
            })		
        }
        if (!role) { //Search for all users
            consoleLog('Search for all users', 'good');
            User.find().select('-_id -__v')
            .then(result => {
                res.status(200).send(result);
            })
            .catch(err => {
                const message = 'ERROR while search for all users.';
                consoleLog(err, 'bad', message);
                res.status(400).send(message);
            })
        }
    }
}
exports.findUserWithId = function ()
{
	return function (req, res) {
        consoleLog('GET /api/user', 'info');
        const {id} = req.params;
        if (!isNaN(+id)) { //Search for user by id
            consoleLog('Search for user id:'+id, 'good')
            User.findOne({id: id}).select('-_id -__v')
            .then(result => {
                res.status(200).send(result);
            })
            .catch(err => {
                const message = 'ERROR while search for user by id.';
                consoleLog(err, 'bad', message);
                res.status(400).send(message);
            })
        }
        if (isNaN(+id)) { //Incorrect id
            const message = 'ERROR incorrect id.';
            consoleLog(message, 'bad');
            res.status(400).send(message);
        }
    }
}

exports.createUser = function ()
{
    return function (req, res) {
        consoleLog('POST /api/user', 'info');
        const {email, role, firstName, lastName} = req.body;
        if (email && role) { //if new user data meets requirements create user
            const newUser = {
                email, 
                firstName: firstName ? firstName : '',
                lastName: lastName ? lastName : '',
                role,
            }
            const newOne = new User(newUser);
            newOne.save()
            .then(() => {
                res.sendStatus(201);
            })
            .catch(err => {
                const message = 'ERROR while saving new user in DB.';
                consoleLog(err, 'bad', message);
                res.status(400).send(message);
            })
        }
        else { //if new user data doesn't meet requirements to be created
            const message = 'ERROR User e-mail and role are required to create new user.';
            consoleLog(message, 'bad');
            res.status(400).send(message);
        }
    }
}

exports.editUser = function ()
{
    return function (req,res) {
        consoleLog('PATCH /api/user', 'info');
        const {role, firstName, lastName} = req.body;
        const {id} = req.params;
        if (firstName || lastName || role) { //required at least one new value to update user.
            let updatedUser = {
            }
            if(firstName){
                updatedUser['firstName'] = firstName;
            }
            if(lastName){
                updatedUser['lastName'] = lastName;
            }
            if(role){
                updatedUser['role'] = role;
            }
            User.updateOne({id: id}, {$set: {...updatedUser}})
            .then(()=>{
                res.sendStatus(200);
            })
            .catch(err => {
                consoleLog(err, 'bad', 'ERROR while updating user in DB.');
                res.status(400).send({
                    message: err,
                });
            })
        }
        else        
        {
            let message = 'ERROR while updating user in DB. Required at least one parameter.';
            consoleLog(message, 'bad');
            res.status(400).send(message);
        }
    }
}

exports.deleteUser = function () 
{
    return function (req,res) {
        consoleLog('DELETE /api/user', 'info');
        const {id} = req.params;
        if (!isNaN(+id)) { //Delete user by id
            consoleLog('Delete user id:'+id, 'good')
            User.find({ id:id }).deleteOne()
            .then( ()=>{
                res.sendStatus(200);
                })
            .catch(err => {
                consoleLog(err, 'bad', 'ERROR while removing user from DB.');
                res.status(400).send({
                    message: err,
                });
            });
        }
        else 
        {
            let message = 'ERROR while deleting user from DB. Required id as a number.';
            consoleLog(message, 'bad');
            res.status(400).send(message);
        }
    }
}