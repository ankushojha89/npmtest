var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
     res.render('index', { title: 'Welcome to Employee Database' });
});


module.exports = router;  


// router.get('/details/:id', function(req, res, next) {    
//     con.query('SELECT * FROM emp WHERE eid=?',req.params.id,function(err,rows,fields){
//         if(err) throw err;
//         res.render('details', { "employee":rows[0],title: 'Employee Details' });
//     });  
// });


