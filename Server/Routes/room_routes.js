var R = require('ramda')
var _ = require('underscore')

module.exports = function(app, io, db) {

	var ObjectID = require('mongodb').ObjectID;
	var GameManager = require('./GameManager');

	var currentGameManagers = []

	turnAllGameManagersOn()

	app.post('/users', (req, res) => {
		const username = req.body.username
		const password = req.body.password
		db.collection('users').findOne({ username: username }, (err, result) => {
			if(!_.isObject(result)) {
				db.collection('users').insert({ username: username, password: password }, (err, result) => {
					res.status(200).send(result.ops[0])
				})
			} else {
				res.status(400).send({ message: 'Username already taken' })
			}
		})
	})

	app.post('/login', (req, res) => {
		const username = req.body.username
		const password = req.body.password
		db.collection('users').findOne({ username: username, password: password }, (err, result) => {
			if(_.isObject(result)) {
				res.status(200).send(result)
			} else {
				res.status(400).send({ message: 'Invalid credentials' })
			}
		})
	})

	app.post('/rooms', (req, res) => {
		const roomname = req.body.roomname.replaceAll(' ', '%20');
		const dungeon = req.body.dungeon
		if (!R.contains(roomname, currentGameManagers)) {
			var gameManager = createGameManager(roomname, dungeon);
			const newRoom = { roomname: roomname, dungeon: dungeon, password: req.body.password, gameManager: gameManager };
			db.collection('rooms').insert(newRoom, (err, result) => {
				if (err) {
					res.send({ 'error': err });
				} else {
					gameManager.updateRoomID(result.ops[0]._id)
					newRoom.gameManager = gameManager
					db.collection('rooms').update({ _id: result.ops[0]._id }, newRoom, (err, result) => {
						currentGameManagers.push(gameManager.namespace);
						res.send(result);
					})
				}
			})
		} else {
			res.status(400).send({ 'error': 'Duplicate game name not allowed.' })
		}
	});

	app.get('/rooms', (req, res) => {
		if ( R.prop('roomID', req.body) ) {
			const details = { '_id' : new ObjectID(req.body.roomID) };
			db.collection('rooms').findOne(details, (err, item) => {
				if (err){
					res.send({ 'error': err })
				} else {
					turnOnGameManager(item)
					res.send(item);
				}
			})
		} else {
			db.collection('rooms').find().toArray( function(err, items) {
				R.forEach(turnOnGameManager, items)
				res.send(items);
			})
		}
	})

	function turnAllGameManagersOn() {
		db.collection('rooms').find().toArray( function(err, items) {
			R.forEach(turnOnGameManager, items)
		})
	}

	function turnOnGameManager(item) {
		if ( !R.contains(item.namespace, currentGameManagers)) {
			var gameManager = createGameManager(item.roomname, item._id);
			currentGameManagers.push(item._id);
		}
	}

	app.put('/rooms', (req, res) => {
		const details = { '_id' : new ObjectID(req.body.roomID) };
		const newRoom = { roomName: req.body.roomName.replaceAll(' ', '_'), password: req.body.password, dungeon: req.body.dungeon }
		db.collection('rooms').update(details, newRoom, (err, result) => {
			if (err){
				res.send({ 'error': err })
			} else {
				res.send(result)
			}
		})
	})

	app.delete('/rooms', (req, res) => {
		const callback = (err, item) => {
			if (err){
				res.send({ 'error': err });
			} else {
				res.send({ 'message': req.body.roomID + ' deleted.' });
			}
		}
		deleteRoom(req.body.roomID, callback)
	})

	createGameManager = (gameManagerName, dungeon, roomID) => new GameManager(io, gameManagerName, roomID || 'PENDING', dungeon, deleteRoom);

	deleteRoom = (roomID, callback) => {
		if(roomID !== 'PENDING') {
			const details = { '_id' : new ObjectID(roomID) };
			db.collection('rooms').deleteOne(details, callback)
			currentGameManagers = R.filter( (gameManagerID) => gameManagerID === roomID, currentGameManagers)
		}
	}

};

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

String.prototype.replaceAll = function(str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 