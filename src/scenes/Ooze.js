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
        this.load.image('yoshi', 'dino.png');
        this.load.image('egg', 'yegg.png');
        this.load.image('shregg', 'shregg.png');
    }

    create() {
        // change bg color
        this.cameras.main.setBackgroundColor('#222');

        // add liquid ooze
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
        this.transitionTime = 750; 

        // create state machine on ooze object, passing JSON states object & target object
        this.ooze.oozeFSM = new StateMachine(this.oozeStates, this.ooze);

        // initialize our transitioning flag
        this.transitioning = false;

        // display info text
        this.statusText = this.add.text(game.config.width/2, game.config.height/6, `State: ${this.ooze.oozeFSM.getState().name}`).setOrigin(0.5);
        this.transitionText = this.add.text(game.config.width/2, game.config.height/6*5, ``).setOrigin(0.5);
        this.syncDisplayInfo();
        
        // throbber objects will obscure the asset swap during transitions
        this.throbber1 = this.add.ellipse(game.config.width/2, game.config.height/2, game.config.width/4,game.config.width/6, 0xAAFF88);
        this.throbber2 = this.add.ellipse(game.config.width/2, game.config.height/2, game.config.width/6,game.config.width/4, 0x88FFAA);
        this.throbber1.alpha = 0;
        this.throbber2.alpha = 0;
        
        // pulse slowly
        this.tweens.add({
            targets: [this.throbber1],
            scale: {from: 1.1, to: 0.9},
            duration: 500,
            yoyo: true,
            ease: 'Sine.easeInOut',
            repeat: -1,
        });

        // pulse slightly slowlier
        this.tweens.add({
            targets: [this.throbber2],
            scale: {from: 1.1, to: 0.9},
            duration: 432,
            yoyo: true,
            ease: 'Sine.easeInOut',
            repeat: -1,
        });

        // ask for keydown events as they happen
        this.input.keyboard.on('keydown', this.keydown, this);
    }

    keydown(event) {

        // ignore non-numeric keys
        if(isNaN(event.key)) {
            return;
        }

        // ignore keydown during transitions
        if(this.transitioning) {
            return;
        }

        // which event are they trying to enact?
        let index = Number.parseInt(event.key) - 1; // start at 1
        let availableEvents = Object.keys(this.ooze.oozeFSM.currentState.events);
        
        // we only have a few of them
        if(index >= availableEvents.length) {
            return;
        }
        let selectedEvent = availableEvents[index];
        
        // set a timer while we transition
        this.transitioning = true;
        this.transitionText.text = `Enacting: ${selectedEvent}...`;
        this.time.delayedCall(this.transitionTime, () => {
            this.transitioning = false;
            this.ooze.oozeFSM.consumeEvent(selectedEvent);
            this.syncDisplayInfo();
        });

        // wooze them in the meantime
        this.tweens.add({
            targets: [this.throbber1, this.throbber2],
            alpha: {from: 0, to: 1},
            duration: this.transitionTime,
            ease: 'Sine.easeInOut',
            yoyo: true
        })
    }

    syncDisplayInfo() {
        this.ooze.setTexture(this.ooze.oozeFSM.currentState.name);
        let options = Object.keys(this.ooze.oozeFSM.currentState.events).map((k,i) => `(${i+1}) ${k}`);
        this.transitionText.text = `Actions: ${options.join(', ')}`;
        this.statusText.text = `State: ${this.ooze.oozeFSM.currentState.name}`;
    }
}