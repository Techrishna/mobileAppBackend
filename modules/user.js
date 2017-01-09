var model = require('./model');
var crypto = require('crypto');
var async = require('async');
var Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = function () {
    this.signup = function(data, cb) {
        var pass = encrypt(data.password);
        model.Users.findOne({where: {email: data.email}}).then(function(resp){
            if(resp){
                return cb({status:1, err:'User already exists'});
            } else {
                var newUser = model.Users.create({
                    name : data.name,
                    email : data.email,
                    password : pass,
                    address : data.address,
                    mobile : data.mobile,
                    city : data.city,
                    state : data.state,
                    created_at : new Date().getTime(),
                    updated_at : new Date().getTime()
                }).then(function(resp) {
                    console.log('user created successfully');
                    return cb({status:1, user : resp});
                }).catch(function(err) {
                    console.log('user creation error');
                    console.log(err);
                    return cb({status: 0, err: err});
                });
            }
        });
    }

    this.signup_for_leader = function(data, cb) {
        var pass = encrypt(data.password);

    }

    function encrypt(text) {
        var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    function decrypt(text) {
        var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }
}