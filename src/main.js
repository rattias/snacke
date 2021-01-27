import Phaser from './lib/phaser.js'
import Intro from './scene_intro.js'
import Credits from './scene_credits.js'
import Game from './scene_game.js'
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from './constants.js'

export default new Phaser.Game({
  type: Phaser.AUTO,
  scale: {
    parent: 'mygame',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  audio: {
    disableWebAudio: true
  },
  dom: {
    createContainer: true
  },
  scene: [Intro, Game, Credits]
})
