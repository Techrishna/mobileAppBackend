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
    updated_at : Sequelize.DATE(6),
    verified : {type : Sequelize.BOOLEAN, defaultValue: false}
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
    party : Sequelize.TEXT('long'),
    updated_at : Sequelize.DATE(6),
    verified : {type : Sequelize.BOOLEAN, defaultValue: false}
    },
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName: 'leaders'
});

var UserPartyRelation = seq.define('userpartyrel', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    party : Sequelize.TEXT('long')
});

var Commitments = seq.define('commitments', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    photo_url : Sequelize.TEXT('long'),
    text : Sequelize.TEXT('long'),
    title : Sequelize.TEXT('long'),
    created_at : Sequelize.DATE(6)
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
    photo_url : Sequelize.TEXT('long'),
    created_at : Sequelize.DATE(6)
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'projects'
});

var Complaints = seq.define('complaints', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    title: Sequelize.TEXT('long'),
    description: Sequelize.TEXT('long'),
    creation_time: Sequelize.DATE(6)
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'complaints'
});

var Suggestions = seq.define('suggestions', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    title : Sequelize.TEXT('long'),
    description: Sequelize.TEXT('long'),
    creation_time: Sequelize.DATE(6)
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'suggestions'
});

var Gyapans = seq.define('gyapan', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    title : Sequelize.TEXT('long'),
    description: Sequelize.TEXT('long'),
    creation_time: Sequelize.DATE(6)
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'gyapans'
});

var Biography = seq.define('biography', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    description: Sequelize.TEXT('long'),
    image_url: Sequelize.TEXT('long'),
    created_at : Sequelize.DATE(6),
    updated_at :Sequelize.DATE(6)
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'biography'
});

var Speeches = seq.define('speeches', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    title: Sequelize.TEXT('long'),
    speech_url: Sequelize.TEXT('long')
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'speeches'
});

var Videos = seq.define('videos', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    title: Sequelize.TEXT('long'),
    video_url: Sequelize.TEXT('long')
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'videos'
});


var Photos = seq.define('photos', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    title: Sequelize.TEXT('long'),
    video_url: Sequelize.TEXT('long')
    },
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'photos'
});

var Votes = seq.define('votes', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    created_at : Sequelize.DATE(6)
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'votes'
});

var Rating = seq.define('rating', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    created_at : Sequelize.DATE(6),
    rating: Sequelize.INTEGER
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'rating'
})

var News = seq.define('news', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    creation_time : Sequelize.DATE(6),
    title : Sequelize.TEXT('long'),
    description : Sequelize.TEXT('long'),
    category : Sequelize.TEXT('long')
    }, 
    {
        timestamps : false,
        paranoid : false,
        freezeTableName : true,
        tableName : 'news'
});

var Advertisement = seq.define('advertisement', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    creation_time : Sequelize.DATE(6),
    imgUrl : Sequelize.TEXT('long')
    },
    {
        timestamps : false,
        paranoid: false,
        freezeTableName : true,
        tableName : 'advertisement'
});

var VerificationKeys = seq.define('verification', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    temp_key : Sequelize.TEXT('long'),
    user_id : Sequelize.INTEGER,
    leader_id : Sequelize.INTEGER
    },
    {
        timestamps : false,
        paranoid: false,
        freezeTableName : true,
        tableName : 'verification_table'
});

var ResetPasswordKeys = seq.define('password', {
    id : {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
    temp_key: Sequelize.TEXT('long'),
    user_id : Sequelize.INTEGER,
    leader_id : Sequelize.INTEGER
    },
    {
        timestamps : false,
        paranoid: false,
        freezeTableName : true,
        tableName : 'password_reset_table'
})

Commitments.belongsTo(Leader, {foreignKey: "leader_id"})

Projects.belongsTo(Leader, {foreignKey: "leader_id"})

Complaints.belongsTo(Leader, {foreignKey: "leader_id"})

Complaints.belongsTo(User, {foreignKey: "user_id"})

Gyapans.belongsTo(Leader, {foreignKey: "leader_id"})

Biography.belongsTo(Leader, {foreignKey: "leader_id"})

Speeches.belongsTo(Leader, {foreignKey: "leader_id"})

Videos.belongsTo(Leader, {foreignKey: "leader_id"})

Photos.belongsTo(Leader, {foreignKey: "leader_id"})

Votes.belongsTo(User, {foreignKey: "user_id"})

Votes.belongsTo(Leader, {foreignKey: "leader_id"})

Rating.belongsTo(User, {foreignKey: "user_id"})

Rating.belongsTo(Leader, {foreignKey: "leader_id"})

Suggestions.belongsTo(Leader, {foreignKey: "leader_id"})

UserPartyRelation.belongsTo(User, {foreignKey: "user_id"})

seq.sync();

module.exports = {
    Users : User,
    Leaders : Leader,
    Commitments : Commitments,
    Projects : Projects,
    Complaints : Complaints,
    Suggestions : Suggestions,
    Gyapans : Gyapans,
    Speeches : Speeches,
    Videos : Videos,
    Photos : Photos,
    Votes : Votes,
    Biography : Biography,
    Rating : Rating,
    News : News,
    Advertisement: Advertisement,
    ResetPasswordKeys : ResetPasswordKeys,
    VerificationKeys : VerificationKeys,
    UserPartyRelation : UserPartyRelation
}
