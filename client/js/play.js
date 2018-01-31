var playState = {
  create: function(){

    var username = window.location.search.substring(10, window.location.search.length);

    socket.emit('setUsername', username);

    var background_group = game.add.group();

    var particles_group = game.add.group();

    var game_group = game.add.group();
    game_group.x = game.width / 2;
    game_group.y = game.height / 2 - 15;
    game_group.pivot.x = game.width / 2;
    game_group.pivot.y = game.height / 2;

    var DOGS = {};
    var DOGS_HUD = {};
    var DOGS_HUD_TAG = {};
    var DOGS_HUD_SCORE = {};
    var OBSTACLE_A = {};
    var BACK = {};

    for (i = 12; i >= 1; i--) {
      BACK[i] = this.add.tileSprite(240, 0, 512, 512, 'bg_amusement_' + i)
      BACK[i].anchor.x = 0.5
      background_group.add(BACK[i])
    };

    var car = game.add.sprite(-8, 0, 'car');
    game.add.tween(car).to( {x: 0}, 1000, Phaser.Easing.Sinusoidal.In, true, 0, -1, true)



    background_group.add(car)
    car.animations.add('walk', Phaser.Animation.generateFrameNames('car', 1, 4, '.png'), 10, true, false);
    car.animations.play('walk');

    var style = { font: "18px Arial", fill: "#ffffff", align: "left" };
    var nametagstyle = { font: "13px Tahoma", fill: "#ffffff", align: "left" };
    var hud_tag_style = { font: "18px Arial", fill: "#ffffff", align: "center" };
    var score_style = { font: "18px Arial", fill: "#ffffff", align: "right" };

    
//    var time_text = game.add.text(200, 20, "Time: ", style);

    var PLAYER_LIST = {};

    socket.on('emitPlayers', function(data){
      PLAYER_LIST = data;
    })
    
    socket.on('setScores', function(data){
      for (var i in data){
        DOGS_HUD_SCORE[i].text = data[i].score;
      }
    })



    socket.on('usergone', function(data){
      console.log(data)
      DOGS[data].destroy();
      DOGS_HUD[data].destroy();
      DOGS_HUD_TAG[data].destroy();
      DOGS_HUD_SCORE[data].destroy();
    })

    socket.on('deleteObstacleA', function(data){
      if (OBSTACLE_A[data]){
        OBSTACLE_A[data].destroy();
      } 
    })

    socket.on('newPlayer', function(data){
      if(data.id !== socketId){
        DOGS[data.id] = game.add.sprite(data.x, data.y, 'sunny')
        game_group.add(DOGS[data.id])
        DOGS[data.id].id = data.id;
        DOGS[data.id].dustcounter = 0;
        DOGS[data.id].anchor.y = 0.17;

        DOGS[data.id].animations.add('running', Phaser.Animation.generateFrameNames('run', 1, 4, '.png'), 18, true, false);
        DOGS[data.id].animations.add('jumpup', ['jump2.png'], 18 + Math.random() * 2, true, false);
        DOGS[data.id].animations.add('jumpdown', ['jump1.png'], 18 + Math.random() * 2, true, false);
        DOGS[data.id].animations.play('running');


        //hud
        DOGS_HUD[data.id] = game.add.sprite((data.slot - 1) * 85 + 48, 270, 'fullscreen')
        DOGS_HUD[data.id].anchor.x = 0.5
        DOGS_HUD[data.id].anchor.y = 0.5

        DOGS_HUD_TAG[data.id] = game.add.text((data.slot - 1) * 85 + 35, 304, data.username, nametagstyle);
        DOGS_HUD_TAG[data.id].anchor.y = 0.5
        DOGS_HUD_SCORE[data.id] = game.add.bitmapText((data.slot - 1) * 85 + 85, 270, 'acme', data.score,28);
        DOGS_HUD_SCORE[data.id].anchor.x = 0.5
        DOGS_HUD_SCORE[data.id].anchor.y = 0.5
      }
    });

    socket.on('createPlayers', function(data){
      for (var i in data){
        DOGS[data[i].id] = game.add.sprite(data[i].x, data[i].y, 'sunny');
        game_group.add(DOGS[data[i].id])
        DOGS[data[i].id].id = data[i].id;
        DOGS[data[i].id].dustcounter = 0;
        DOGS[data[i].id].anchor.y = 0.17;


        DOGS[data[i].id].animations.add('running', Phaser.Animation.generateFrameNames('run', 1, 4, '.png'), 18, true, false);
        DOGS[data[i].id].animations.add('jumpup', ['jump2.png'], 18 + Math.random() * 2, true, false);
        DOGS[data[i].id].animations.add('jumpdown', ['jump1.png'], 18 + Math.random() * 2, true, false);
        DOGS[data[i].id].animations.add('kicking', Phaser.Animation.generateFrameNames('kick', 1, 2, '.png'), 10, false, false);
        DOGS[data[i].id].animations.play('running');



        DOGS[data[i].id].animations.play('running');
        if (data[i].id === socketId){
          DOGS[data[i].id].tint = 0xAAAAFF;
        }
        else{
        }

        //hud
        DOGS_HUD[data[i].id] = game.add.sprite((data[i].slot - 1) * 85 + 48, 270, 'sunnyface')
        DOGS_HUD[data[i].id].anchor.x = 0.5;
        DOGS_HUD[data[i].id].anchor.y = 0.5;
        DOGS_HUD[data[i].id].scale.setTo(2);


        DOGS_HUD_TAG[data[i].id] = game.add.text((data[i].slot - 1) * 85 + 35, 304, data[i].username, nametagstyle);
        DOGS_HUD_TAG[data[i].id].anchor.y = 0.5

        DOGS_HUD_SCORE[data[i].id] = game.add.bitmapText((data[i].slot - 1) * 85 + 85, 270, 'acme', data[i].score,28);
        DOGS_HUD_SCORE[data[i].id].anchor.x = 0.5
        DOGS_HUD_SCORE[data[i].id].anchor.y = 0.5

      }
    });

    socket.on('createObstacleA', function(data){
      for (var i in data){
        OBSTACLE_A[data[i].id] = game.add.sprite(data[i].x, data[i].y + 8, 'spring');
        game_group.add(OBSTACLE_A[data[i].id])
        OBSTACLE_A[data[i].id].scale.setTo(0.5, 0.5);
        OBSTACLE_A[data[i].id].id = data[i].id;
      }
    })

    socket.on('newObstacleA', function(data){
      OBSTACLE_A[data.id] = game.add.sprite(data.x, data.y + 8, 'spring');
      game_group.add(OBSTACLE_A[data.id])
      OBSTACLE_A[data.id].scale.setTo(0.5, 0.5);
      OBSTACLE_A[data.id].id = data.id;
    })

    socket.on('obstacleAPositions', function(data){
      for (var i in data){
        if (OBSTACLE_A[data[i].id]){
          game.add.tween(OBSTACLE_A[data[i].id]).to( {x: data[i].x}, 50, Phaser.Easing.Linear.None, true, 0, 0, false)


        }
      }
    });

//    game_group.rotation = -0.01;


    socket.on('newPositions', function(data){
      for (var i in data){
        if (DOGS[data[i].id]){
//          DOGS[data[i].id].x = data[i].x

          game.add.tween(DOGS[data[i].id]).to( {x: data[i].x, y: data[i].y- 34}, 50, Phaser.Easing.Linear.None, true, 0, 0, false)

//          game.add.tween(DOGS[data[i].id]).to( {y: data[i].y - 34}, 30, Phaser.Easing.Linear.None, true, 0, 0, false)


//          DOGS[data[i].id].y = data[i].y - 34
          if (!data[i].rolling && !data[i].tripping){
            if (data[i].ySpeed > 1){
              DOGS[data[i].id].animations.play('jumpdown');
            }
            else if(data[i].ySpeed < 0){
              DOGS[data[i].id].animations.play('jumpup');
            }
            else if(data[i].y > 198){
              DOGS[data[i].id].animations.play('running');
            }
          }
          else if(data[i].tripping){
            DOGS[data[i].id].animations.play('kill')
          }
          else if(data[i].rolling){
            DOGS[data[i].id].animations.play('kicking', 7, true);
          }

          if (DOGS[data[i].id].animations.currentAnim.name == 'running'){
            DOGS[data[i].id].dustcounter += 1;
          }
          else{
            DOGS[data[i].id].dustcounter = 0;            
          }
/*
          if (DOGS[data[i].id].dustcounter >= 8){
            DOGS[data[i].id].dustcounter = 0;
            var dustparticle = game.add.sprite(DOGS[data[i].id].x + 25, DOGS[data[i].id].y + 48, 'dust');
            background_group.add(dustparticle)
            dustparticle.scale.x = 0.5
            dustparticle.scale.y = 0.5
            dustparticle.tint = 0x000000;
            game.add.tween(dustparticle).to( {alpha: 0}, 400, Phaser.Easing.Quadratic.In, true, 0, 0, false)
            game.add.tween(dustparticle).to( {x: dustparticle.x - 20 - Math.random() * 20, y: dustparticle.y - 10}, 250, Phaser.Easing.Quadratic.Out, true, 0, 0, false)
            game.add.tween(dustparticle.scale).to( {x: 1, y:1 }, 250, Phaser.Easing.Linear.None, true, 0, 0, false)
          }
*/
        }
      }
    })

    game.input.onDown.add(function(){
      if (game.input.x > 240){
        socket.emit('jump', socketId)
      }
      else {
        socket.emit('roll', socketId)        
      }
    }, this)

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
      var keyCode = event.which;
      if (keyCode == 90) {
        socket.emit('jump', socketId)
      }
      if (keyCode == 77) {
        socket.emit('roll', socketId)
      }
    };



    var back_factor = [1, 0, 0.95, 0.7, 0.6, 0.05, 0.00000, 0.025, 0.17, 0.1, 0.05, 0];

    socket.on('gameSpeed', function(data){

      for (i = 1; i <= 12; i++) {
        game.add.tween(BACK[i].tilePosition).to( {x: BACK[i].tilePosition.x - back_factor[i - 1] * data[0]}, 50, Phaser.Easing.Linear.None, true, 0, 0, false)
      }

    })


  },

  update: function(){

    
  }

}