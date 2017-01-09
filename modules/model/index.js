/* here make the db schema */

var Sequelize = require('sequelize');
var constant = require('./../../includes/constant');
var seq = constant.seqConn;

var User = seq.define('users', {
    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    name: Sequelize.TEXT('long'),
    address : Sequelize.TEXT('long'),
    password  : Sequelize.TEXT('long'),
    email : Sequelize.TEXT('long'),
    mobile : Sequelize.STRING,
    city : Sequelize.TEXT('long'),
    state : Sequelize.TEXT('long'),
    created_at : Sequelize.DATE(6),
    updated_at : Sequelize.DATE(6)
    },
    {
        timestamps : false,
        paranoid : false,
        freezeTableName: true,
        tableName : 'users'
});

var Leader = seq.define('leaders', {
	id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
	name : Sequelize.TEXT('long'),
    email : Sequelize.TEXT('long'),
	address : Sequelize.TEXT('long'),
    password  : Sequelize.TEXT('long'),
	mobile : Sequelize.TEXT('long'),
    city : Sequelize.TEXT('long'),
    state : Sequelize.TEXT('long'),
    dob : Sequelize.DATE(6),
    created_at : Sequelize.DATE(6),
    updated_at : Sequelize.DATE(6)
    },
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName: 'leaders'

});

var Commitments = seq.define('biography', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    photo_url : Sequelize.TEXT('long'),
    text : Sequelize.TEXT('long')
    },
    {
        timestamps : false,
        paranoid : false,
        freezeTableName: true,
        tableName: 'commitments'

});

var Projects = seq.define('projects', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    title : Sequelize.TEXT('long'),
    description : Sequelize.TEXT('long'),
    photo_url : Sequelize.TEXT('long')

    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'projects'
});

Commitments.belongsTo(Leader, {foreignKey: "leader_id"})

Projects.belongsTo(Leader, {foreignKey: "leader_id"})

seq.sync();

module.exports = {
    Users : User,
    Leaders : Leader,
    Commitments : Commitments,
    Projects : Projects
}