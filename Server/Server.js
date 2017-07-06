var R = require('ramda');

const hostname = '127.0.0.1';
const port = 3001;

const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const cors = require('cors')
const http = require('http')
const app = express()


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( function(req,res,next) {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Content-Type', 'text/plain');
	next();
})

const server = http.createServer(app)

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err);

	var io = require('socket.io')(server);

  require('./Routes')(app, io, database);
  
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
  })
})