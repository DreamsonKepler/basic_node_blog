const Sequelize = require('sequelize');
db = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost/basic_node_blog`);

// define User Model
db.User = db.define('user', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});

// define Post Model
db.Message = db.define('post', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    message: Sequelize.STRING
})

// define Comment Model
db.Comment = db.define('comment', {
    comment: Sequelize.STRING
})

db.User.hasMany(db.Message);
db.User.hasMany(db.Comment);
db.Message.belongsTo(db.User);
db.Comment.belongsTo(db.User);
db.Comment.belongsTo(db.Message);
db.Message.hasMany(db.Comment);




db.sync(
    {force: true}
)
    .then(function(db) {
        const user1 = {
            name: 'klaas',
            email: 'klaas@gmail.com',
            password: 'klaas123'
        }
        db.User.create(user1)
    })
    // .then(function(db) {
    //     const message1 = {
    //         name: 'joop',
    //         email: 'joop@gmail.com',
    //         message: 'ik ben joop'
    //     }
    //     db.Post.create(message1)
    .catch( (error) => console.log(error));

module.exports = db