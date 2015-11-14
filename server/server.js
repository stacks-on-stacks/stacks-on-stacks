var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var mysql = require('mysql');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash')

var app = express();
var port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));
app.use('/bower_components', express.static(__dirname + '/../client/public/lib/bower_components'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: 'pistachio keyboard cat',
  saveUninitialized: true,
  resave: true }));

var databasehost = process.env.HOST || 'localhost';
var knex = require('knex')({
 client: 'mysql',
 connection: {
   host: databasehost,
   user: 'root',
   password: '',
   database: 'amigo',
   charset: 'utf8'
 }
});

// ====================== MODELS =============================
var UsersTrips = require('./models/users_trips')(knex);
var Trips = require('./models/trips')(knex);
var Users = require('./models/users')(knex);
var Friends = require('./models/friends')(knex);
var Messages = require('./models/messages')(knex);
var Blogs = require('./models/blogs')(knex);
var Feedback = require('./models/amigo_feedback')(knex);
var Activities = require('./models/activities')(knex);
var Media = require('./models/media')(knex);
// ====================== END MODELS =============================

require('./config/passport')(passport, knex, Users)
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs')
app.set('views', __dirname + '/../client/views');
app.use(flash()); // use connect-flash for flash messages stored in session
require('./routes.js')(app, passport, knex) // load our routes and pass in our app and fully configured passport

app.listen(port);
console.log('Server running on port:', port)