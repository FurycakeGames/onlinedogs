var game = new Phaser.Game(480, 320, Phaser.AUTO,'', null, false, false);


game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('boot');