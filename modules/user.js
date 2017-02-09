var model = require('./model');
var crypto = require('crypto');
var async = require('async');
var Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);
var db = require('./db');
sequelize = db.seqConn;
var mailer = require('./mailer.js');
var randomstring = require('randomstring');

module.exports = function () {
    this.signup = function(data, cb) {
        var pass = encrypt(data.password);
        if(data.leader=="true"){
            model.Leaders.findOne({where: {email: data.email}}).then(function(resp){
                if(resp){
                    return cb({status:1, err:'User already exists'});
                } else {
                    model.Users.findOne({where: {email: data.email}}).then(function(resp_u){
                        if(resp_u){
                            return cb({status: 1, err: "User already exists"});
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
                                resp.set('user_type', false, {raw : true});
                                sendVerificationMail(resp, false, function(err, resp_mail){
                                    if(err){
                                        return cb({status: 1, err: err});
                                    } else {
                                        return cb({status: 1, data: resp})
                                    }
                                });
                            }).catch(function(err) {
                                console.log('leader creation error');
                                console.log(err);
                                return cb({status: 0, err: err});
                            });
                        }
                    })
                }
            });
        } else {
            model.Users.findOne({where: {email: data.email}}).then(function(resp){
                if(resp){
                    return cb({status:1, err:'User already exists'});
                } else {
                    model.Leaders.findOne({where: {email: data.email}}).then(function(resp_u){
                        if(resp_u){
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
                                sendVerificationMail(resp, true, function(err, resp_mail){
                                    if(err){
                                        return cb({status: 1, err: err});
                                    } else {
                                        return cb({status: 1, data: resp})
                                    }
                                });
                            }).catch(function(err) {
                                console.log('user creation error');
                                console.log(err);
                                return cb({status: 0, err: err});
                            });
                        }
                    });
                }
            });
        }
    }

    this.verifyUser = function(data, cb){
        if(data.email){
            getUserAccount(data, function(err, resp){
                if(!err){
                    model.VerificationKeys.findOne({where: {temp_key: data.temp_key, $or: [{leader_id: resp.id}, {user_id: resp.id}]}}).then(function(resp){
                        if(resp){
                            console.log(resp.leader_id);
                            if(resp && resp.leader_id){
                                console.log('here');
                                model.Leaders.findOne({where: {id: resp.leader_id}}).then(function(resp_l){
                                    if(resp_l){
                                        resp_l.verified = true;
                                        resp_l.save().then(function(){
                                            return cb({status: 1, data: "verified"});
                                        })
                                    } else {
                                        return cb({status: 1, err: "User not exist"});
                                    }
                                });
                            } else if(resp && resp.user_id){
                                model.Users.findOne({where: {id: resp.user_id}}).then(function(resp_u){
                                    if(resp_u){
                                        resp_u.verified = true;
                                        resp_u.save().then(function(){
                                            return cb({status: 1, data: "verified"});
                                        })
                                    } else {
                                        return cb({status: 1, err: "User not exist"});
                                    }
                                });
                            } else {
                                return cb({status: 0, err: "Key not found"});
                            }
                        }
                    });
                } else {
                    return cb({status: 0, err: "User not found"});
                }  
            });
        } else {
            model.VerificationKeys.findOne({where: {temp_key: data.temp_key, $or: [{leader_id: data.id}, {user_id: data.id}]}}).then(function(resp){
                if(resp){
                    if(resp && resp.leader_id){
                        model.Leaders.findOne({where: {id: resp.leader_id}}).then(function(resp_l){
                            if(resp_l){
                                resp_l.verified = true;
                                resp_l.save().then(function(){
                                    return cb({status: 1, data: "verified"});
                                })
                            }
                        });
                    } else if(resp && resp.user_id){
                        model.Leaders.findOne({where: {id: resp.leader_id}}).then(function(resp_u){
                            if(resp_u){
                                resp_u.verified = true;
                                resp_u.save().then(function(){
                                    return cb({status: 1, data: "verified"});
                                })
                            }
                        });
                    } else {
                        return cb({status: 0, err: "Key not found"});
                    }
                }
            });
        }
    }

    var getUserAccount = function(data, callback) {
        model.Users.findOne({where: {email : data.email}}).then(function(resp){
            if(resp){
                callback(null, resp);
            } else {
                model.Leaders.findOne({where: {email: data.email}}).then(function(resp_l){
                    if(resp_l){
                        callback(null, resp_l);
                    } else{
                        callback("User not found");
                    }
                })
            }
        })
    }

    this.login = function(data, cb) {
        var pass = encrypt(data.password);
        model.Users.findOne({where: {email: data.email}}).then(function(resp){
            if(resp) {
                if(resp.password != pass)
                    return cb({status: 1, err: "Password doesn't match"});
                resp.set('user_type', true, {'raw': true});
                if(resp.verified)
                    return cb({status: 1, data: resp});
                else
                    return cb({status: 1, err: "Verification Failed"});
            } else {
                model.Leaders.findOne({where : {email : data.email}}).then(function(resp){
                    if(resp) {
                        if(resp.password != pass)
                            return cb({status: 1, err : "Password doesn't match"});
                        resp.set('user_type', false, {'raw': true});
                        if(resp.verified)
                            return cb({status: 1, data: resp});
                        else
                            return cb({status: 1, err: "Verification Failed"});
                    } else {
                        return cb({status: 0, err: "User not exist"});
                    }
                });
            }
        });
    }

    this.get_leaders_data = function(data, party, cb) {
        if(party==null){
            model.Leaders.findAll().then(function(resp){
                if(resp) {
                    return cb({status: 1, data : resp});
                } else {
                    return cb({status: 0, err: "No Record Found"});
                }
            });
        } else {
            model.Leaders.findAll({where:{party: party}})   .then(function(resp){
                if(resp) {
                    return cb({status: 1, data : resp});
                } else {
                    return cb({status: 0, err: "No Record Found"});
                }
            });
        }
    }

    this.get_home_page = function(data, id, cb) {
        async.parallel([
            function(callback) {
                model.Complaints.findAll({where:{leader_id: id}}).then(function(resp){
                    if(resp) {
                        callback(null, resp);
                    } else {
                        callback("No Record Found");
                    }
                });
            }, function(callback) {
                model.Gyapans.findAll({where: {leader_id: id}}).then(function(resp){
                    if(resp) {
                        callback(null, resp);
                    } else {
                        callback("No Record Found");
                    }
                });
            }, function(callback) {
                model.Suggestions.findAll({where:{leader_id: id}}).then(function(resp){
                    if(resp) {
                        callback(null, resp);
                    } else {
                        callback("No Record Found");
                    }
                });
            }
        ], function(err, response){
            if(err) {
                console.log("some err occurred");
                return cb({status:0, err: err});
            } else {
                return cb({status:1, data:{comp_list:response[0], gyapan_list:response[1], suggestion_list:response[2]}});
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

    this.get_leader_voting = function(data, leader_id, user_id, cb) {
        model.Votes.findOne({where:{leader_id: leader_id, user_id: user_id}}).then(function(resp) {
            if(resp) {
                return cb({status: 1, data : "true"});
            } else {
                return cb({status: 0, data: "false"});
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
        if(!data.user_id || !data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Rating.findOne({where:{user_id: data.user_id, leader_id: data.leader_id}}).then(function(resp){
            if(!resp){
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
            } else {
                resp.rating = data.rating;
                resp.save().then(function(){
                    return cb({status: 1, data: resp.id+""});
                });
            }
        });
    }

    this.update_votes = function(data, cb) {
        if(!data.user_id || !data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Votes.findOne({where:{user_id: data.user_id, leader_id: data.leader_id}}).then(function(resp){
            if(!resp) {
                model.Votes.create({
                    created_at : new Date().getTime(),
                    user_id : data.user_id,
                    leader_id : data.leader_id
                }).then(function(resp){
                    console.log('voted successfully');
                    return cb({status:1, data : "voted"});
                }).catch(function(err){
                    console.log('vote creation error');
                    console.log(err);
                    return cb({status: 0, err: err});
                })
            } else {
                resp.destroy().then(function(){
                    return cb({status:1, data: "removed"});
                });
            }
        });
    }

    this.reset_password = function(data, cb) {
        var pass = encrypt(data.password);
        model.ResetPasswordKeys.findOne({where: {temp_key: data.temp_key}}).then(function(resp_key){
            if(resp_key){
                if(resp_key.leader_id){
                    model.Leaders.findOne({where:{id:resp_key.leader_id}}).then(function(resp){
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
                } else if(resp_key.user_id){
                    model.Users.findOne({where:{id:resp_key.user_id}}).then(function(resp){
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
                } else {
                    return cb({"status": 1, "err" : "Key Doesn't Match"});
                }
            } else {
                return cb({"status": 1, "err" : "Key Doesn't Match"});
            }
        });
    }

    this.update = function(data, cb) {
        if(data.leader=="true"){
            model.Leaders.findOne({where:{id:data.id}}).then(function(resp){
                if(resp){
                    model.Leaders.findOne({where:{email: data.email, id:{$ne: resp.id}}}).then(function(resp_l){
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
                                model.Leaders.findOne({where: {id: data.id}}).then(function(resp_user){
                                    resp_user.set('user_type', false, {raw : true});
                                    return cb({status:1, data: resp_user});
                                });
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
                    model.Users.findOne({where : {email : data.email, id:{$ne: resp.id}}}).then(function(resp_u){
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
                                model.Leaders.findOne({where: {id: data.id}}).then(function(resp_user){
                                    resp_user.set('user_type', true, {raw : true});
                                    return cb({status:1, data: resp_user});
                                });
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

    this.add_photo = function(data, cb) {
        if(!data.leader_id)
            return cb({status:0, err: 'some error occurred'}); 
        model.Photos.create({
            title : data.title,
            leader_id : data.leader_id,
            video_url : data.image
        }).then(function(resp){
            console.log('photo created successfully');
            return cb({status:1, data : resp});
        }).catch(function(err){
            console.log('photo creation error');
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

    this.delete_photo = function(data, cb) {
        if(!data.id)
            return cb({status:0, err: 'some error occurred'});
        model.Photos.destroy({where:{id: data.id}}).then(function(resp){
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

    this.edit_photo = function(data, cb) {
        if(!data.id)
            return cb({status:0, err: 'some error occurred'});
        model.Photos.findOne({where:{id: data.id}}).then(function(resp){
            if(resp) {
                resp.title = data.title;
                resp.video_url = data.image;
                resp.save().then(function(){
                    console.log("saved successfully");
                    return cb({status:1, data: "saved"});
                });
            }
        })
    }

    this.get_all_news = function(data, category, cb) {
        if(category==null){
            model.News.findAll().then(function(resp){
                return cb({status: 1, data: resp});
            });
        } else {
            model.News.findAll({where:{category: category}}).then(function(resp){
                return cb({status: 1, data: resp});
            });
        }
    }

    this.get_all_rating = function(data, leader, cb) {
        if(!leader)
            return cb({status:0, err: "leader id missing"});
        else {
            sequelize.query('select avg(rating) as average from rating where leader_id=' + leader).spread(function(resp, metadata){
                console.log(data);
                var data = Sequelize.getValues(resp);
                var rating = data[0]["average"];
                if(rating==null)
                    rating = 0
                return cb({status:1, data: rating});
            });
        }
    }

    this.get_all_advertisement = function(data, cb) {
        model.Advertisement.findAll().then(function(resp){
            return cb({status: 1, data: resp});
        });
    }

    this.get_all_voting = function(data, leader, cb) {
        if(!leader)
            return cb({status:0, err: "leader id missing"});
        else {
            sequelize.query('select count(*) as count from votes where leader_id=' + leader).spread(function(resp, metadata){
                console.log(data);
                var data = Sequelize.getValues(resp);
                var votes = data[0]["count"];
                return cb({status:1, data: votes});
            });
        }
    }

    this.get_all_news_category = function(data, cb) {
        sequelize.query('select distinct category from news').spread(function(resp, metadata){
            console.log(data);
            var order = Sequelize.getValues(resp);
            var data = [];
            for(var i=0; i <order.length; i++){
                data.push(order[i]["category"]);
            }
            return cb({status: 1, data: data});
        });
    }

    this.delete_project = function(data, cb) {
        if(!data.id)
            return cb({status:0, err: 'some error occurred'});
        model.Projects.destroy({where:{id: data.id}}).then(function(resp){
            if(resp){
                return cb({status: 1, data: "deleted"});
            }
        });
    }

    this.sendMailForVerification = function(data, cb) {
        model.Users.findOne({where : {email: data.email}}).then(function(resp){
            if(resp){
                new_data = {};
                new_data['user_type'] = true;
                new_data['id'] = resp.id;
                new_data['email'] = resp.email;
                console.log(new_data);
                sendVerificationMail(new_data, true, function(err, response){
                    if(err){
                        console.log('some err occurred sending verification');
                        console.log(err);
                        cb({status: 0, err: err});
                    } else {
                        console.log('verification done');
                        cb({status: 1, data: 'mail sent'});
                    }
                });
            } else {
                model.Leaders.findOne({where : {email: data.email}}).then(function(resp_l){
                    if(resp_l){
                        new_data = {};
                        new_data['user_type'] = false;
                        new_data['id'] = resp_l.id;
                        new_data['email'] = resp_l.email;
                        console.log(new_data);
                        sendVerificationMail(new_data, false, function(err, response){
                            if(err){
                                console.log('some err occurred sending verification');
                                console.log(err);
                                cb({status:0, err: err});
                            } else {
                                console.log('verification done');
                                cb({status: 1, data: 'mail sent'});
                            }
                        });
                    } else {
                        console.log('No User found');
                        cb({status: 0, err: "No user found"});
                    }
                });
            }
        });
    }

    var sendVerificationMail = function(data, user_type, cb) {
        if(user_type){
            model.VerificationKeys.destroy({where:{user_id: data.id}}).then(function(){
                model.VerificationKeys.create({
                    temp_key : randomstring.generate(8),
                    user_id : data.id
                }).then(function(resp) {
                    console.log('verification key created successfully');
                    console.log(resp);
                    mailer.sendMail('admin@techrishna.co.in', data.email, "Verification Mail from Techrishna", "Hi /n/n Kindly verify your mail with the following key : \n" + resp.temp_key);
                    return cb(null, resp);
                }).catch(function(err) {
                    console.log('verification key creation error');
                    console.log(err);
                    return cb(err);
                });
            });
        } else {
            model.VerificationKeys.destroy({where:{leader_id: data.id}}).then(function(){
                model.VerificationKeys.create({
                    temp_key : randomstring.generate(8),
                    leader_id : data.id
                }).then(function(resp) {
                    console.log('verification key created successfully');
                    console.log(resp);
                    mailer.sendMail('admin@techrishna.co.in', data.email, "Verification Mail from Techrishna", "Hi /n/n Kindly verify your mail with the following key : \n" + resp.temp_key);
                    return cb(null, resp);
                }).catch(function(err) {
                    console.log('verification key creation error');
                    console.log(err);
                    return cb(err);
                });  
            });
        }
    }

    this.sendtemp = function(data, cb) {
        mailer.sendMail('admin@techrishna.co.in', "gaurav.jp2@gmail.com", "temp mail", "Hi Test");
        return cb({status:1});
    }

    this.sendResetPasswordMail = function(data, cb) {
        console.log(data);
        model.Users.findOne({where: {email : data.email}}).then(function(resp){
            if(resp){
                model.ResetPasswordKeys.destroy({where: {user_id: resp.id}}).then(function(){
                    model.ResetPasswordKeys.create({
                        temp_key : randomstring.generate(8),
                        user_id : resp.id
                    }).then(function(response){
                        console.log('verification key created successfully');
                        console.log(resp);
                        mailer.sendMail('admin@techrishna.co.in', data.email, "Reset Password Techrishna", "Hi /n/n Kindly reset your password with the following key : \n" + response.temp_key);
                        return cb({status: 1, data: 'Mail sent'});
                    }).catch(function(err){
                        console.log('reset password verification key error');
                        console.log(err);
                        return cb({status: 0, err: "Some error occurred"});
                    });
                });
            } else {
                model.Leaders.findOne({where: {email : data.email}}).then(function(resp_l){
                    if(resp_l) {
                        model.ResetPasswordKeys.destroy({where: {leader_id: resp_l.id}}).then(function(){
                            model.ResetPasswordKeys.create({
                                temp_key : randomstring.generate(8),
                                leader_id : resp_l.id
                            }).then(function(response){
                                console.log('verification key created successfully');
                                console.log(response);
                                mailer.sendMail('admin@techrishna.co.in', data.email, "Reset Password Techrishna", "Hi /n/n Kindly reset your password with the following key : \n" + response.temp_key);
                                return cb({status: 1, data: 'Mail sent'});
                            }).catch(function(err){
                                console.log('reset password verification key error');
                                console.log(err);
                                return cb({status: 0, err: "Some error occurred"});
                            });
                        });
                    } else {
                        return cb({status: 0, err: "No User found"});
                    }
                })
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
