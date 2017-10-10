var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(process.env.PORT || 2000);
console.log('Server started.')

function checkDistance(a, b){
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var dz = a.z - b.z;
  return Math.sqrt(dx*dx+dy*dy+dz*dz);
}

var game_speed = 6;
var playing = false;
var players_connected = 0;
var players_alive = 0;
var SOCKET_LIST = {};
var PLAYER_LIST = {};
var OBSTACLE_A_LIST = {};

var Player = function(id){
	var self = {
		x: Math.random() * 400 + 20,
		y: 200,
		id: id,
		alive: true,
		score: 0,
		username: 0,
		xSpeed: 0,
		ySpeed: 0,
		xAccel: -0.13,
		yAccel: 0.4,
		xDrag: 0.17,
		onFloor: true,
		tripping: false,
		rolling_timer: 0,
		dashing: false,
		rolling: false,
		rolling_timer: 0,
	};

	self.updatePosition = function(){
		if (Math.abs(self.xSpeed) > 0){
			if (Math.abs(self.xSpeed) < self.xDrag * 1.5){
				self.xSpeed = 0;
			}
			else if(self.xSpeed > 0){
				self.xSpeed -= self.xDrag;
			}
			else{
				self.xSpeed += self.xDrag;
			}
		}
		self.xAccel = Math.max(-0.07 - self.x / 2000, -0.25);
		self.xSpeed += self.xAccel;
		self.ySpeed += self.yAccel;
		self.x += self.xSpeed;
		self.y += self.ySpeed;
		if (self.y > 200){
			self.y = 200;
			self.ySpeed = 0;
			self.dashing = false;
		}
		//rolling
		if (self.rolling_timer > 0){
			self.rolling_timer -= 1;
		}
		else if (self.rolling){
			self.rolling = false;
			self.xSpeed = 0;
		}
		if (self.tripping_timer > 0){
			self.tripping_timer -= 1;
		}
		else if (self.tripping){
			self.tripping = false;
			self.xSpeed = 0;
		}
//COLLISSIONS
		for (var i in PLAYER_LIST){
			if (self !== PLAYER_LIST[i]){
				//DASHING COLLISION
				if (self.x < PLAYER_LIST[i].x + 30 && self.x > PLAYER_LIST[i].x - 15 && self.y < PLAYER_LIST[i].y && self.y > PLAYER_LIST[i].y - 30 && self.dashing && !PLAYER_LIST[i].tripping){
					PLAYER_LIST[i].tripping = true;
					PLAYER_LIST[i].tripping_timer = 15;
					PLAYER_LIST[i].xSpeed -= 4;
					self.xSpeed += 3;
					self.ySpeed = -5;
				}
				//ROLLING COLLISION
				if (self.x > PLAYER_LIST[i].x && self.x < PLAYER_LIST[i].x + 30 && self.rolling && !PLAYER_LIST[i].tripping && PLAYER_LIST[i].y > 190){
					PLAYER_LIST[i].tripping = true;
					PLAYER_LIST[i].tripping_timer = 15;
					PLAYER_LIST[i].xSpeed -= 4;
					self.xSpeed += 6;
					self.ySpeed = -5;
					self.rolling = false;
					self.rolling_timer = 0;
				}
			}
		}
	};

	self.jump = function(){
		if (!self.tripping && !self.rolling){
			if (self.y >= 197 && !self.rolling){
				self.dashing = false;
				self.ySpeed = -6;
			}
			if (self.y < 197 && !self.dashing){
				self.dashing = true;
				self.xSpeed = 7.4;
				self.ySpeed = -2;
			}
		}
	};

	self.roll = function(){
		if (self.y >= 197 && !self.rolling && !self.tripping){
			self.rolling = true;
			self.rolling_timer = 10;
			self.xSpeed -= 5;
		}
	};

	return self;
};

var obstacle_a_timer = 200;

var Obstacle_a = function(id){
	var self = {
		x: Math.random() * 200 + 600,
		y: 215,
		speed: game_speed,
		id: id,
	};

	self.update = function(){
		//checkcollision
		for (var i in PLAYER_LIST){
			if (PLAYER_LIST[i].x + 50 > self.x && PLAYER_LIST[i].x + 10 < self.x && PLAYER_LIST[i].y > 170 && !PLAYER_LIST[i].tripping){
				PLAYER_LIST[i].tripping = true;
				PLAYER_LIST[i].tripping_timer = 25;
				PLAYER_LIST[i].xSpeed -= 3;
			}
		}
		self.x -= self.speed;
		if (self.x < -20){
			delete[OBSTACLE_A_LIST, self.id];
			for (var i in SOCKET_LIST){
				var socket = SOCKET_LIST[i];
				socket.emit('deleteObstacleA', self.id);
			}
		}
	}
	return self;
};

createObstacleA = function(){
	var obstacle = Obstacle_a(Math.random());
	OBSTACLE_A_LIST[obstacle.id] = obstacle;
	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('newObstacleA', obstacle);
	}
};



var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	players_connected += 1;
	players_alive += 1;
	if (playing === false){

	}
	socket.id = Math.random();
	var socket_id = socket.id;
	SOCKET_LIST[socket.id] = socket;

	var player = Player(socket.id);
	PLAYER_LIST[socket.id] = player;

	console.log('socket connection ' + socket.id);

	socket.emit('emitSocketId', socket_id);

	socket.on('setUsername', function(data){
		PLAYER_LIST[socket.id].username = data;
		socket.emit('createPlayers', PLAYER_LIST);
		socket.emit('createObstacleA', OBSTACLE_A_LIST)
	})

	socket.broadcast.emit('newPlayer', player);

	socket.on('jump', function(data){
		PLAYER_LIST[data].jump();
	});

	socket.on('roll', function(data){
		PLAYER_LIST[data].roll();
	});



 	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		console.log('disconnected ' + socket_id)
		socket.broadcast.emit('usergone', socket_id);
  })
});


setInterval(function(){
	var pack = [];
	for (var i in PLAYER_LIST){
		PLAYER_LIST[i].updatePosition();
		var player = PLAYER_LIST[i];
		pack.push({
			x: player.x,
			y: player.y,
			xSpeed: player.xSpeed,
			ySpeed: player.ySpeed,
			id:player.id,
			tripping: player.tripping,
			rolling: player.rolling,
		});
	}

	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions', pack);
		socket.emit('emitPlayers', PLAYER_LIST);
	}

	pack = [];
	for (var i in OBSTACLE_A_LIST){
		OBSTACLE_A_LIST[i].update();
		var obstacleA = OBSTACLE_A_LIST[i];
		pack.push({
			x: obstacleA.x,
			id: obstacleA.id,
		});
	}

	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('obstacleAPositions', pack);
		socket.emit('gameSpeed', game_speed);
	}

	obstacle_a_timer -= 1;
	if (obstacle_a_timer < 0) {
		obstacle_a_timer = 200;
		createObstacleA();
	}

}, 1000/30);