var loadState = {
   preload: function(){

    game.load.spritesheet('husky','assets/husky.png',33,33);
    game.load.image('spring','assets/spring.png');    
    game.load.image('fullscreen','assets/fullscreen.png');
    game.load.image('dust','assets/dust.png');

    game.load.atlasJSONHash('car', 'assets/atlas/car.png', 'assets/atlas/car.json');
    game.load.atlasJSONHash('sunny', 'assets/dogs/sunny.png', 'assets/dogs/sunny.json');
    game.load.image('sunnyface','assets/dogs/sunnyface.png');


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