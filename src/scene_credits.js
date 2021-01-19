import Phaser from './lib/phaser.js'
import {SCREEN_WIDTH, SCREEN_HEIGHT} from './constants.js'
const DURATION = 500

export default class Credits extends Phaser.Scene {
    constructor() {
        super("credits")
    }
    
    preload() {
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0)
        var r0  = this.add.text(SCREEN_WIDTH/2, 0, "CREDITS", {fontFamily: "Arial Black", fontSize: 80, color: '#FF0000', stroke: '#FFFFFF', strokeThickness: 3}).setOrigin(0.5, 0)
        var txt = [
            ["Developed by:", "rattias"],
            ["Music by:", "Michael-DB"],
            ["Sound FX by:", "Leszek_Szary, NillyPlays, Reitanna, jacksonacademyashmore"],
        ]
        var lStyle = {fontFamily: "Arial Black", fontSize: 40, color: '#FFFF00'}
        var rStyle = {fontFamily: "Arial Black", fontSize: 40, color: '#00FF00', wordWrap: { width : 300}}
        var goLeft = []
        var maxWidth = 0
        var y = r0.y + r0.displayHeight + 50
        for(let i = 0; i < txt.length; i++) {
            var t = this.add.text(20, y, txt[i][0], lStyle).setOrigin(0)
            goLeft.push(t)
            y += r0.displayHeight + 10
            if (t.displayWidth > maxWidth)
                maxWidth = t.displayWidth
        }
        console.log('maxWidth = '+maxWidth)
        var goRight = []
        for(let i = 0; i < txt.length; i++) {
            var gl = goLeft[i]
            var t = this.add.text(gl.x + maxWidth + 10, gl.y, txt[i][1], rStyle).setOrigin(0)
            goRight.push(t)
            gl.x = 10 + maxWidth
            gl.setOrigin(1, 0)
        }
        var lr = goRight[goRight.length-1]
        var nStyle = {fontFamily: "Arial Black", fontSize: 30, color: '#A05020', wordWrap: { width : SCREEN_WIDTH-60}}

        this.add.text(20, lr.y + lr.displayHeight + 50, "Special thanks to the Phaser3 developers and community!\n\nCode available at https://github.com/rattias/snacke", nStyle)
    }

}
