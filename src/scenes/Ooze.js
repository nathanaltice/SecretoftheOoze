class Ooze extends Phaser.Scene {
    constructor() {
        super('oozeScene');
    }

    preload() {
        // load assets
        this.load.path = './assets/';
        this.load.image('solid', 'solid.png');
        this.load.image('liquid', 'liquid.png');
        this.load.image('gas', 'gas.png');
        this.load.image('dino', 'dino.png');
        this.load.image('egg', 'yegg.png');
        this.load.image('shregg', 'shregg.png');
    }

    create() {
        // change bg color
        this.cameras.main.setBackgroundColor('#222');

        // add solid ooze
        this.ooze = this.add.sprite(game.config.width/2, game.config.height/2, 'liquid');

        // create ooze states (as a JSON object)
        // solid | liquid | gas & accompanying transitions
        this.oozeStates = [
            {
                'name': 'shregg',
                'events': {
                    'nuke': 'liquid'
                }
            },
            {
                'name': 'yoshi',
                'events': {
                    'ascend': 'shregg',
                    'defy god': 'egg'
                }
            },
            {
                'name': 'egg',
                'events': {
                    'hatch': 'yoshi',
                    'abandon': 'solid'
                }
            },
            {
				'name': 'solid',
				'events': {
                    'melt': 'liquid',
                    'nurture': 'egg'
				}
			},
			{
                'name': 'liquid',
                'initial': 	true,
				'events': {
					'freeze': 	'solid',
					'vaporize': 'gas' 
				}
			},
			{
				'name': 'gas',
				'events': {
					'condense': 'liquid'
				}
            }
        ];

        // define transition time (ms)
        this.transitionTime = 1500; 

        // create state machine on ooze object, passing JSON states object & target object
        this.ooze.oozeFSM = new StateMachine(this.oozeStates, this.ooze);

        // initialize our transitioning flag
        this.transitioning = false;

        // display info text
        this.statusText = this.add.text(game.config.width/2, game.config.height/6, `State: ${this.ooze.oozeFSM.getState().name}`).setOrigin(0.5);

        this.transitionText = this.add.text(game.config.width/2, game.config.height/6*5, `Transition: stable`).setOrigin(0.5);

        // create input keys
        cursors = this.input.keyboard.createCursorKeys();

        // update instruction text
        document.getElementById('info').innerHTML = '<strong>Ooze.js</strong>: Left Arrow (Cool) / Right Arrow (Cool) / Other Arrows (???)';
    }

    update() {
        // get current state
        this.oozeCurrentState = this.ooze.oozeFSM.getState();

        switch(this.oozeCurrentState.name) {
            // ***********************************************************
			case 'solid':
                if(Phaser.Input.Keyboard.JustDown(cursors.up) && !this.transitioning) {
					this.statePhase('nurture', 'egg');
				}
				if(Phaser.Input.Keyboard.JustDown(cursors.right) && !this.transitioning) {
					this.statePhase('melt', 'liquid');	
				}
			    break;
			// ***********************************************************
			case 'liquid':
				if(Phaser.Input.Keyboard.JustDown(cursors.left) && !this.transitioning) {
					this.statePhase('freeze', 'solid');
				}
				if(Phaser.Input.Keyboard.JustDown(cursors.right) && !this.transitioning) {
					this.statePhase('vaporize', 'gas');
				}
			    break;
			// ***********************************************************
			case 'gas':
				if(Phaser.Input.Keyboard.JustDown(cursors.left) && !this.transitioning) {
					this.statePhase('condense', 'liquid');
				}
			    break;
            // ***********************************************************
            case 'egg':
				if(Phaser.Input.Keyboard.JustDown(cursors.up) && !this.transitioning) {
					this.statePhase('hatch', 'dino');
                }
                if(Phaser.Input.Keyboard.JustDown(cursors.down) && !this.transitioning) {
					this.statePhase('abandon', 'solid');
				}
			    break;
            // ***********************************************************
            case 'yoshi':
				if(Phaser.Input.Keyboard.JustDown(cursors.up) && !this.transitioning) {
					this.statePhase('ascend', 'shregg');
                }
                if(Phaser.Input.Keyboard.JustDown(cursors.down) && !this.transitioning) {
					this.statePhase('defy god', 'egg');
				}
			    break;
            // ***********************************************************
            case 'shregg':
                if(Phaser.Input.Keyboard.JustDown(cursors.down) && !this.transitioning) {
					this.statePhase('nuke', 'liquid');
				}
			    break;
			// ***********************************************************
			default:
                console.warn('Unknown state');
                break;
            // ***********************************************************
        }

        // update status text
        this.statusText.text = `State: ${this.oozeCurrentState.name}`;
        if(!this.transitioning) this.transitionText.text = `Transition: stable`;
    }

    statePhase(phase, texture) {
        // set a timer while we transition
        this.transitioning = true;
        this.transitionText.text = `Transition: ${phase}...`;
        // .delayedCall(delay, callback, args, scope)
        this.time.delayedCall(this.transitionTime, () => {
            this.transitioning = false;
            this.ooze.setTexture(texture);
            this.ooze.oozeFSM.consumeEvent(phase);
        }, null, this);
    }
}