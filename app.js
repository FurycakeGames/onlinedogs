var express = require('express');
var app = express();
var serv = require('http').Server(app);


//CLASSES LOAD

var m = require('./classes')




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

var game_speed = 10;
var playing = false;
var players_connected = 0;
var players_alive = 0;
var SOCKET_LIST = {};
var PLAYER_LIST = {};
var OBSTACLE_A_LIST = {};


function sortPositions(){
	//sort
	var array = [];
	var array_size = 0;
	for (var i in PLAYER_LIST){
		array.push([PLAYER_LIST[i].x, PLAYER_LIST[i].id]);
		array_size += 1;
	}
	array.sort(sortFunction);
	//set scores
	for (var i = 0; i < array_size; i++){
		PLAYER_LIST[array[i][1]].score += i;
	}
	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('setScores', PLAYER_LIST);
	}
}

function sortFunction(a, b){
	if (a[0] === b[0]){
		return 0;
	}
	else{
		return (a[0] < b[0]) ? -1 : 1;
	}
}


var obstacle_a_timer = 200;
var score_timer = 1000;


createObstacleA = function(){
	var obstacle = m.Obstacle_a(Math.random(), PLAYER_LIST, OBSTACLE_A_LIST, game_speed, SOCKET_LIST);
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



	console.log('socket connection ' + socket.id);

	socket.emit('emitSocketId', socket_id);

	socket.on('setUsername', function(data){
		var player = m.Player(socket.id, PLAYER_LIST);
		PLAYER_LIST[socket.id] = player;
		PLAYER_LIST[socket.id].username = data;
		socket.emit('createPlayers', PLAYER_LIST);
		socket.emit('createObstacleA', OBSTACLE_A_LIST);
		socket.broadcast.emit('newPlayer', PLAYER_LIST[socket.id]);
		socket.emit('setScores', PLAYER_LIST);
	})


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
			stamina: player.stamina,
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
		if (obstacleA){
			pack.push({
				x: obstacleA.x,
				id: obstacleA.id,
			});
		}
	}

	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('obstacleAPositions', pack);
		socket.emit('gameSpeed', [game_speed]);
	}

	obstacle_a_timer -= 1;
	if (obstacle_a_timer < 0) {
		obstacle_a_timer = 200;
		createObstacleA();
	}

	score_timer -= 1;
	if (score_timer < 0) {
		score_timer = 600;
//		sortPositions();
	}

	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('setScores', PLAYER_LIST);
	}


}, 1000/30);