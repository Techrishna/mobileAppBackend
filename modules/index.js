/**
 * Created by Balodistechnologies on 23/10/15.
 */

var user = require('./user.js');
var api = require('./apis.js');

function getmodel() {
    this.Users = new user();
    this.Apis = new api();
}

module.exports = getmodel;