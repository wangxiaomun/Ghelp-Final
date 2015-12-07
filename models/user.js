var mysql = require('mysql');
var DB_NAME = 'ghelp';

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'AS)@&gh648as'
});

pool.on('connection', function(connection) {  
    connection.query('SET SESSION auto_increment_increment=1'); 
});  

function User(user){
    this.username = user.username;
    this.userpass = user.userpass;
    this.email = user.email;
};
module.exports = User;

pool.getConnection(function(err, connection) {

    var useDbSql = "USE " + DB_NAME;
    connection.query(useDbSql, function (err) {
         if (err) {
            console.log("USE Error: " + err.message);
            return;
         }
         console.log('USE succeed');
    });

    //write data to mysql
    User.prototype.save = function save(callback) {
        var user = {
            username: this.username,
            userpass: this.userpass,
            email : this.email
        };

        
        var insertUser_Sql = "INSERT INTO UserInfo (UserNAME,PASSWORD,EMAIL) VALUES (?,?,?)";
        
        /* console.log(user.username);
        console.log(user.email);
        console.log(user.userpass); */
           
        
        connection.query(insertUser_Sql, [user.username, user.userpass,user.email], function (err,result) {
            if (err) {
                console.log("insertUser_Sql Error: " + err.message);
                return;
            }
            
           /* connection.release();

            console.log("release SAVE");*/
            callback(err,result);                     
        });       
    };

    //get user amout by username
    User.getUserNumByName = function getUserNumByName(username, callback) {

        var getUserNumByName_Sql = "SELECT COUNT(1) AS num FROM userinfo WHERE username = ?";

        connection.query(getUserNumByName_Sql, [username], function (err, result) {
            if (err) {
                console.log("getUserNumByName Error: " + err.message);
                return;
            }

            connection.release();

            console.log("invoked[getUserNumByName]");
            callback(err,result);                     
        });        
    };

    //get userinfo by user name
    User.getUserByUserName = function getUserByUserName(username, callback) {

        var getUserByUserName_Sql = "SELECT * FROM userinfo WHERE UserNAME = ?";

        connection.query(getUserByUserName_Sql, [username], function (err, result) {
            if (err) {
                console.log("getUserByUserName Error: " + err.message);
                return;
            }

            

            console.log(result);
            callback(err,result);                     
        });        
    };
});