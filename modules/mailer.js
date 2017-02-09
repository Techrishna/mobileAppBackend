var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mailOptions = {};

exports.sendMail = function(sender, receiver, subject, body, callback){
    var user = "admin@techrishna.co.in";
    var pass = "techrishna@123";
    var options = {
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    };
    var transporter = mailer.createTransport(smtpTransport(options));
    mailOptions = {
        from : user,
        to : receiver,
        subject : subject,
        text : body
    };
    transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                if(typeof callback == 'function')
                    callback({status : 0, err : error});
            } else{
                console.log(info);
                if(typeof callback == 'function')
                    callback({status : 1, resp : info.response});
            }
    });
}