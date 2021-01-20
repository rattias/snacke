import Phaser from './lib/phaser.js'
export default class Joystick {
  _setDir (d) {
    this.dir = d
    this.stick.x = this.x + this.size / 2 + d[1] * this.size / 4
    this.stick.y = this.y + this.size / 2 + d[0] * this.size / 4
  }

  getDir () {
    return this.dir
  }

  constructor (scene, x, y, size, diag) {
    if (diag === undefined) diag = true
    this.scene = scene
    this.x = x
    this.y = y
    this.size = size
    this.wh = Math.floor(size / 3)
    this.dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]]
    this.dir = this.dirs[4]
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const idx = j * 3 + i
        if ((!diag) && (idx === 0 || idx === 2 || idx === 6 || idx === 8)) {
          continue
        }
        const r = scene.add.rectangle(x + i * this.wh, y + j * this.wh, this.wh, this.wh, 0x0000FF, 1)
        r.setStrokeStyle(2, 0x00FF00, 1)

        r.setInteractive()
        r.setOrigin(0)
        r.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, function () { this._setDir(this.dirs[j * 3 + i]) }, this)
        r.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, function () { this._setDir(this.dirs[4]) }, this)
      }
    }
    this.stick = scene.add.sprite(this.x + size / 2, this.y + size / 2, 'redball')
    this.stick.displayWidth = size / 2
    this.stick.displayHeight = size / 2

    this.cursors = scene.input.keyboard.createCursorKeys()
    this.cursors.up.on('down', function () { this._setDir(this.dirs[1]) }, this)
    this.cursors.up.on('up', function () { this._setDir(this.dirs[4]) }, this)
    this.cursors.down.on('down', function () { this._setDir(this.dirs[7]) }, this)
    this.cursors.down.on('up', function () { this._setDir(this.dirs[4]) }, this)
    this.cursors.left.on('down', function () { this._setDir(this.dirs[3]) }, this)
    this.cursors.left.on('up', function () { this._setDir(this.dirs[4]) }, this)
    this.cursors.right.on('down', function () { this._setDir(this.dirs[5]) }, this)
    this.cursors.right.on('up', function () { this._setDir(this.dirs[4]) }, this)
  }
}
