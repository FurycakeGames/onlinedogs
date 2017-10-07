var socket = io();

var socketId;

socket.on('emitSocketId', function(data){
	socketId = data;
	console.log(data);
})

var PLAYER_LIST = {};
var ASTEROID_LIST = {};


var bootState = {
	create: function(){
		game.stage.disableVisibilityChange = true;		
		game.state.start('load');
	}
}