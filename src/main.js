// Nathan Altice
// Created: 7/6/20
// Updated: 7/7/20
// United States
// StateMachine Class from mkelly.me/blog/phaser-finite-state-machine
// Turn-Based FSM example

// Big Brain Debugging
'use strict';

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.AUTO,     
    width: 640 ,
    height: 480,
    //pixelArt: true,
    physics: {
        default: "arcade"
    },
    scene: [ Ooze ]
};

// define game
const game = new Phaser.Game(config);

// globals
let cursors;