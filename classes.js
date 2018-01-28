var Player = function(id, PLAYER_LIST){
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
		yAccel: 0.8,
		xDrag: 0.17,
		onFloor: true,
		tripping: false,
		rolling_timer: 0,
		dashing: false,
		rolling: false,
		canmove: false,
		canmove_timer: 0,
		rolling_timer: 0,
		stamina: 100,
	};

	self.updatePosition = function(){

		//friction
		if (self.xSpeed < -0.4 && self.y == 200 && !self.rolling && !self.tripping){
			self.xSpeed = -0.4;
		}

		//is in front
		if (self.x > 400){
			self.score += 10;
			self.xSpeed = -10;
			self.ySpeed = -11;
			self.xAccel = 0.7;
			self.dashing = false;
			self.canmove = false;
		}

		if (self.canmove_timer > 0){
			self.canmove_timer -= 1;
		}

		//is in back
		if (self.x < 20){
			self.score -= 5;
			self.xSpeed = 0;
			self.ySpeed = 0;
			self.dashing = false;
			self.tripping = false;
			self.xAccel = 0;
			self.y = 120;
			self.x = 200;
			self.canmove = false;
			self.canmove_timer = 20;
		}


		if (self.stamina < 100){
			self.stamina = 100 //Math.min(self.stamina + 5 - (self.x / 250), 100)
		}
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

		if (!self.rolling){
			if (self.xSpeed > -2){
				self.xAccel = Math.max(-0.07 - self.x / 2000, -0.17);
			}
			else{
				self.xAccel = 0.1;
			}
		}

		self.xSpeed += self.xAccel - 0.1;
		self.ySpeed += self.yAccel;
		self.x = Math.min(self.x + self.xSpeed, 500);
		self.y += self.ySpeed;
		if (self.y > 200){
			if (self.canmove_timer == 0){
				self.canmove = true;
			}
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
					self.xSpeed += 4;
					self.ySpeed = -5;
					self.score += 1;
					PLAYER_LIST[i].tripping = true;
					PLAYER_LIST[i].tripping_timer = 15;
					PLAYER_LIST[i].xSpeed -= 6;
//					PLAYER_LIST[i].score -= Math.min(PLAYER_LIST[i].score, 1);
				}
				//ROLLING COLLISION
				if (self.x > PLAYER_LIST[i].x && self.x < PLAYER_LIST[i].x + 30 && self.rolling && !PLAYER_LIST[i].tripping && PLAYER_LIST[i].y > 190){
					self.xSpeed = 7;
					self.ySpeed = -5;
					self.rolling = false;
					self.rolling_timer = 0;
					self.score += 1;
					PLAYER_LIST[i].tripping = true;
					PLAYER_LIST[i].tripping_timer = 15;
					PLAYER_LIST[i].xSpeed -= 6;
//					PLAYER_LIST[i].score -= Math.min(PLAYER_LIST[i].score, 3);
				}
			}
		}
	};

	self.jump = function(){
		if (!self.tripping && !self.rolling && self.canmove){
			if (self.y >= 197 && !self.rolling){
				self.dashing = false;
				self.ySpeed = -9;
				self.xSpeed = 0
			}
			if (self.y < 197 && !self.dashing && self.stamina === 100){
				self.dashing = true;
				self.xSpeed += 10;
				self.ySpeed = -5;
				self.stamina = 0;
			}
		}
	};

	self.roll = function(){
		if (self.y >= 197 && !self.rolling && !self.tripping && self.stamina == 100 && self.canmove){
			self.rolling = true;
			self.rolling_timer = 12;
			self.xSpeed -= 12;
			self.xAccel = 0.7;
			self.stamina = 0;
		}
	};

	return self;
};

var Obstacle_a = function(id, PLAYER_LIST, OBSTACLE_A_LIST, game_speed, SOCKET_LIST){
	var self = {
		x: Math.random() * 200 + 600,
		y: 215,
		speed: game_speed,
		id: id,
	};

	self.update = function(){
		//checkcollision
		for (var i in PLAYER_LIST){
			if (PLAYER_LIST[i].x + 70 > self.x && PLAYER_LIST[i].x + 20 < self.x && PLAYER_LIST[i].y > 170 && !PLAYER_LIST[i].tripping && PLAYER_LIST[i].ySpeed > 0){
				PLAYER_LIST[i].dashing = true;
//				PLAYER_LIST[i].tripping = true;
//				PLAYER_LIST[i].tripping_timer = 50;
				PLAYER_LIST[i].xSpeed += 10;
				PLAYER_LIST[i].ySpeed = -8;
			}
		}
		self.x -= self.speed;
		if (self.x < -20){
			delete OBSTACLE_A_LIST[self.id];
			for (var i in SOCKET_LIST){
				var socket = SOCKET_LIST[i];
				socket.emit('deleteObstacleA', self.id);
			}
		}
	}
	return self;
};

module.exports.Player = Player;
module.exports.Obstacle_a = Obstacle_a;


var Bone = function(id, x, y){
	var self = {
		x: Math.random() * 200 + 600,
		y: 215,
		speed: game_speed,
		id: id,
	};

	self.update = function(){
		//checkcollision
		for (var i in PLAYER_LIST){
			if (PLAYER_LIST[i].x + 70 > self.x && PLAYER_LIST[i].x + 20 < self.x && PLAYER_LIST[i].y > 170 && !PLAYER_LIST[i].tripping){
				PLAYER_LIST[i].tripping = true;
				PLAYER_LIST[i].tripping_timer = 50;
				PLAYER_LIST[i].xSpeed -= 2.5;
			}
		}
		self.x -= self.speed;
		if (self.x < -20){
			delete OBSTACLE_A_LIST[self.id];
			for (var i in SOCKET_LIST){
				var socket = SOCKET_LIST[i];
				socket.emit('deleteObstacleA', self.id);
			}
		}
	}
	return self;
};

