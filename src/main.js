import Phaser from './lib/phaser.js'
import Intro from './scene_intro.js'
import {SCREEN_WIDTH, SCREEN_HEIGHT} from './constants.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
        parent: 'mygame',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width:  SCREEN_WIDTH,
        height: SCREEN_HEIGHT
    },
    scene: Intro,
})