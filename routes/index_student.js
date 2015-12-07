var express = require('express');
var router = express.Router();
var User =require('../models/user.js');
var crypto = require('crypto');
var app = express();
var flash = require('connect-flash');
var mysql = require('mysql');
/* GET home page. */
router.get('/', function(req, res, next) {
    
  if(req.session.islogin)
  {    
        
        res.locals.islogin=req.session.islogin;      
  }
  
  if(req.cookies.islogin)
  { 
         console.log('cookies:' + req.cookies.islogin);
       req.session.islogin = req.cookies.islogin;
  }  

  res.render('index', { title: 'GHelp' });
});

router.get('/Logoff', function(req, res) {
  req.session.destroy();
  res.redirect('/reg');
  console.log('logoff:');
});


router.get('/AdminLogin', function(req, res) {
 res.render('AdminLogin', { title: 'GHelp' });
});

router.post('/AdLogin', function(req, res) {
 
    var userName = req.body['name'];
    var userPwd = req.body['password'];
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'wangxiaomun',
        password: 'wangxiaomun'
        
    });
    console.log("userName " + userName);
    console.log("password " + userPwd);
    connection.connect();
    connection.query('USE Ghelp');
    var getUserByUserName_Sql = "SELECT * FROM admin WHERE NAME = ?";

        connection.query(getUserByUserName_Sql, [userName], function (err, result) {
            if (err) {
                console.log("getUserByUserName Error: " + err.message);
                return;
            }
             req.session.islogin=userName;
             
             res.locals.islogin=req.session.islogin;
             
             res.cookie('islogin',res.locals.islogin,{maxAge:60000});
             
             console.log(req.session.islogin);                        
             res.redirect('/Admin');
             console.log("log in!");
            return;
                                
        });
             
});



router.get('/reg', function(req, res) {
 res.render('reg', { title: 'GHelp'});
            /*success : req.flash('success').toString(),
            error : req.flash('error').toString()});*/
});

router.post('/Login', function(req, res) {
 
    var userName = req.body['name'];
    var userPwd = req.body['password'];
    
   
        
       
    User.getUserByUserName(userName, function (err, results) {                            
        
        if(results == '')
        {
             res.locals.error = 'No this user';
             res.render('index',{title:'GHelp'});
             console.log("No this user");
             return;
        }

         
         if(results[0].UserNAME != userName || results[0].PASSWORD != userPwd)
         {
             res.locals.error = 'Name or Password Error!';
             res.render('index',{title:'GHelp'});
             console.log("Name or Password Error!");
             console.log(results[0].UserNAME);
             console.log(results[0].PASSWORD);
             return;
         }
         else
         {
             req.session.islogin=userName;
             
             res.locals.islogin=req.session.islogin;
             
             res.cookie('islogin',res.locals.islogin,{maxAge:60000});
             
             console.log(req.session.islogin);
             console.log('Identity',results[0].Identity);
             if(results[0].Identity == "student"){ res.redirect('/Student');return;}
             if(results[0].Identity == "mentor"){ res.redirect('/mentor');return;}
             res.redirect('/user');
             console.log("log in!");
             return;
         }     
    });              
});


router.post('/regin', function(req, res) {
    var userName  = req.body.username;
    var Email  = req.body.email;
    var passWord  = req.body.password;
    
    var newUser = new User({
        username : userName,
        userpass : passWord,
        email : Email
    });
    
     newUser.save(function (err,result) {
          if (err) {
              res.locals.error = err;
              res.render('reg', { title: TITLE_REG }); 
              return;            
          } 
       
        req.flash('success', 'Registration  is successful! Please log in :)');
        res.render('reg', { title: 'GHelp', 
            success : req.flash('success').toString(),
            error : req.flash('error').toString()});
    });
});

router.post('/update', function(req, res) {
    var studentID  = req.body.studentID;
    var firstname  = req.body.firstname;
    var Lastname  = req.body.Lastname;
    var Email  = req.body.Email;
    var Address  = req.body.Address;
    var phone  = req.body.phone;
    var identity = req.body.options;
    var current = req.session.islogin;
    console.log('The current user is: ', current);
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'wangxiaomun',
        password: 'wangxiaomun'
        
    });
    connection.connect();
    connection.query('USE Ghelp');
    
    var UpdateUser_Sql = "UPDATE userinfo set StudentID=?,FirstNAME=?,LastNAME=?,EMAIL=?,Tel=?,Address=?,Identity=? WHERE UserNAME=?";
    connection.query(UpdateUser_Sql,[studentID,firstname,Lastname,Email,phone,Address,identity,current] ,function(err, info) {
		connection.end();
		if (!err)
		{
			
			console.log('Changed content of ' + info.affectedRows + ' rows');
			res.render('user',
			{ 
                title: 'GHelp' 
			});
		}
		else
			console.log(err);
		});
});

router.get('/housing', function(req, res) {
 res.render('housing', { title: 'GHelp' });
});

router.get('/user', function(req, res) {
 res.render('user', { title: 'GHelp' });
});

router.get('/Student', function(req, res) {
 res.render('Student', { title: 'GHelp' });
});

router.get('/mentor', function(req, res) {
 res.render('mentor', { title: 'GHelp' });
});

router.get('/Admin', function (req, res) {
    if(req.session.islogin)
  {    
        
        res.locals.islogin=req.session.islogin;      
  
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'wangxiaomun',
        password: 'wangxiaomun'
    });
    connection.connect();
    connection.query('USE Ghelp');
    connection.query('SELECT * from NewcomerStudents where MentorID<1 and RequestMentor=1', function(err, MentorRows, fields) {
    
    if (!err)
    {
		
		
		console.log('The solution1 is: ', MentorRows);
		connection.query('SELECT * from NewcomerStudents where RequestMentor=1', function(err, MentorRows2, fields) {
		connection.end();
		if (!err)
		{
			
			console.log('The solution2 is: ', MentorRows2);
			res.render('Admin',
			{ 
			mentorRows: MentorRows,
			mentorRows2: MentorRows2
			});
		}
		else
			console.log('Error while performing Query.');
		});
        
    }
    else
        console.log('Error while performing Query.');
    });
   

   }
   else
   {
        res.redirect('/AdminLogin');
   }
});
   
router.get('/mentor', function (req, res) {
    
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'wangxiaomun',
        password: 'wangxiaomun'
    });
    connection.connect();
    connection.query('USE Ghelp');
    connection.query('SELECT * from NewcomerStudents where mentorname=username', function(err, MentorRows, fields) {
    connection.end();
   
    if (!err)
    {
        console.log('The solution is: ', MentorRows);
        res.render('mentor',{ MentorRows });
    }
    else
        console.log('Error while performing Query.');
    });
   

}); 
   router.get('/timeline', function(req, res) {
 res.render('timeline', { title: 'GHelp' });
   
});


module.exports = router;