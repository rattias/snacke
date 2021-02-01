import Phaser from './lib/phaser.js'
import Level from './level.js'
import Snake from './snake.js'
import { randomize, colorMix, switchToScene, isMobile } from './util.js'
import { mkText, textWon, textGameOver } from './text.js'
import { TILE_WIDTH, TILE_HEIGHT, HEADER_ROWS, EGG_BLACK_ID, LIFE_ID, EGG_BLUE_ID, EGG_BROWN_ID, EGG_WHITE_ID, EGG_GOLD_ID, EMPTY_ID, HOLE_FOREGROUND_START, HOLE_BACKGROUND } from './constants.js'

import Keypad from './keypad.js'

const HEADER_TEXT_STYLE = { fontFamily: 'Arial Black', fontSize: 32, color: '#3030FF' }
const DEFAULT_SNAKE_SPEED_TILES_PER_SEC = 10
const DEBUG_FPS = true

export default class Game extends Phaser.Scene {
  constructor () {
    super('game')
    this.level = 0
    this.lives = 3
    this.energy = 1
    this.burnRate = 0.005
    this.eggs = null
    this.score = 0
  }

  preload () {
    //    this.load.image('platform', 'assets/Environment/ground_grass.png')
    this.load.image('tiles', 'assets/tiles.png')
    this.load.audio('music', 'assets/Audio/music.wav')
    this.load.audio('bleah_sound', 'assets/Audio/bleah.wav')
    this.load.audio('chomp_sound', 'assets/Audio/chomp.wav')
    this.load.audio('success_sound', 'assets/Audio/success.wav')
    this.load.audio('death_sound', 'assets/Audio/death.wav')
    this.load.spritesheet('sprites', 'assets/tiles.png', { frameWidth: 34, frameHeight: 34 })
    this.load.spritesheet('fullscreen', 'assets/fullscreen-white.png', { frameWidth: 64, frameHeight: 64 })
    this.load.image('redball', 'assets/redball.png')
  }

  _mazeSide (isles, bushSize) {
    return isles * (bushSize + 1) + 3
  }

  _layout (size) {
    const res = {}
    res.headerHeight = HEADER_ROWS * TILE_HEIGHT
    res.mazeX = 0
    res.mazeY = res.headerHeight

    const mazeVsKeypadHeightPercent = isMobile(this) ? 0.66 : 1
    // first, we decide whether the window has a portrait or landscape orientation.
    // In the former case, we do 8 horizontal isles and 6 vertical ones. In the latter case,
    // the opposite.
    const ar = (window.innerHeight * mazeVsKeypadHeightPercent) / window.innerWidth
    if (ar > 1) {
      res.hIsles = 8
      res.vIsles = 6
      if (Math.abs(this._mazeSide(8, 3) / this._mazeSide(6, 4) - ar) <
        Math.abs(this._mazeSide(8, 4) / this._mazeSide(6, 3) - ar)) {
        res.bushCols = 4
        res.bushRows = 3
      } else {
        res.bushCols = 3
        res.bushRows = 4
      }
    } else {
      res.hIsles = 6
      res.vIsles = 8
      if (Math.abs(this._mazeSide(6, 3) / this._mazeSide(8, 4) - ar) <
        Math.abs(this._mazeSide(6, 4) / this._mazeSide(8, 3) - ar)) {
        res.bushCols = 4
        res.bushRows = 3
      } else {
        res.bushCols = 3
        res.bushRows = 4
      }
    }
    res.mazeCols = this._mazeSide(res.vIsles, res.bushCols)
    res.mazeRows = this._mazeSide(res.hIsles, res.bushRows)
    res.mazeWidth = res.mazeCols * TILE_WIDTH
    res.mazeHeight = res.mazeRows * TILE_HEIGHT
    res.mazeX = 0
    res.mazeY = res.headerHeight

    res.scoreTxtX = 10
    res.scoreTxtY = res.mazeY / 2
    res.scoreTxtOX = 0
    res.scoreTxtOY = 0.5

    res.levelTxtX = res.mazeX + res.mazeWidth - 1
    res.levelTxtY = res.scoreTxtY
    res.levelTxtOX = 1
    res.levelTxtOY = 0.5

    res.livesX = res.mazeX + res.mazeWidth / 2
    res.livesY = res.scoreTxtY
    res.livesOX = 0
    res.livesOY = 0.5

    res.energyBarX = res.mazeX + res.mazeWidth
    res.energyBarY = res.mazeY + res.mazeHeight - 1
    res.energyBarOX = 0
    res.eneryBarOY = 1
    res.energyBarWidth = TILE_WIDTH
    res.energyBarHeight = res.mazeHeight

    res.width = (res.mazeCols + 1) * TILE_WIDTH
    res.height = Math.floor(res.mazeHeight / mazeVsKeypadHeightPercent) + res.headerHeight
    const PADDING = 20
    if (isMobile(this)) {
      res.kpadSide = Math.floor(res.height - res.headerHeight - res.mazeHeight - 2 * PADDING)
    } else {
      res.kpadSide = 0
    }
    res.kpadX = res.width / 2
    res.kpadY = Math.floor(res.headerHeight + res.mazeHeight + PADDING + res.kpadSide / 2)
    this.lo = res
    return res
  }

  /**
     * setup a level
     */
  _setupLevel () {
    this.resetEffect()
    this.lv = Level.getLevel(this.level, this.lo)
    this.bgLayer.putTilesAt(this.lv.background, 0, 0, true)
    this.mazeLayer.putTilesAt(this.lv.tile_map, 0, 0, true)
    this.fgLayer.fill(EMPTY_ID, 0, 0, this.lo.mazeCols, this.lo.mazeRows)
    this.levelTxt.setText('Level: ' + (this.level + 1))
    this.snake = new Snake(this)
    // update lives
    for (let i = 0; i < 3; i++) {
      this.livesImg[i].setAlpha(i < this.lives ? 1 : 0)
    }
    this.elapsed = 0
    this.snakeSpeed = DEFAULT_SNAKE_SPEED_TILES_PER_SEC

    this.running = false
    this.music = this.sound.add('music')
    this.music.play({ loop: true })
    this.initEggs()
    this.addHoles(this.lv.holes)
    this.energy = 1.0
    this.updateEnergyBar()
    const txt = []
    const mazeCenterX = (this.lo.mazeX + this.lo.mazeWidth) / 2
    const mazeCenterY = (this.lo.mazeY + this.lo.mazeHeight) / 2
    const lvl = mkText(this, mazeCenterX, mazeCenterY, 'Level ' + (this.level + 1), { fontFamily: 'Arial Black', fontSize: 80 })
    lvl.setOrigin(0.5)
    const msg = ['3', '2', '1', 'Go!']
    const timeline = this.tweens.createTimeline()
    for (let i = 0; i < msg.length; i++) {
      txt.push(mkText(this, mazeCenterX, mazeCenterY + lvl.height + 4, msg[i], { fontFamily: 'Arial Black', fontSize: 70 }))
      txt[i].alpha = 0
      txt[i].setOrigin(0.5)
      timeline.add({ targets: txt[i], scale: { from: 0, to: 1 }, alpha: { from: 0, to: 1 }, ease: 'Power1', duration: 500, repeat: 0, yoyo: true })
    }
    const scene = this
    timeline.on('complete', function () {
      this.running = true
      lvl.destroy()
      for (let i = 0; i < txt.length; i++) {
        txt[i].destroy()
      }
      scene.levelStartTime = new Date()
    }, this)
    timeline.play()
  }

  /**
   * initializes eggs
   */
  initEggs () {
    this.eggsToAdd = []
    if ('dyn_delay' in this.lv) {
      this.addEggDelay = this.lv.dyn_delay
      for (let i = 0; i < this.lv.eggs.brown; i++) {
        this.eggsToAdd.push(EGG_BROWN_ID)
      }
      for (let i = 0; i < this.lv.eggs.white; i++) {
        this.eggsToAdd.push(EGG_WHITE_ID)
      }
      for (let i = 0; i < this.lv.eggs.blue; i++) {
        this.eggsToAdd.push(EGG_BLUE_ID)
      }
      for (let i = 0; i < this.lv.eggs.gold; i++) {
        this.eggsToAdd.push(EGG_GOLD_ID)
      }
      for (let i = 0; i < this.lv.eggs.black; i++) {
        this.eggsToAdd.push(EGG_BLACK_ID)
      }
      randomize(this.eggsToAdd)
      this.eggs = 0
    } else {
      const lv = Level.getLevel(this.level)
      this.addEggs(lv.eggs.brown, EGG_BROWN_ID)
      this.addEggs(lv.eggs.white, EGG_WHITE_ID)
      this.addEggs(lv.eggs.blue, EGG_BLUE_ID)
      this.addEggs(lv.eggs.gold, EGG_GOLD_ID)
      this.addEggs(lv.eggs.black, EGG_BLACK_ID)
      // don't include black eggs
      this.eggs = Level.mustEatEggCount(this.lv)
    }
  }

  create () {
    const lo = this._layout(this.scale.gameSize)
    this.scale.setGameSize(lo.width, lo.height)

    this.cameras.main.fadeIn(500, 0, 0, 0)
    // setup score and level headers
    this.scoreTxt = mkText(this, lo.scoreTxtX, lo.scoreTxtY, 'Score: 0', HEADER_TEXT_STYLE).setOrigin(lo.scoreTxtOX, lo.scoreTxtOY)
    this.levelTxt = mkText(this, lo.levelTxtX, lo.levelTxtY, 'Level: 1', HEADER_TEXT_STYLE).setOrigin(lo.levelTxtOX, lo.levelTxtOY)

    // setup lives display
    this.livesImg = []
    for (let i = 0; i < 3; i++) {
      const img = this.add.image(lo.livesX + i * TILE_WIDTH, lo.livesY, 'sprites', LIFE_ID).setOrigin(lo.livesOX, lo.livesOY)
      this.livesImg.push(img)
    }
    // setup energy bar
    this.energyBar = this.add.rectangle(
      lo.energyBarX, lo.energyBarY,
      lo.energyBarWidth, lo.energyBarHeight,
      0x6666ff, 1
    )
    this.energyBar.setOrigin(lo.energyBarOX, lo.eneryBarOY)
    this.energyBarOutline = this.add.rectangle(
      lo.energyBarX, lo.energyBarY,
      lo.energyBarWidth, lo.energyBarHeight,
      0x6666ff, 0
    )
    this.energyBarOutline.setOrigin(lo.energyBarOX, lo.eneryBarOY)
    this.energyBarOutline.setStrokeStyle(2, 0xefc53f)

    this.controller = new Keypad(this, this.lo.kpadX, this.lo.kpadY, this.lo.kpadSide, this.lo.kpadSide)

    this.map = this.make.tilemap({
      tileWidth: TILE_WIDTH,
      tileHeight: TILE_HEIGHT,
      width: lo.mazeCols,
      height: lo.mazeRows
    })
    const tileset = this.map.addTilesetImage('tiles', null, TILE_WIDTH, TILE_HEIGHT, 1, 2)
    this.bgLayer = this.map.createBlankLayer('background', tileset, this.lo.mazeX, this.lo.mazeY)
    this.mazeLayer = this.map.createBlankLayer('maze', tileset, this.lo.mazeX, this.lo.mazeY)
    this.fgLayer = this.map.createBlankLayer('foreground', tileset, this.lo.mazeX, this.lo.mazeY)
    this._setupLevel()
    if (DEBUG_FPS) {
      this.fps = mkText(this, 0, this.lo.height, '0', { fontSize: 50 })
      this.fps.setOrigin(0, 1)
    }
  }

  /**
     * moves to next level
     */
  _nextLevel () {
    if (Level.isLast(this.level)) {
      textWon(this)
      this.running = false
    } else {
      this.level++
      this._setupLevel()
    }
  }

  levelCompleted () {
    const elapsedSec = Math.floor((new Date() - this.levelStartTime) / 1000)
    const timeBonus = Math.max(Level.mustEatEggCount(this.lv) * 8 - elapsedSec, 0) * 10
    const energyBonus = Math.floor(this.energy * 1000)
    this.music.destroy()
    this.sound.play('success_sound')
    this.running = false
    const mazeCenterX = (this.lo.mazeX + this.lo.mazeWidth) / 2
    const mazeCenterY = (this.lo.mazeY + this.lo.mazeHeight) / 2
    const t0 = mkText(this, mazeCenterX, mazeCenterY, 'Level Completed', { fontFamily: 'Arial Black', fontSize: 80 }).setAlpha(0).setOrigin(0.5, 0)
    const tw0 = this.tweens.add({ targets: t0, alpha: { from: 0, to: 1 }, ease: 'Linear', duration: 500, repeat: 0 })
    const scene = this
    const maxV = Math.max(timeBonus, energyBonus)
    const h1 = function (tw, tgts) {
      const t1 = mkText(this, mazeCenterX, t0.y + t0.height + 10, 'Time Bonus: 0', { fontFamily: 'Arial Black', fontSize: 50, color: '#00FF00' }).setOrigin(0.5, 0)
      const t2 = mkText(this, mazeCenterX, t1.y + t1.height + 10, 'Energy Bonus: 0', { fontFamily: 'Arial Black', fontSize: 50, color: '#00FFFF' }).setOrigin(0.5, 0)
      let v = 0
      scene.time.addEvent({
        delay: 10,
        callback: function () {
          if (v === -1) {
            return
          }
          t1.text = 'Time Bonus: ' + Math.min(v, timeBonus)
          t2.text = 'Energy Bonus: ' + Math.min(v, energyBonus)
          v += 10
          if (v >= timeBonus && v >= energyBonus) {
            v = -1
            console.log('tw1 completed')
            scene.time.delayedCall(3000, function () {
              t0.destroy()
              t1.destroy()
              t2.destroy()
              scene.score += timeBonus + energyBonus
              this.scoreTxt.setText('Score: ' + this.score)
              scene._nextLevel()
            }, [], scene)
          }
        },
        repeat: maxV / 10
      })
    }
    tw0.on('complete', h1, this)
  }

  update (time, delta) {
    if (DEBUG_FPS) {
      this.fps.setText(Math.round(this.game.loop.actualFps) + 'FPS')
    }
    if (!this.running) {
      return
    }
    if (this.eggs === 0) {
      if (this.eggsToAdd.length === 0) {
        this.resetEffect()
        this.updateEnergyBar()
        this.levelCompleted()
        return
      } else {
        this.addEggDelay -= delta
        if (this.addEggDelay <= 0) {
          this.addEggDelay = this.lv.dyn_delay
          for (let i = 0; this.eggsToAdd.length > 0 && i < this.lv.dyn_eggs; i++) {
            const t = this.eggsToAdd.pop()
            this.addEggs(1, t)
            this.eggs++
          }
        }
      }
    }
    if (this.controller) {
      const d = this.controller.getDir()
      if (d[0] !== 0 || d[1] !== 0) {
        this.snake.setDir(d)
      }
    }

    this.elapsed += delta
    if (this.elapsed < 1000 / this.snakeSpeed) {
      return
    }
    this.elapsed = 0
    if (this.effectLeft > 0) {
      this.effectLeft--
      if (this.effectLeft === 0) {
        this.resetEffect()
      } else {
        if (this.effectType === EGG_BLACK_ID) {
          const xy = this.snake.getXY()
          this.light.x = xy[0]
          this.light.y = xy[1]
        }
      }
    }
    this.energy -= this.burnRate
    if (this.energy < 0.0) {
      this.energy = 0.0
    }
    this.updateEnergyBar()
    if ((!this.snake.update()) | this.energy === 0.0) {
      this.die()
    }
  }

  /**
     * updates the energy bar display
     */
  updateEnergyBar () {
    this.energyBar.fillColor = colorMix(0x0000FF, 0xFF4040, this.energy)
    this.energyBar.height = this.lo.energyBarHeight * this.energy
    this.energyBar.setOrigin(0, 1)
  }

  /**
     * handles death of the snake
     */
  die () {
    this.lives--
    this.music.destroy()
    this.sound.play('death_sound')
    this.music = null
    if (this.lives === 0) {
      textGameOver(this)
      this.time.delayedCall(3000, switchToScene, [this, 'intro'])
    } else {
      this.time.delayedCall(3000, this._setupLevel, [], this)
    }
    this.running = false
  }

  /**
   * @param { number } type
   * @param { number } r
   * @param { number } c
   */
  putTileAt (type, x, y) {
    return this.map.putTileAt(type, x, y, true, this.mazeLayer)
  }

  /**
   * @param { number } type
   * @param { number } r
   * @param { number } c
   */
  putBackgroundTileAt (type, x, y) {
    return this.map.putTileAt(type, x, y, true, this.bgLayer)
  }

  putForegroundTileAt (type, x, y) {
    return this.map.putTileAt(type, x, y, true, this.fgLayer)
  }

  /**
   * @param { number } r
   * @param { number } c
   * @return { number }
   */
  getTileAt (x, y) {
    return this.map.getTileAt(x, y, true, this.mazeLayer).index
  }

  getBackgroundTileAt (x, y) {
    return this.map.getTileAt(x, y, true, this.bgLayer).index
  }

  /**
    * Add a number of eggs of a given type to the screen,
    * avoiding collision with walls, snake or other eggs.
    * @param { number } number number of eggs to add
    * @param { number } type the tile type of the eggs
    */
  addEggs (cnt, type) {
    for (let i = 0; i < cnt; i++) {
      let r
      let c
      do {
        r = Phaser.Math.Between(1, this.lo.mazeRows - 2)
        c = Phaser.Math.Between(1, this.lo.mazeCols - 2)
      } while (this.getTileAt(c, r) !== EMPTY_ID)
      this.putTileAt(type, c, r)
    }
  }

  /**
    * Add holes avoiding collision with other objects
    * @param { number } number number of holes to add
    */
  addHoles (cnt) {
    if (!cnt) {
      return
    }
    this.holes = []
    for (let i = 0; i < cnt; i += 2) {
      let r0, c0, r1, c1
      do {
        r0 = 1 + Phaser.Math.Between(1, this.lo.hIsles - 2) * (this.lo.bushRows + 1)
        c0 = 1 + Phaser.Math.Between(1, this.lo.vIsles - 2) * (this.lo.bushCols + 1)
      } while (this.getTileAt(c0, r0) !== EMPTY_ID || this.getBackgroundTileAt(c0, r0) === HOLE_BACKGROUND)
      const v0 = { r: r0, c: c0 }
      this.holes.push(v0)
      this.putBackgroundTileAt(HOLE_BACKGROUND, c0, r0)
      this.putForegroundTileAt(HOLE_FOREGROUND_START + i, c0, r0)
      do {
        r1 = 1 + Phaser.Math.Between(1, this.lo.hIsles - 2) * (this.lo.bushRows + 1)
        c1 = 1 + Phaser.Math.Between(1, this.lo.vIsles - 2) * (this.lo.bushCols + 1)
      } while (this.getTileAt(c1, r1) !== EMPTY_ID || this.getBackgroundTileAt(c1, r1) === HOLE_BACKGROUND ||
              (r0 === r1 && Math.abs(c1 - c0) === this.lo.bushCols + 1) || (c0 === c1 && Math.abs(r1 - r0) === this.lo.bushRows + 1))
      const v1 = { r: r1, c: c1 }
      this.holes.push(v1)
      this.putBackgroundTileAt(HOLE_BACKGROUND, c1, r1)
      this.putForegroundTileAt(HOLE_FOREGROUND_START + i, c1, r1)
      v0.other = v1
      v1.other = v0
    }
    const len = this.holes.length
    this.holes[len - 2].other = this.holes[len - 1]
    this.holes[len - 1].other = this.holes[len - 2]
  }

  resetEffect () {
    this.snakeSpeed = DEFAULT_SNAKE_SPEED_TILES_PER_SEC
    if (this.light) {
      this.lights.removeLight(this.light)
      this.light = null
    }
    this.mazeLayer.resetPipeline()
    this.bgLayer.resetPipeline()
    this.effectType = null
    this.effectLeft = 0
    this.snakeSpeed = DEFAULT_SNAKE_SPEED_TILES_PER_SEC
    this.cameras.main.shakeEffect.reset()
  }

  /**
     * update score and energy for an egg eaten of a specified value
     * @param {number alue} value of the egg eaten
     */
  eatEgg (type, value, energy) {
    const xy = this.snake.getXY()
    switch (type) {
      case EGG_GOLD_ID:
        this.resetEffect()
        this.effectType = EGG_GOLD_ID
        this.effectLeft = 100
        this.snakeSpeed = 3 * DEFAULT_SNAKE_SPEED_TILES_PER_SEC
        this.cameras.main.shake(10000, 0.001)
        break
      case EGG_BLACK_ID:
        this.resetEffect()
        this.effectType = EGG_BLACK_ID
        this.mazeLayer.setPipeline('Light2D')
        this.bgLayer.setPipeline('Light2D')
        this.light = this.lights.addLight(xy[0], xy[1], 200).setScrollFactor(0.0).setIntensity(2)
        this.lights.enable().setAmbientColor(0)
        this.effectLeft = 100
        break
    }
    if (type !== EGG_BLACK_ID) {
      this.eggs--
      this.sound.play('chomp_sound')
    } else {
      this.sound.play('bleah_sound')
    }
    this.energy += energy
    if (this.energy > 1.0) {
      this.energy = 1.0
    }
    this.score += Math.floor(value)
    this.score += Math.floor(value)
    this.scoreTxt.setText('Score: ' + this.score)
  }
}
