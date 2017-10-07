var playState = {
  create: function(){
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    var username = window.location.search.substring(10, window.location.search.length);

    var DOGS = {};
    var OBSTACLE_A = {};
    //background create
    back_1=this.add.sprite(0,0,'back_1');
    back_1.scale.set(4);
    back_1.smoothed=false;

    back_2=this.add.sprite(0,0,'back_2');
    back_2.scale.set(4);
    back_2.smoothed=false;

    back_3=this.add.tileSprite(0, -50, 256, 256, 'back_3');
    back_3.scale.set(3);
    back_3.smoothed=false;

    back_4=this.add.tileSprite(0, -50, 256, 256, 'back_4');
    back_4.scale.set(3);
    back_4.smoothed=false;

    floor = this.add.tileSprite(0, -162, 256, 256, 'floor');
    floor.scale.set(2);
    floor.smoothed = false;


    
    var PLAYER_LIST = {};

    socket.on('emitPlayers', function(data){
      PLAYER_LIST = data;
    })
    
    socket.emit('setUsername', username);

    socket.on('usergone', function(data){
      console.log(data)
      DOGS[data].destroy();
    })


    socket.on('newPlayer', function(data){
      DOGS[data.id] = game.add.sprite(data.x, data.y, 'husky')
      DOGS[data.id].id = data.id;
      DOGS[data.id].smoothed = false;
      DOGS[data.id].scale.setTo(2, 2);
      DOGS[data.id].animations.add('walking', [1,1,2,2,3,3,2,2],6,true);
      DOGS[data.id].animations.add('running', [4,5,6,7],12,true);
      DOGS[data.id].animations.add('sprinting',[4,5,6,7],12,true);
      DOGS[data.id].animations.add('jumpup',[8]);
      DOGS[data.id].animations.add('jumpdown',[9]);
      DOGS[data.id].animations.add('stop', [0]);
      DOGS[data.id].animations.add('kill',[10]);
      DOGS[data.id].animations.play('running');  
    });

    socket.on('createPlayers', function(data){
      for (var i in data){
        DOGS[data[i].id] = game.add.sprite(data[i].x, data[i].y, 'husky');
        DOGS[data[i].id].id = data[i].id;
        DOGS[data[i].id].smoothed = false;
        DOGS[data[i].id].scale.setTo(2, 2);
        DOGS[data[i].id].animations.add('walking', [1,1,2,2,3,3,2,2],6,true);
        DOGS[data[i].id].animations.add('running', [4,5,6,7],12,true);
        DOGS[data[i].id].animations.add('sprinting',[4,5,6,7],12,true);
        DOGS[data[i].id].animations.add('jumpup',[8]);
        DOGS[data[i].id].animations.add('jumpdown',[9]);
        DOGS[data[i].id].animations.add('stop', [0]);
        DOGS[data[i].id].animations.add('kill',[10]);
        DOGS[data[i].id].animations.play('running');  
      }
    });

    socket.on('createObstacleA', function(data){
      for (var i in data){
        OBSTACLE_A[data[i].id] = game.add.sprite(data[i].x, data[i].y + 24, 'obstacle');
        OBSTACLE_A[data[i].id].scale.setTo(0.5, 0.5);
        OBSTACLE_A[data[i].id].id = data[i].id;
      }
    })

    socket.on('newObstacleA', function(data){
      OBSTACLE_A[data.id] = game.add.sprite(data.x, data.y + 24, 'obstacle');
      OBSTACLE_A[data.id].scale.setTo(0.5, 0.5);
      OBSTACLE_A[data.id].id = data.id;
    })

    socket.on('obstacleAPositions', function(data){
      for (var i in data){
        OBSTACLE_A[data[i].id].x = data[i].x;
      }
    });


    socket.on('newPositions', function(data){
      for (var i in data){
        DOGS[data[i].id].x = data[i].x
        DOGS[data[i].id].y = data[i].y
        if (data[i].ySpeed > 1){
          DOGS[data[i].id].animations.play('jumpdown');
        }
        else if(data[i].ySpeed < 0){
          DOGS[data[i].id].animations.play('jumpup');
        }
        else if(data[i].y == 200){
          DOGS[data[i].id].animations.play('running');
        }
      }
    })


    document.addEventListener("keydown", onDocumentKeyUp, false);
    function onDocumentKeyUp(event) {
      var keyCode = event.which;
      if (keyCode == 90) {
        socket.emit('jump', socketId)
      }
    };

    game.input.onDown.add(function(){
      socket.emit('jump', socketId)
    }, this)

    socket.on('gameSpeed', function(data){
      back_3.tilePosition.x -= data * 0.0015;
      back_4.tilePosition.x -= data * 0.05;
      floor.tilePosition.x -= data * 0.5;
    })


  },

  update: function(){

    
  }

}