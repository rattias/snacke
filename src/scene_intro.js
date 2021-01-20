import { EGG_BROWN_ID, EGG_WHITE_ID, EGG_BLUE_ID, EGG_GOLD_ID, EGG_BLACK_ID, SCREEN_WIDTH } from './constants.js'
import Phaser from './lib/phaser.js'

import { textSnacke, textDescription, textEgg, mkText } from './text.js'
import { buttonize, switchToScene } from './util.js'

const DURATION = 500

export default class Intro extends Phaser.Scene {
  constructor () {
    super('intro')
  }

  preload () {
    this.load.spritesheet('tiles', 'assets/tiles.png', { frameWidth: 34, frameHeight: 34 })
  }

  create () {
    const title = textSnacke(this)
    const desc = textDescription(this)
    const eggX = desc.x - desc.width / 2
    let currY = desc.y + desc.height + 32
    const eggTiles = [EGG_BROWN_ID, EGG_WHITE_ID, EGG_BLUE_ID, EGG_GOLD_ID, EGG_BLACK_ID]
    const colors = ['#e5a45b', '#f4f4f4', '#2aaae7', '#ffee56', '#808080']
    const objs = []
    for (let i = 0; i < eggTiles.length; i++) {
      const egg = this.add.sprite(0, currY + 8, 'tiles', eggTiles[i])
      egg.setOrigin(0)
      egg.alpha = 0
      const txt = textEgg(this, currY, eggTiles[i])
      txt.setFill(colors[i])
      txt.setOrigin(0)
      currY += txt.height + 20
      objs.push(egg)
      objs.push(txt)
    }
    const last = objs[objs.length - 1]

    const startGame = mkText(this, SCREEN_WIDTH / 2, last.y + last.height + 80, 'Start Game', { fontFamily: 'Arial Black', fontSize: 50, color: '#008000', backgroundColor: '#303030' })
    startGame.setOrigin(0.5, 0).setAlpha(0)
    const scene = this
    buttonize(startGame, function () {
      switchToScene(scene, 'game')
    })

    const credits = mkText(this, SCREEN_WIDTH / 2, startGame.y + startGame.height + 50, 'Show Credits', { fontFamily: 'Arial Black', fontSize: 50, color: '#008000', backgroundColor: '#303030' })
    credits.setOrigin(0.5, 0).setAlpha(0)
    buttonize(credits, function () {
      switchToScene(scene, 'credits')
    })

    const timeline = this.tweens.createTimeline()
    timeline.add({ targets: title, scale: { from: 0, to: 1 }, alpha: { from: 0, to: 1 }, ease: 'Power1', duration: DURATION, repeat: 0 })
    timeline.add({ targets: desc, scale: { from: 0, to: 1.0 }, alpha: { from: 0, to: 1 }, ease: 'Power1', duration: DURATION, repeat: 0 })
    timeline.add({ targets: objs, alpha: { from: 0, to: 1 }, x: { from: 0, to: eggX }, ease: 'Power1', duration: DURATION, repeat: 0 })
    timeline.add({ targets: [startGame, credits], alpha: { from: 0, to: 1 }, x: { from: 0, to: SCREEN_WIDTH / 2 }, ease: 'Power1', duration: DURATION, repeat: 0 })
    timeline.play()
  }
}
