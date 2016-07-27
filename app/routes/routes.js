/**
 * Created by krunal on 11/3/15.
 */

//require everything that you need.
var router = require('express').Router();
var _          = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var MongoDB_URL= "mongodb://"+process.env.MONGO_UNAME+":"+process.env.MONGO_PASS+"@"+process.env.MONGO_URL+":"+process.env.MONGO_PORT+"/"+process.env.MONGO_DB;

var Twit = require('twit')
var T = new Twit({
              consumer_key: process.env.TWITTER_CONSUMER_KEY,
              consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
              access_token: process.env.TWITTER_ACCESS_TOKEN,
              access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
              timeout_ms:60*1000,  // optional HTTP request timeout to apply to all requests.
            });
var Tt = process.env.TWITTER_TOKEN;

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        next();
    });

    // test route to make sure everything is working (accessed at GET http://host:port/api)
    router.get('/', function(req, res) {
        res.json({ message: 'Welcome to Krunal API' });
    });

    // ROUTES FOR OUR API
    // =============================================================================


    router.route('/graph/:id')
        .get(function(req, res) {
            var graph_id = req.params.id;
            MongoClient.connect(MongoDB_URL, function(err, database) {

               if (err) return console.log(err)//add proper status codes.
               db = database;
               db.collection('graph').find().toArray(function(err, results) {
                 // send HTML file populated with quotes here
                 var graph_json_obj = _.find(results,function(item){return item.uid==graph_id;});
                 if(graph_json_obj!=null)
                    res.json(graph_json_obj);
                 else
                    res.json("Empty");
               });

            });

        });

    router.route('/graph')
        .post(function(req, res) {
            if(Tt==req.body.token){
                MongoClient.connect(MongoDB_URL, function(err, database) {

                   if (err) return console.log(err)//add proper status codes.
                   db = database;
                   if(req.body.graph_object!=null){
                        db.collection('graph').save(req.body.graph_object, function(err, result){
                           if (err) return console.log(err)

                           console.log('saved to database')
                           res.send(201);
                         });
                   }

                });
            }else
                res.send(401);


        });


    // on routes that end in /Twitter
        // ----------------------------------------------------



        router.route('/TwitterPost')
            .post(function(req, res) {
            if(Tt==req.body.token){
            //add check for null or empty.
                T.post('statuses/update', { status: req.body.text }, function(err, data, response) {
                    if(err){
                        console.error({message:err});
                        res.send(405);// change in future
                    }
                });
                res.send(200);
            }
            else
                res.send(401);
            });

module.exports = router;
