// Nathan Altice
// Ported from Phaser CE
// Updated: 7/8/20
// Secret of the Ooze
// Elementary state machine with liquid/solid/gas states & transitions

// Big Brain Debugging
'use strict';

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.AUTO,     
    width: 640 ,
    height: 480,
    scene: [ Ooze ]
};

// define game
const game = new Phaser.Game(config);

// globals
let cursors;