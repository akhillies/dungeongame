var R = require('ramda')
var _ = require('underscore')

function GameManager(io, namespace, roomID, dungeon, deleteRoom) {

  this.updateRoomID = (id) => {
    this.roomID = id
    roomID = id
  }

  this.roomID = roomID
  var roomID = roomID
	this.namespace = namespace;

	var roomSocket = io.of(namespace);

	roomSocket.on('connection', function(socket) {

    /** GAME INITIATION. */

    var playername

    socket.on('identify', function(player){
      console.log('Reaching', player)
      playername = player
    })

    socket.on('Up', function(){
      emitMovement('Up')
    })

    socket.on('Down', function(){
      emitMovement('Down')
    })

    socket.on('Left', function(){
      emitMovement('Left')
    })

    socket.on('Right', function(){
      emitMovement('Right')
    })

    emitMovement = (direction) => {
      roomSocket.emit('Move', { direction: direction, playername: playername })
    }

    socket.on('disconnect', function(reason) {
      roomSocket.clients( function(error, clients){
        if(clients.length === 0) {
          if(process.env.REACT_APP_DEBUG === 'false'){
            deleteRoom(roomID)
          }
        }
      })
    })
	})
}

GameManager.prototype.id = function() {
	return this.namespace.hashCode();
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

module.exports = GameManager;