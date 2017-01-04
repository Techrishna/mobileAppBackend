/**
 * Created by Balodistechnologies on 24/10/15.
 */
var config = require('../env.json')[process.env.NODE_ENV || 'development'];

module.exports = {
    gcmurl : function() {
        return 'http://android.googleapis.com/gcm/send';
    },
    log_file_path : '/var/log/techrishna/logs1.log',
    daily_log_file_path : '/var/log/techrishna/logs.log'
}
