// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.json());
// Require path
var path = require('path');
// Require Mongoose
var mongoose = require('mongoose');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));

// This is how we connect to the mongodb database using mongoose -- "1955" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/1955');
var PersonSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Name is required!"]},
    }, {timestamps: true});
    mongoose.model('Person', PersonSchema);
    var Person = mongoose.model('Person');
    // Use native promises
    mongoose.Promise = global.Promise;

app.get('/', function(req, res){
    Person.find({}, function(err, persons){
        if(err){
            console.log("Returned error", err);
            // respond with JSON
            res.json({message: "Error", error: err});
        } else {
            // respond with JSON
            res.json({message: "Success", data: persons});
        };
    });
});
app.get('/:name', function(req, res){
    Person.findOne({name: req.params.name}, function(err, person){
        if(err){
            console.log("Returned error", err);
            // respond with JSON
            res.json({message: "Error", error: err});
        } else {
            // respond with JSON
            res.json({message: "Success", data: person});
        };
    });
});
app.get('/new/:name', function(req, res){
    var person = new Person({ name: req.params.name});
    console.log("new person", person);
    // Try to save that new eagle to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    person.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('something went wrong with new person save');
            res.redirect('/');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a Person!');
            res.redirect('/');
        };
    });
});
app.get('/remove/:name', function(req, res){
    Person.remove({name: req.params.name }, function(err) {
        if(err) {
            console.log('something went wrong with save');
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully removed a Person!');
            res.redirect('/');
        };
    });
});
// Setting our Server to Listen on Port: 8000
app.listen(8005, function() {
    console.log("listening on port 8005");
});