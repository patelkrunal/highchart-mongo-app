// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var _          = require('underscore');
var MongoClient = require('mongodb').MongoClient;
//Access-Control-Allow-Origin
var cors=require('cors');
app.use(cors());

//host and port from cli
var hostIndex = _.indexOf(process.argv,"--host");
if(hostIndex > -1){
    if(process.argv[hostIndex+1])
        process.env.HOST = process.argv[hostIndex+1];
}
var portIndex = _.indexOf(process.argv,"--port");
if(portIndex > -1){
    if(process.argv[portIndex+1])
        process.env.PORT = process.argv[portIndex+1];
}

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 8080);// set default port
app.set('host', process.env.HOST || 'localhost');//set default host

//add all the routes.
var router = require('./app/routes/routes');

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

var MongoDB_URL= "mongodb://"+process.env.MONGO_UNAME+":"+process.env.MONGO_PASS+"@"+process.env.MONGO_URL+":"+process.env.MONGO_PORT+"/"+process.env.MONGO_DB;
MongoClient.connect(MongoDB_URL, function(err, database) {

    if (err) return console.log(err)
    database.close();
  app.listen(app.get('port'), function(){
      console.log("Express server listening at %s:%s ",app.get('host'),app.get('port'));
  });
});
