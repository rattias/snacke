import { EGG_BROWN_ID, EGG_WHITE_ID, EGG_BLUE_ID, EGG_GOLD_ID, EGG_BLACK_ID } from './constants.js';
import Phaser from './lib/phaser.js'
import {SCREEN_WIDTH} from './constants.js'
import { textSnacke, textDescription, textEgg, textPressAnyKeyToStart} from './text.js';
import { onTouchOrKeyOnce } from './input.js'
import Game from './scene_game.js'
const DURATION = 500

export default class Intro extends Phaser.Scene {
    preload() {
        this.load.spritesheet('tiles', 'assets/tiles.png', { frameWidth: 34, frameHeight: 34 });        
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

        var anyKey = textPressAnyKeyToStart(this)
        anyKey.setFill("#006000")
        var last = objs[objs.length - 1]
        anyKey.y = last.y + last.height + 100

        var timeline = this.tweens.createTimeline();
        timeline.add({targets: title, scale:{from: 0, to: 1}, alpha:{from: 0, to: 1}, ease: 'Power1', duration: DURATION, repeat: 0})
        timeline.add({targets: desc, scale:{from: 0, to: 1.0}, alpha:{from:0, to: 1}, ease: 'Power1', duration: DURATION, repeat: 0})
        timeline.add({targets: objs, alpha:{from: 0, to: 1}, x:{from: 0, to: egg_x}, ease: 'Power1', duration: DURATION, repeat: 0})
        timeline.add({targets: [anyKey], alpha:{from: 0, to: 1}, x:{from: 0, to: SCREEN_WIDTH/2}, ease: 'Power1', duration: DURATION, repeat: 0})
        timeline.play()
        var currScene = this
        onTouchOrKeyOnce(this, function () {
            console.log("key pressed")
            currScene.cameras.main.fadeOut(1000, 0, 0, 0)
            var game = currScene.scene.add('game', Game, true);
            game.cameras.main.fadeIn(1000, 0, 0, 0)

        })

    }
}
