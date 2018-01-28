var loadState = {
   preload: function(){

    game.load.spritesheet('husky','assets/husky.png',33,33);
    game.load.image('back_1','assets/back_1.png');
    game.load.image('back_2','assets/back_2.png');
    game.load.image('back_3','assets/back_3.png');
    game.load.image('back_4','assets/back_4.png');
    game.load.image('floor','assets/floor.png');
    game.load.image('spring','assets/spring.png');    
    game.load.image('obstacle','assets/obstacle.png');
    game.load.image('fullscreen','assets/fullscreen.png');


//LOAD AMUSEMENT PARK

    for (i = 1; i <= 12; i++) {
      game.load.image('bg_amusement_' + i,'assets/amusement/bg_amusement_' + i + '.png');    
    }



    //fonts
    game.load.bitmapFont('acme', 'fonts/acme.png', 'fonts/acme.fnt');
    game.load.bitmapFont('opensans', 'fonts/opensans.png', 'fonts/opensans.fnt');
  },
   create: function(){
    game.state.start('play');    
   }
}