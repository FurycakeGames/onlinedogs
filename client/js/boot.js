var socket = io();

var socketId;

socket.on('emitSocketId', function(data){
	socketId = data;
	console.log(data);
})


var bootState = {

  init:function() {

	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;

	if (!game.device.desktop){
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	}



  },

	create: function(){

	
		game.state.start('load');
	}
}