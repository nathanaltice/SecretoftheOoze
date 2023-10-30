class Ooze extends Phaser.Scene {
    constructor() {
        super('oozeScene')
    }

    preload() {
        // load assets
        this.load.path = './assets/'
        this.load.image('solid', 'solid.png')
        this.load.image('liquid', 'liquid.png')
        this.load.image('gas', 'gas.png')
        this.load.image('yoshi', 'dino.png')
        this.load.image('egg', 'yegg.png')
        this.load.image('shregg', 'shregg.png')
    }

    create() {
        // change bg color
        this.cameras.main.setBackgroundColor('#222')

        // add our mutating sprite object (ooze) to the scene
        this.ooze = this.add.sprite(width/2, height/2, 'liquid')

        // define all of the ooze's states (as a JSON object) to feed to state machine
        this.oozeStates = [
			{
                'name': 'liquid',
                'initial': 	true,           // our starting state
				'events': {                 // `events` define what actions are possible...
					'freeze': 'solid',      // ...and which states those actions transition to
					'vaporize': 'gas' 
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
				'name': 'gas',
				'events': {
					'condense': 'liquid'
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
                'name': 'yoshi',
                'events': {
                    'ascend': 'shregg',
                    'defy god': 'egg'
                }
            },
            {
                'name': 'shregg',
                'events': {
                    'nuke': 'liquid'
                }
            },
        ]

        // create a state machine on our ooze object, passing JSON states object & target object
        this.ooze.oozeFSM = new StateMachine(this.oozeStates, this.ooze)

        // define transition variables
        this.transitionTime = 750      // how long the transition takes (in ms)
        this.transitioning = false     // initialize transition flag

        // define and display info text
        this.statusText = this.add.text(width/2, height/6, `State: ${this.ooze.oozeFSM.getState().name}`).setOrigin(0.5)
        this.transitionText = this.add.text(width/2, height/6*5, ``).setOrigin(0.5)
        this.updateDisplayInfo()
        
        // define 'pulsing' ellipse shape to obscure the asset swap during transitions
        this.ellipse01 = this.add.ellipse(width/2, height/2, width/4, width/6, 0xAAFF88).setAlpha(0)
        this.ellipse02 = this.add.ellipse(width/2, height/2, width/6, width/4, 0x88FFAA).setAlpha(0)

        // capture keyboard input and pass to event handler callback
        this.input.keyboard.on('keydown', this.keyEventHandler, this)
    }

    keyEventHandler(event) {
        // ignore non-numeric keys
        if(isNaN(event.key)) { return }

        // ignore keydown during transitions
        if(this.transitioning) { return }

        // convert key string to index and check against available events
        let eventIndex = Number.parseInt(event.key) - 1
        let availableEvents = Object.keys(this.ooze.oozeFSM.getCurrentStateEvents())
        // exit the handler if no event matches the key entered...
        if (eventIndex >= availableEvents.length) { return }
        // ...otherwise, proceed
        let selectedEvent = availableEvents[eventIndex]
        
        // execute state transition
        this.transitioning = true
        this.transitionText.text = `Enacting: ${ selectedEvent }...`
        this.time.delayedCall(this.transitionTime, () => {  // create transition timer
            this.transitioning = false
            this.ooze.oozeFSM.consumeEvent(selectedEvent)  // make the state change
            this.updateDisplayInfo()
        })

        // play ellipse pulse animation
        this.tweens.add({
            targets: [this.ellipse01, this.ellipse02],
            alpha: {
                from: 0, 
                to: 1
            },
            scale: {
                from: 1.1, 
                to: 0.9
            },
            duration: this.transitionTime,
            ease: 'Sine.easeInOut',
            yoyo: true
        })
    }

    updateDisplayInfo() {
        // update sprite texture
        let currentState = this.ooze.oozeFSM.getState()
        this.ooze.setTexture(currentState.name)
        // use array.map to create an array of text options to print to screen
        let availableActions = Object.keys(this.ooze.oozeFSM.getCurrentStateEvents()).map(
            (currentValue, index) => `(${ index + 1 }) ${ currentValue }`
        )
        // update text
        this.statusText.text = `State: ${this.ooze.oozeFSM.currentState.name}`
        this.transitionText.text = `Actions: ${availableActions.join(' ')}`
    }
}