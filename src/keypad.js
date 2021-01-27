import Phaser from './lib/phaser.js'
export default class Keypad {
  _setDir (d, p) {
    this.dir = d
    if (p) {
      if (d[0] !== 0 || d[1] !== 0) {
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
  }

  getDir () {
    return this.dir
  }

  constructor (scene, x, y, width, height) {
    this.scene = scene
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]]
    this.dir = this.dirs[4]
    this.cursors = scene.input.keyboard.createCursorKeys()
    const lh = Math.floor(width / 4)
    const lv = Math.floor(height / 4)
    const delta = 5
    const data = [
      { poly: [-2 * lh, -lv, -lh, -lv, 0, 0, -lh, lv, -2 * lh, lv], dir: [0, -1], key: this.cursors.left },
      { poly: [0, 0, -lh, -lv, -lh, -2 * lv, lh, -2 * lv, lh, -lv], dir: [-1, 0], key: this.cursors.up },
      { poly: [0, 0, lh, -lv, 2 * lh, -lv, 2 * lh, lv, lh, lv], dir: [0, 1], key: this.cursors.right },
      { poly: [0, 0, lh, lv, lh, 2 * lv, -lh, 2 * lv, -lh, lv], dir: [1, 0], key: this.cursors.down }
    ]
    const go = []
    const zz = [0, 0]
    for (let i = 0; i < 4; i++) {
      const d = data[i]
      const dir = d.dir
      const p = width ? scene.add.polygon(x, y, d.poly, 0xFF) : null
      const set = function () { this._setDir(dir, p) }
      const clear = function () { this._setDir(zz, p) }
      if (p) {
        p.setOrigin(0, 0)
        p.setInteractive(p.geom, Phaser.Geom.Polygon.Contains)
        p.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, set, this)
        p.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, clear, this)
        go.push(p)
        p.x += d.dir[1] * delta
        p.y += d.dir[0] * delta
        p.baseX = p.x
        p.baseY = p.y
        p.setStrokeStyle(4, 0xefc53f)
      }
      d.key.on('down', set, this)
      d.key.on('up', clear, this)
    }
  }
}
