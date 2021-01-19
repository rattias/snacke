import { EGG_BROWN_ID, EGG_WHITE_ID, EGG_BLUE_ID, EGG_GOLD_ID, EGG_BLACK_ID } from './constants.js';
import Phaser from './lib/phaser.js'
import {SCREEN_WIDTH} from './constants.js'
import { textSnacke, textDescription, textEgg, textPressAnyKeyToStart, mkText} from './text.js';
import { onTouchOrKeyOnce } from './util.js'
import Game from './scene_game.js'
import Credits from './scene_credits.js'
const DURATION = 500

export default class Intro extends Phaser.Scene {

    constructor() {
        super("intro")
    }

    preload() {
        this.load.spritesheet('tiles', 'assets/tiles.png', { frameWidth: 34, frameHeight: 34 });        
    }

    _buttonize(txt, onClick) {
        txt.setInteractive({ useHandCursor: true })
        txt.on(Phaser.Input.Events.POINTER_OVER, function() {
            txt.setStyle({color: '#00FF00', backgroundColor: '#606060'})
        }, this)
        txt.on(Phaser.Input.Events.POINTER_OUT, function() {
            txt.setStyle({color: '#008000', backgroundColor: '#303030'})
        }, this)
        txt.on(Phaser.Input.Events.POINTER_DOWN, onClick, this)
    }

    create() {
        var title = textSnacke(this)
        var desc = textDescription(this)
        var egg_x = desc.x - desc.width/2
        var curr_y = desc.y + desc.height + 32
        var egg_tiles = [EGG_BROWN_ID, EGG_WHITE_ID, EGG_BLUE_ID, EGG_GOLD_ID, EGG_BLACK_ID]
        var colors = ["#e5a45b", "#f4f4f4", "#2aaae7", "#ffee56", "#808080"]
        var objs = []
        for(let i=0; i<egg_tiles.length; i++) {
            var egg = this.add.sprite(0, curr_y + 8, 'tiles', egg_tiles[i]);
            egg.setOrigin(0)
            egg.alpha = 0
            var txt = textEgg(this, curr_y, egg_tiles[i])
            txt.setFill(colors[i])
            txt.setOrigin(0)
            curr_y += txt.height + 20
            objs.push(egg)
            objs.push(txt)
        }
        var currScene = this
        var last = objs[objs.length - 1]

        var anyKey = textPressAnyKeyToStart(this)
        anyKey.setFill("#006000")
        anyKey.y = last.y + last.height + 80

        var credits = mkText(this, SCREEN_WIDTH/2, anyKey.y + anyKey.height + 50, "Show Credits", {fontFamily: "Arial Black", fontSize: 30, color: '#008000', backgroundColor: '#303030'})
        credits.setOrigin(.5, 0)
        this._buttonize(credits, function() {
            currScene.cameras.main.fadeOut(500, 0, 0, 0)
            currScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('credits')
            })
        })
        
        var timeline = this.tweens.createTimeline();
        timeline.add({targets: title, scale:{from: 0, to: 1}, alpha:{from: 0, to: 1}, ease: 'Power1', duration: DURATION, repeat: 0})
        timeline.add({targets: desc, scale:{from: 0, to: 1.0}, alpha:{from:0, to: 1}, ease: 'Power1', duration: DURATION, repeat: 0})
        timeline.add({targets: objs, alpha:{from: 0, to: 1}, x:{from: 0, to: egg_x}, ease: 'Power1', duration: DURATION, repeat: 0})
        timeline.add({targets: [anyKey], alpha:{from: 0, to: 1}, x:{from: 0, to: SCREEN_WIDTH/2}, ease: 'Power1', duration: DURATION, repeat: 0})
        timeline.play()
        onTouchOrKeyOnce(this, function () {
            currScene.cameras.main.fadeOut(500, 0, 0, 0)
            currScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                var game = currScene.scene.start('game');
            })
        })

    }
}
