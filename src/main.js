// Nathan Altice (with contributions from Adam Smith)
// Ported from Phaser CE
// Updated: 10/29/23
// Secret of the Ooze
// Elementary state machine with liquid/solid/gas states & transitions

// Big Brain Debugging
'use strict'

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.AUTO,     
    width: 640 ,
    height: 480,
    scene: [ Ooze ]
}

const game = new Phaser.Game(config)

let { width, height } = game.config    // shortcut: destructuring assignment 👍