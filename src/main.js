// Nathan Altice & Adam Smith
// Ported from Phaser CE
// Updated: 4/25/23
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

const game = new Phaser.Game(config);

let { width, height } = game.config;    // shortcut: destructuring assignment 👍