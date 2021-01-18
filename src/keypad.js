import { SCREEN_WIDTH } from './constants.js'
import Phaser from './lib/phaser.js'
export default class Keypad {
    static MODE_JOYSTICK = 1
    static MODE_KEYPAD = 2

    _setDir(d, p) {
        this.dir = d
        if (d[0] != 0 || d[1] != 0) {
            p.fillColor = 0x3060FF
            p.lineWidth = 6
            p.x = p.baseX + 4
            p.y = p.baseY + 4
        } else {
            p.fillColor = 0xFF
            p.lineWidth = 4
            p.x = p.baseX
            p.y = p.baseY
        }
    }

    getDir() {
         return this.dir
    }


    constructor(scene, x, y, width, height) {
        this.scene = scene
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]]
        this.dir = this.dirs[4]
        this.cursors = scene.input.keyboard.createCursorKeys();
        var lh = Math.floor(width/4)
        var lv = Math.floor(height/4)
        var delta = 5
        var data = [
            {poly: [-2*lh, -lv, -lh, -lv, 0, 0, -lh, lv, -2*lh, lv], dir: [0, -1], key: this.cursors.left},
            {poly: [0, 0, -lh, -lv, -lh, -2*lv, lh, -2*lv, lh, -lv], dir: [-1, 0], key: this.cursors.up},
            {poly: [0, 0, lh, -lv, 2*lh, -lv, 2*lh, lv, lh, lv], dir: [0, 1], key: this.cursors.right},
            {poly: [0, 0, lh, lv, lh, 2*lv, -lh, 2*lv, -lh, lv], dir: [1, 0], key: this.cursors.down}
        ]
        var go = []
        for(let i=0; i<4; i++) {
            var d = data[i]
            let p = scene.add.polygon(x, y, d.poly, 0xFF)
            p.setOrigin(0, 0)
            p.setInteractive(p.geom, Phaser.Geom.Polygon.Contains)
            let dir = d.dir
            let zz = [0, 0]
            var set = function() {this._setDir(dir, p)}
            var clear = function() {this._setDir(zz, p)}
            p.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, set , this)
            p.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, clear, this)
            go.push(p)
            p.x += d.dir[1] * delta
            p.y += d.dir[0] * delta
            p.baseX = p.x
            p.baseY = p.y
            p.setStrokeStyle(4, 0xefc53f);
            d.key.on('down', set, this)
            d.key.on('up', clear, this)
        }
    }
}