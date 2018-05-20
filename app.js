/*
	app.js - build a simple RESTful API using Express.js
*/
const Joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// middleware for the request-processing pipeline
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// schema for data validation
const schema = {
	title: Joi.string().min(1).required(),
	body: Joi.string().min(1).required()
};

// connect to the database to handle requests from the browser
let db;

MongoClient.connect('mongodb://johndixon:anavrin@ds129670.mlab.com:29670/storage', (err, client) => {
	if (err) return console.log(err);
	db = client.db('storage');
	console.log("Success");
});

// set the view engine
app.set('view engine', 'ejs');


// routes
app.get('/', (req, res) => {
	db.collection("posts").find().toArray(function(err, results) {
		if (err) return console.log(err);
		// render index.ejs
		res.render('index.ejs', {posts: results});
	});
	
});

app.get('/blog/posts/:id', (req, res) => {
	const post = posts.find(p => (p.id === parseInt(req.params.id)));
	if (!post) res.status(404).send("The post with the given ID was not found...");
	res.send(post);
});

app.post('/blog/posts', (req, res) => {

	// data validation -- if there is an error, return status 400
	const result = Joi.validate(req.body, schema);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}

	db.collection('posts').save(req.body, (err, result) => {
		if (err) return console.log(err);
		console.log('saved to database');
		res.redirect('/');
	});

});


app.put('/blog/posts/:id', (req, res) => {

	const post = posts.find(p => (p.id === parseInt(req.params.id)));
	if (!post) res.status(404).send("The post with the given ID was not found...");

	// data validation -- if there is an error, return status 400
	const result = Joi.validate(req.body, schema);
	if (result.error) {
		res.status(400).send(result.error.details[0].message);
		return;
	}

	post.title = req.body.title;
	res.send(post);

});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Listening on port ${port}...`) });

