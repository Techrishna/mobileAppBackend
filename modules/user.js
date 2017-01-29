var model = require('./model');
var crypto = require('crypto');
var async = require('async');
var Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = function () {
    this.signup = function(data, cb) {
        var pass = encrypt(data.password);
        if(data.leader){
            model.Leaders.findOne({where: {email: data.email}}).then(function(resp){
                if(resp){
                    return cb({status:1, err:'User already exists'});
                } else {
                    var newUser = model.Leaders.create({
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
                        console.log('leader created successfully');
                        console.log(resp);
                        resp.set('user_type', false, {raw : true});
                        return cb({status:1, data : resp});
                    }).catch(function(err) {
                        console.log('leader creation error');
                        console.log(err);
                        return cb({status: 0, err: err});
                    });
                }
            });
        } else {
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
                        return cb({status:1, data : resp});
                    }).catch(function(err) {
                        console.log('user creation error');
                        console.log(err);
                        return cb({status: 0, err: err});
                    });
                }
            });
        }
    }

    this.signup_for_leader = function(data, cb) {
        var pass = encrypt(data.password);

    }

    this.login = function(data, cb) {
        var pass = encrypt(data.password);
        model.Users.findOne({where: {email: data.email}}).then(function(resp){
            if(resp) {
                if(resp.password != pass)
                    return cb({status: 1, err: "Password doesn't match"});
                resp.set('user_type', true, {'raw': true});
                return cb({status: 1, data: resp});
            } else {
                model.Leaders.findOne({where : {email : data.email}}).then(function(resp){
                    if(resp) {
                        if(resp.password != pass)
                            return cb({status: 1, err : "Password doesn't match"});
                        resp.set('user_type', false, {'raw': true});
                        return cb({status: 1, data: resp});
                    } else {
                        return cb({status: 0, err: "User not exist"});
                    }
                });
            }
        });
    }

    this.get_leaders_data = function(data, cb) {
        model.Leaders.findAll().then(function(resp){
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No Record Found"});
            }
        });
    }

    this.get_leader_data_by_id = function(data, leader_id, cb) {
        console.log(leader_id);
        model.Leaders.findOne({where: {id: leader_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }

    this.get_biography_data_by_id = function(data, leader_id, cb) {
        console.log(model.Biography);
        model.Biography.find({leader_id: leader_id}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }

    this.update_votes = function(data, cb) {
        if(!data.user_id || data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Votes.create({
            created_at : new Date().getTime(),
            user_id : data.user,
            leader_id : data.leader
        }).then(function(resp){
            console.log('voted successfully');
            return cb({status:1, data : resp.id + ""});
        }).catch(function(err){
            console.log('vote creation error');
            console.log(err);
            return cb({status: 0, err: err});
        })
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
