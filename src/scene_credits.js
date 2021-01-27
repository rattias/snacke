import Phaser from './lib/phaser.js'
import { mkText } from './text.js'
import { buttonize, linkify, switchToScene } from './util.js'
import { DEFAULT_WIDTH } from './constants.js'

const REPO = 'https://github.com/rattias/snacke'

export default class Credits extends Phaser.Scene {
  constructor () {
    super('credits')
  }

  preload () {
  }

  create () {
    const SCREEN_WIDTH = DEFAULT_WIDTH
    this.cameras.main.fadeIn(500, 0, 0, 0)
    const r0 = this.add.text(SCREEN_WIDTH / 2, 0, 'CREDITS', { fontFamily: 'Arial Black', fontSize: 80, color: '#FF0000', stroke: '#FFFFFF', strokeThickness: 3 }).setOrigin(0.5, 0)
    const txt = [
      ['Developed by:', 'rattias', REPO],
      ['Music by:', 'Michael-DB', 'https://freesound.org/people/Michael-DB/sounds/489035/'],
      ['Sound FX by:', 'Leszek_Szary', 'https://freesound.org/people/Leszek_Szary/sounds/171670/'],
      ['', 'NillyPlays', 'https://freesound.org/people/NillyPlays/sounds/543386/'],
      ['', 'Reitanna', 'https://freesound.org/people/Reitanna/sounds/344036/'],
      ['', 'jacksonacademyashmore', 'https://freesound.org/people/jacksonacademyashmore/sounds/414209/']
    ]
    const lStyle = { fontFamily: 'Arial Black', fontSize: 40, color: '#FFFF00' }
    const rStyle = { fontFamily: 'Arial Black', fontSize: 40, color: '#00FF00', wordWrap: { width: 300 } }
    const goLeft = []
    let maxWidth = 0
    let y = r0.y + r0.displayHeight + 50
    for (let i = 0; i < txt.length; i++) {
      if (txt[i][0] !== '') {
        y += 50
      }
      const t = this.add.text(20, y, txt[i][0], lStyle).setOrigin(0)
      goLeft.push(t)
      y += t.displayHeight
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
      linkify(t, txt[i][2], '#00FF00', '#000000', '#A0FFA0', '#000000')
      gl.x = 10 + maxWidth
      gl.setOrigin(1, 0)
    }
    const lr = goRight[goRight.length - 1]
    const nStyle = { fontFamily: 'Arial Black', fontSize: 40, color: '#A05020', wordWrap: { width: SCREEN_WIDTH - 60 } }

    const note = this.add.text(20, lr.y + lr.displayHeight + 50, 'Special thanks to the Phaser3 developers and community!\n\nCode available at', nStyle)
    const github = this.add.text(20, note.y + note.displayHeight, REPO, nStyle)
    linkify(github, REPO, '#A05020', '#000000', '#D08050', '#000000')
    github.setStyle({ backgroundColor: '#000000' })
    const back = mkText(this, SCREEN_WIDTH / 2, github.y + github.displayHeight + 50, 'Back', { fontFamily: 'Arial Black', fontSize: 50, color: '#008000', backgroundColor: '#303030' })
    console.log(back.x, back.y, back.displayWidth, back.displayHeight)
    back.setOrigin(0.5, 0)
    const scene = this
    buttonize(back, function () {
      switchToScene(scene, 'intro')
    }, '#008000', '#303030', '#00FF00', '#606060')
  }
}
