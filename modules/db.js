/**
 * Created by Balodistechnologies on 23/10/15.
 */
var environment = require('../includes/constant');
var Sequelize = require('sequelize');

var pool;
var options = {
        host     : 'localhost',
        user     : 'root',
        password : 'admin',
        database : 'techrishna'
      };

var seq = new Sequelize(options.database, options.user, options.password, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

seq
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

module.exports = {
    getPool: function () {
        return seq;
    },
    options : options,
    seqConn: seq
};


