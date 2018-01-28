var socket = io();

var socketId;

socket.on('emitSocketId', function(data){
	socketId = data;
	console.log(data);
})


var bootState = {

  init:function() {

//    Phaser.Canvas.setImageRenderingCrisp(game.canvas);


  	if(game.device.desktop) {
		// desktop view - desktop code here

		 
		} else {
//	    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		}
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;


  },

	create: function(){

	
		game.state.start('load');
	}
}