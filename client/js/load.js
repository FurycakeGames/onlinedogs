var loadState = {
   preload: function(){
    game.load.spritesheet('husky','assets/husky.png',33,33);
    game.load.image('back_1','assets/back_1.png');
    game.load.image('back_2','assets/back_2.png');
    game.load.image('back_3','assets/back_3.png');
    game.load.image('back_4','assets/back_4.png');
    game.load.image('floor','assets/floor.png');
    game.load.image('obstacle','assets/obstacle.png');

  },
   create: function(){
    game.state.start('play');    
   }
}