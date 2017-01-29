var model = require('./model');
var crypto = require('crypto');
var async = require('async');
var Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = function () {
    this.signup = function(data, cb) {
        var pass = encrypt(data.password);
        if(data.leader=="true"){
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
                        updated_at : new Date().getTime(),
                        party : data.party
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
                        resp.set('user_type', true, {raw : true});
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

    this.get_leaders_data = function(data, party, cb) {
        model.Leaders.findAll({where:{party: party}}).then(function(resp){
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No Record Found"});
            }
        });
    }

    this.get_leader_data_by_id = function(data, leader_id, cb) {
        model.Leaders.findOne({where: {id: leader_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }

    this.find_user_by_id = function(data, leader_id, cb) {
        model.Users.find({where:{id: leader_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }
    

    this.get_biography_data_by_id = function(data, leader_id, cb) {
        model.Biography.find({where:{leader_id: leader_id},include: [{model: model.Leaders}]}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }

    this.get_commitments_data_by_id = function(data, leader_id, cb) {
        model.Commitments.findAll({where:{leader_id: leader_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }

    this.get_projects_data_by_id = function(data, leader_id, cb) {
        model.Projects.findAll({where:{leader_id: leader_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }
    
    this.get_videos_data_by_id = function(data, leader_id, cb) {
        model.Videos.findAll({where:{leader_id: leader_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }

    this.get_photos_data_by_id = function(data, leader_id, cb) {
        model.Photos.findAll({where:{leader_id: leader_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }

    this.get_speech_data_by_id = function(data, leader_id, cb) {
        model.Speeches.findAll({where:{leader_id: leader_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }

    this.get_leader_rating = function(data, leader_id, user_id, cb) {
        model.Rating.findOne({where:{leader_id: leader_id, user_id: user_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : resp});
            } else {
                return cb({status: 0, err: "No record found"});
            }
        });
    }

    this.insert_complaint = function(data, cb) {
        if(!data.user_id || data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Complaints.create({
            created_at : new Date().getTime(),
            user_id : data.user_id,
            leader_id : data.leader_id,
            title : data.title,
            description : data.content
        }).then(function(resp){
            console.log('complaint created successfully');
            return cb({status:1, data : resp.id + ""});
        }).catch(function(err){
            console.log('complaint creation error');
            console.log(err);
            return cb({status: 0, err: err});
        })
    }

    this.insert_rating = function(data, cb) {
        if(!data.user_id || data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Rating.create({
            created_at : new Date().getTime(),
            user_id : data.user_id,
            leader_id : data.leader_id,
            rating : data.rating
        }).then(function(resp){
            console.log('complaint created successfully');
            return cb({status:1, data : resp.id + ""});
        }).catch(function(err){
            console.log('complaint creation error');
            console.log(err);
            return cb({status: 0, err: err});
        })
    }

    this.update_votes = function(data, cb) {
        if(!data.user_id || data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Votes.create({
            created_at : new Date().getTime(),
            user_id : data.user_id,
            leader_id : data.leader_id
        }).then(function(resp){
            console.log('voted successfully');
            return cb({status:1, data : resp.id + ""});
        }).catch(function(err){
            console.log('vote creation error');
            console.log(err);
            return cb({status: 0, err: err});
        })
    }

    this.reset_password = function(data, cb) {
        var pass = encrypt(data.password);
        if(data.user_type=="true"){
            model.Leaders.findOne({where:{id:data.id}}).then(function(resp){
                if(resp){
                    resp.password = pass;
                    resp.save().then(function(){
                            console.log("saved successfully");
                            return cb({status:1, data: "saved"});
                            //console.log("some error occurred" + err);
                            //return cb({status:0, err: err});
                    });
                } else {
                    return cb({"status" : 1, "err": "No User Found"});
                }
            });
        } else {
            model.Users.findOne({where:{id:data.id}}).then(function(resp){
                if(resp){
                    resp.password = pass;
                    resp.save().then(function(){
                            console.log("saved successfully");
                            return cb({status:1, data: "saved"});
                            //console.log("some error occurred" + err);
                            //return cb({status:0, err: err});
                    });
                } else {
                    return cb({status:0, data: "No User found"});
                }
            });
        }
    }

    this.update = function(data, cb) {
        if(data.leader=="true"){
            model.Leaders.findOne({where:{id:data.id}}).then(function(resp){
                if(resp){
                    model.Leaders.findOne({where:{email: data.email}}).then(function(resp_l){
                        if(!resp_l){
                            resp.name = data.name;
                            resp.email = data.email;
                            resp.address = data.address;
                            resp.mobile = data.mobile;
                            resp.city = data.city;
                            resp.state = data.state;
                            resp.updated_at = new Date().getTime();
                            resp.save().then(function(){
                                console.log("saved successfully");
                                return cb({status:1, data: "saved"});
                                //console.log("some error occurred" + err);
                                //return cb({status:0, err: err});
                            });
                        } else {
                            return cb({status:0, err : "Email already taken"})
                        }
                    });
                } else {
                    return cb({"status" : 1, "err": "No User Found"});
                }
            });
        } else {
            model.Users.findOne({where:{id:data.id}}).then(function(resp){
                if(resp){
                    model.Users.findOne({where : {email : data.email}}).then(function(resp_u){
                        if(!resp_u) {
                            resp.name = data.name;
                            resp.email = data.email;
                            resp.address = data.address;
                            resp.mobile = data.mobile;
                            resp.city = data.city;
                            resp.state = data.state;
                            resp.party = data.party;
                            resp.updated_at = new Date().getTime();
                            resp.save().then(function(){
                                console.log("saved successfully");
                                return cb({status:1, data: "saved"});
                                //console.log("some error occurred" + err);
                                //return cb({status:0, err: err});
                            });
                        } else {
                            return cb({status:0, err : "Email already taken"})
                        }
                    });
                } else {
                    return cb({status:0, err: "No User found"});
                }
            });
        }
    }

    this.add_commitment = function(data, cb) {
        if(!data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Commitments.create({
            created_at : new Date().getTime(),
            leader_id : data.leader_id,
            title : data.title,
            text : data.description,
            photo_url : data.image
        }).then(function(resp){
            console.log('complaint created successfully');
            return cb({status:1, data : resp});
        }).catch(function(err){
            console.log('complaint creation error');
            console.log(err);
            return cb({status: 0, err: err});
        })
    };

    this.edit_biography = function(data, cb) {
        if(!data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Biography.findOne({where:{leader_id: data.leader_id}, include: [{model: model.Leaders}]}).then(function(resp){
            if(resp){
                resp.description = data.description;
                resp.image_url = data.image;
                resp.updated_at = new Date().getTime();
                resp.save().then(function(){
                    model.Biography.findOne({where:{leader_id: data.leader_id}, include:[{model: model.Leaders}]}).then(function(resp){
                        if(resp){
                            console.log("Biography saved");
                            return cb({status: 1, data: resp});
                        }
                    });
                });
            } else {
                model.Biography.create({
                    created_at : new Date().getTime(),
                    updated_at : new Date().getTime(),
                    description : data.description,
                    image_url : data.image,
                    leader_id : data.leader_id
                }).then(function(resp){
                    console.log("successfully created biography");
                    model.Biography.find({where: {leader_id: data.leader_id}, include: [{model: model.Leaders}]}).then(function(resp_f){
                        if(resp_f){
                            return cb({statusL: 1, data: resp_f});
                        } else {
                            return cb({status: 0, err: "Date not found"});
                        }
                    });
                }).catch(function(err){
                    console.log('biography creation error');
                    console.log(err);
                    return cb({status: 0, err: err});
                })
            }
        })
    };

    this.edit_commitment = function(data, cb) {
        if(!data.id)
            return cb({status:0, err: 'some error occurred'});
        model.Commitments.findOne({where:{id: data.id}}).then(function(resp){
            if(resp) {
                resp.title = data.title;
                resp.text = data.description;
                resp.photo_url = data.image;
                resp.save().then(function(){
                    console.log("saved successfully");
                    return cb({status:1, data: "saved"});
                });
            }
        })
    }

    this.delete_commitment = function(data, cb) {
        if(!data.id)
            return cb({status:0, err: 'some error occurred'});
        model.Commitments.destroy({where:{id: data.id}}).then(function(resp){
            if(resp){
                return cb({status: 1, data: "deleted"});
            }
        })
    }

    this.add_project = function(data, cb) {
        if(!data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Projects.create({
            created_at : new Date().getTime(),
            leader_id : data.leader_id,
            title : data.title,
            description : data.description,
            photo_url : data.image
        }).then(function(resp){
            console.log('project created successfully');
            return cb({status:1, data : resp});
        }).catch(function(err){
            console.log('project creation error');
            console.log(err);
            return cb({status: 0, err: err});
        })
    };

    this.edit_project = function(data, cb) {
        if(!data.id)
            return cb({status:0, err: 'some error occurred'});
        model.Projects.findOne({where:{id: data.id}}).then(function(resp){
            if(resp) {
                resp.title = data.title;
                resp.description = data.description;
                resp.photo_url = data.image;
                resp.save().then(function(){
                    console.log("saved successfully");
                    return cb({status:1, data: "saved"});
                });
            }
        })
    }

    this.delete_project = function(data, cb) {
        if(!data.id)
            return cb({status:0, err: 'some error occurred'});
        model.Projects.destroy({where:{id: data.id}}).then(function(resp){
            if(resp){
                return cb({status: 1, data: "deleted"});
            }
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
