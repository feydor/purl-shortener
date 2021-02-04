// server.js
// where your node app starts
// link to repl.it

// switch between production and debug
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var http = require('http').Server(app);
var mongoose = require('mongoose');
var btoa = require('btoa');
var atob = require('atob');
var promise;
var connectionString = process.env.connectionString;
var port = process.env.PORT || 8080;

// import models
const { URL, Counter } = require('./models/url.js');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

// start body-parser
const jsonParser = express.json(); // for parsing application/json
const urlencodedParser = express.urlencoded({ extended: true }); // for parsing application/x-www-form-urlencoded

// start cookie-session
app.use(cookieSession({
    name: "session",
    keys: ["key1", "key2"],

    // cookie options
    sameSite: true, // TODO: Remove from production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// listen for requests :)
http.listen(port, function() {
    console.log('Server started. Listening on *:' + port);
});

// connect to mongodb, wipe the collections,
// and start a new counter at 1000 (arbitrary)
promise = mongoose.connect(connectionString, 
    { useNewUrlParser: true , useUnifiedTopology: true });
promise.then(function(db) {
    console.log('connected');
    URL.deleteMany({}, function() {
        console.log('URL collection removed...');
    })
    Counter.deleteMany({}, function() {
        console.log('Counter collection removed...');
        var counter = new Counter({ _id: 'url_count', count: 1000 });
        counter.save(function(err) {
            if (err) return console.error(err);
            console.log('new counter inserted.');
        });
    });
});

// POST api endpoints
app.post('/url', jsonParser, function(req, res, next) {
    console.log(req.body.url);
    var urlData = req.body.url;
    
    // look for the url in URL db
    // if found base64 encode _id and return in res.hash
    // else increment counter, save new entry, and
    // return an encoded _id as res.hash
    URL.findOne({ url: urlData }, function(err, doc) {
        if (doc) {
            console.log('entry found in db');
	    
	    // add a new savedurl to the current cookie-session
            let savedurls = req.session.isNew ? [] : req.session.savedurls;
            savedurls.push({
		url: urlData, 
		hash: btoa(doc._id)
	    });
            req.session.savedurls = savedurls;
            
	    res.send({
                url: urlData,
                hash: btoa(doc._id),
                status: 200,
                statusTxt: 'OK'
            });
        } else {
            console.log('entry NOT found in db, saving new entry');
            var url = new URL({
                url: urlData
            });
	    
            url.save(function(err) {
                if (err) return console.error(err);

                // add a new savedurl to the current cookie-session
                let savedurls = req.session.isNew ? [] : req.session.savedurls;
                savedurls.push({
                    url: urlData, 
                    hash: btoa(url._id)
                });
                req.session.savedurls = savedurls;
                console.log("saving session cookie...");
                console.log(req.session.savedurls);
                
                res.send({
                    url: urlData,
                    hash: btoa(url._id),
                    status: 200,
                    statusTxt: 'OK'
                });
            })
        }
    });
});

// GET api endpoints
// decodes hash in params and redirects to url
app.get('/url/:hash', urlencodedParser, function(req, res) {
    var baseid = req.params.hash;
    var id = atob(baseid);
    URL.findOne({ _id: id }, function(err, doc) {
        if (doc) {
            res.redirect(doc.url);
        } else {
            res.redirect('/');
        }
    });
});

// gets all current saved urls from cookie-session
app.get('/saved', jsonParser, function(req, res) {
    console.log('REACHING /saved///////////////////////////////////////////');
    let saved = [];
    console.log('req.session.isPopulated = ', req.session.isPopulated);
    console.log('req.session.isNew = ', req.session.isNew);
    console.log('req.session.savedurls = ', req.session.savedurls);
    if (req.session.savedurls) {
        // let savedurls = JSON.parse(req.session.savedurls);
        req.session.savedurls.forEach((curr, idx) => {
            saved.push(curr);
        }); 
    }

    res.send({
        saved: saved,
        status: 200,
        statusTxt: 'OK'
    });
});