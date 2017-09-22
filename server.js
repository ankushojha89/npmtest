//config files
var config = require('./config/serverconfig');


process.env.PROJECT_ROOT=__dirname;

const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const exphbs=require('express-handlebars');
const expressValidator=require('express-validator');



// routes file
var web=require('./routes/index');
var admin=require('./routes/admin');


const app = express();

app.set('port', process.env.PORT||config.server.port);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

 // Express-validator
 app.use(expressValidator({
   errorFormatter: function(param, msg, value) {
       var   namespace = param.split('.'),
             root      = namespace.shift(),
             formParam = root;

     while(namespace.length) {
       formParam += '[' + namespace.shift() + ']';
     }
     return {
       param : formParam,
       msg   : msg,
       value : value
     };
   }
 }));


// public folder
app.use(express.static(path.join(__dirname, 'public')));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');


app.use('/', web);
app.use('/admin', admin);

app.listen(app.get('port'), function () {
  console.log(`App listening on port ${app.get('port')}!`);
});

