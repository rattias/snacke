import Phaser from './lib/phaser.js'
import { SCREEN_WIDTH } from './constants.js'
import { mkText } from './text.js'
import { buttonize, switchToScene } from './util.js'

export default class Credits extends Phaser.Scene {
  constructor () {
    super('credits')
  }

  preload () {
  }

  create () {
    this.cameras.main.fadeIn(500, 0, 0, 0)
    const r0 = this.add.text(SCREEN_WIDTH / 2, 0, 'CREDITS', { fontFamily: 'Arial Black', fontSize: 80, color: '#FF0000', stroke: '#FFFFFF', strokeThickness: 3 }).setOrigin(0.5, 0)
    const txt = [
      ['Developed by:', 'rattias'],
      ['Music by:', 'Michael-DB'],
      ['Sound FX by:', 'Leszek_Szary, NillyPlays, Reitanna, jacksonacademyashmore']
    ]
    const lStyle = { fontFamily: 'Arial Black', fontSize: 40, color: '#FFFF00' }
    const rStyle = { fontFamily: 'Arial Black', fontSize: 40, color: '#00FF00', wordWrap: { width: 300 } }
    const goLeft = []
    let maxWidth = 0
    let y = r0.y + r0.displayHeight + 50
    for (let i = 0; i < txt.length; i++) {
      const t = this.add.text(20, y, txt[i][0], lStyle).setOrigin(0)
      goLeft.push(t)
      y += r0.displayHeight + 10
      if (t.displayWidth > maxWidth) {
        maxWidth = t.displayWidth
      }
    }
    console.log('maxWidth = ' + maxWidth)
    const goRight = []
    for (let i = 0; i < txt.length; i++) {
      const gl = goLeft[i]
      const t = this.add.text(gl.x + maxWidth + 10, gl.y, txt[i][1], rStyle).setOrigin(0)
      goRight.push(t)
      gl.x = 10 + maxWidth
      gl.setOrigin(1, 0)
    }
    const lr = goRight[goRight.length - 1]
    const nStyle = { fontFamily: 'Arial Black', fontSize: 30, color: '#A05020', wordWrap: { width: SCREEN_WIDTH - 60 } }

    const note = this.add.text(20, lr.y + lr.displayHeight + 50, 'Special thanks to the Phaser3 developers and community!\n\nCode available at https://github.com/rattias/snacke', nStyle)

    const back = mkText(this, SCREEN_WIDTH / 2, note.y + note.displayHeight + 50, 'Back', { fontFamily: 'Arial Black', fontSize: 50, color: '#008000', backgroundColor: '#303030' })
    console.log(back.x, back.y, back.displayWidth, back.displayHeight)
    back.setOrigin(0.5, 0)
    const scene = this
    buttonize(back, function () {
      switchToScene(scene, 'intro')
    })
  }
}
