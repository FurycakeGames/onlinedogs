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
		if(game.device.desktop) {
		 
		// desktop view - desktop code here
//		game.scale.pageAlignHorizontally = true;
		//this.scale.setScreenSize(true);
		 
		} else {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(480, 320, 720, 480);
		}

		game.stage.disableVisibilityChange = true;		
		game.state.start('load');
	}
}