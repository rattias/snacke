import Phaser from './lib/phaser.js'
import Level from './level.js'
import Snake from './snake.js'
import {randomize, colorMix, energyFromValue, isMobile} from './util.js'
import {mkText, textFullscreen, textWon, textGameOver, textPressAnyKeyToStart} from './text.js'
import {TILE_WIDTH, TILE_HEIGHT, TILEMAP_X, TILEMAP_Y, TILEMAP_ROWS, TILEMAP_COLS, TILEMAP_HEIGHT, HEADER_ROWS, SCREEN_WIDTH, SCREEN_HEIGHT, EGG_BLACK_ID} from './constants.js'
import {LIFE_ID, EGG_BLUE_ID, EGG_BROWN_ID, EGG_WHITE_ID, EGG_GOLD_ID, EMPTY_ID, GRASS_ID} from './constants.js'
import {ENERGY_BAR_X, ENERGY_BAR_Y, ENERGY_BAR_WIDTH, ENERGY_BAR_HEIGHT} from './constants.js'
import {SNAKE_FIRST, SNAKE_LAST} from './constants.js'
import {JOYSTICK_X, JOYSTICK_Y, JOYSTICK_SIDE} from './constants.js'
import DirInput, { onTouchOrKeyOnce } from './input.js'
import Joystick from './joystick.js'
import Keypad from './keypad.js'

const HEADER_TEXT_STYLE = {fontFamily: "Arial Black", fontSize: 32, color: '#3030FF'}
const DBG_TEXT_STYLE = {fontFamily: "Arial Black", fontSize: 15, color: '#000000', stroke: '#000000', strokeThickness: 1}
const LAYER_BACKGROUND = 0
const LAYER_FOREGROUND = 1
const DEFAULT_SNAKE_SPEED_TILES_PER_SEC = 10

export default class Game extends Phaser.Scene {
    /** @type {number} current level */
    level = 0

    /** @type {number} number of snakes left (including current) */
    lives = 3

    /** @type {number} amount of energy left */
    energy

    /** @type {number} burn rate */
    burnRate = .005

    /** @type { object } number of remaining eggs */
    eggs = null

    /** @type { number } current score */
    score = 0

   /** @type { Phaser.Tilemaps.TilemapLayer } tilemap layer */
   mazeLayer

    constructor() {
        super('game')
    }

    preload() {
    //    this.load.image('platform', 'assets/Environment/ground_grass.png')
        this.load.image('tiles', 'assets/tiles.png');
        this.load.audio('music', 'assets/Audio/music.wav');
        this.load.audio('bleah_sound', 'assets/Audio/bleah.wav')
        this.load.audio('chomp_sound', 'assets/Audio/chomp.wav');
        this.load.audio('success_sound', 'assets/Audio/success.wav');
        this.load.audio('death_sound', 'assets/Audio/death.wav');
        this.load.spritesheet('sprites', 'assets/tiles.png', { frameWidth: 34, frameHeight: 34 });
        this.load.spritesheet('fullscreen', 'assets/fullscreen-white.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('redball', 'assets/redball.png')
    }

    /**
     * setup a level
     */
    _setupLevel() {
        this.resetEffect()
        this.lv = Level.getLevel(this.level)
        this.bgLayer.putTilesAt(this.lv.background, 0, 0, true)
        this.mazeLayer.putTilesAt(this.lv.tile_map, 0, 0, true)

        this.levelTxt.setText('Level: '+(this.level+1))
        this.snake = new Snake(this)
        // update lives
        for(let i=0; i<3; i++) {
            this.livesImg[i].setAlpha(i < this.lives ? 1 : 0)
        }
        this.elapsed = 0
        this.snakeSpeed = DEFAULT_SNAKE_SPEED_TILES_PER_SEC

        this.running = false
        this.music = this.sound.add("music")
        this.music.play({loop: true})
        this.initEggs()
        this.energy = 1.0
        this.updateEnergyBar()
        var txt = []
        var lvl = mkText(this, SCREEN_WIDTH/2, (TILEMAP_Y + TILEMAP_HEIGHT)/2, "Level "+(this.level+1), {fontFamily: "Arial Black", fontSize: 80})
        lvl.setOrigin(.5)
        var msg = ["3", "2", "1", "Go!"]
        var timeline = this.tweens.createTimeline();
        for(let i=0; i<msg.length; i++) {
            txt.push(mkText(this, SCREEN_WIDTH/2, (TILEMAP_Y + TILEMAP_HEIGHT)/2 + lvl.height+4, msg[i], {fontFamily: "Arial Black", fontSize: 70}))
            txt[i].alpha = 0
            txt[i].setOrigin(.5)
            timeline.add({targets: txt[i], scale:{from: 0, to: 1}, alpha:{from: 0, to: 1}, ease: 'Power1', duration: 500, repeat: 0, yoyo: true})
        }
        timeline.on('complete', function() { this.running = true; console.log("COMPLETED"), lvl.destroy()}, this)
        timeline.play()
    }

    /**
     * initializes eggs
     */
    initEggs() {
        this.eggsToAdd = []        
        if("dyn_delay" in this.lv) {
            this.addEggDelay = this.lv.dyn_delay                            
            for(let i=0; i<this.lv.eggs.brown; i++)
                this.eggsToAdd.push(EGG_BROWN_ID)
            for(let i=0; i<this.lv.eggs.white; i++)
                this.eggsToAdd.push(EGG_WHITE_ID)
            for(let i=0; i<this.lv.eggs.blue; i++)
                this.eggsToAdd.push(EGG_BLUE_ID)
            for(let i=0; i<this.lv.eggs.gold; i++)
                this.eggsToAdd.push(EGG_GOLD_ID)
            for(let i=0; i<this.lv.eggs.black; i++)
                this.eggsToAdd.push(EGG_BLACK_ID)
            randomize(this.eggsToAdd)
            this.eggs = 0
        } else {
            var lv = Level.getLevel(this.level)
            this.addEggs(lv.eggs.brown, EGG_BROWN_ID)
            this.addEggs(lv.eggs.white, EGG_WHITE_ID)
            this.addEggs(lv.eggs.blue, EGG_BLUE_ID)
            this.addEggs(lv.eggs.gold, EGG_GOLD_ID)
            this.addEggs(lv.eggs.black, EGG_BLACK_ID)
            // don't include black eggs
            this.eggs = this.lv.eggs.brown + this.lv.eggs.white + this.lv.eggs.blue + this.lv.eggs.gold
        }
    }

    create() {
        // setup score and level headers
        this.scoreTxt = mkText(this, 10, 0, "Score: 0", HEADER_TEXT_STYLE).setOrigin(0, 0)
        this.scoreTxt.y = (TILEMAP_Y - this.scoreTxt.displayHeight)/2
        this.levelTxt = mkText(this, SCREEN_WIDTH-11, 0, "Level: 1", HEADER_TEXT_STYLE).setOrigin(1, 0)
        this.levelTxt.y = this.scoreTxt.y

        // setup lives display
        this.livesImg = []
        for(let i=0; i<3; i++) {
            var img = this.add.image((14 + i) * TILE_WIDTH, TILEMAP_Y/2, 'sprites', LIFE_ID)
            img.setOrigin(.5).setScale(.8)
            this.livesImg.push(img)
        }
        // setup energy bar
        this.energyBar = this.add.rectangle(
            ENERGY_BAR_X, ENERGY_BAR_Y,
            ENERGY_BAR_WIDTH, ENERGY_BAR_HEIGHT,
            0x6666ff, 1
        )
        this.energyBar.setOrigin(0, 0)
        this.energyBarOutline = this.add.rectangle(
            ENERGY_BAR_X, ENERGY_BAR_Y,
            ENERGY_BAR_WIDTH, ENERGY_BAR_HEIGHT,
            0x6666ff, 0
        )
        this.energyBarOutline.setOrigin(0, 0)
        this.energyBarOutline.setStrokeStyle(2, 0xefc53f);
        this.dirInput = new DirInput(this)
        this.fps =  mkText(this, 0, SCREEN_HEIGHT, "0", {fontSize: 50})
        this.fps.setOrigin(0, 1)
        
        // foullscreen button
        var button = this.add.image(SCREEN_WIDTH-1, SCREEN_HEIGHT-1, 'fullscreen', 0).setOrigin(0, 0).setInteractive().setOrigin(1);
        button.on('pointerup', function () {
            if (this.scale.isFullscreen) {
                button.setFrame(0);
                this.scale.stopFullscreen();
            } else {
                button.setFrame(1);
                this.scale.startFullscreen();
            }
        }, this);

        var vArea = SCREEN_HEIGHT - (TILEMAP_Y + TILEMAP_HEIGHT)
        var kpadSide =  vArea > SCREEN_WIDTH ? SCREEN_WIDTH : vArea - 20
        this.controller = new Keypad(this, SCREEN_WIDTH/2, SCREEN_HEIGHT - 1 - vArea/2, kpadSide, kpadSide)

        this.map = this.make.tilemap({
            tileWidth: TILE_WIDTH, tileHeight: TILE_HEIGHT, 
            width: TILEMAP_COLS,  height: HEADER_ROWS + TILEMAP_ROWS
        })
        var tileset = this.map.addTilesetImage('tiles', null, TILE_WIDTH, TILE_HEIGHT, 1, 2);
        this.bgLayer = this.map.createBlankLayer('background', tileset, TILEMAP_X, TILEMAP_Y);
        this.mazeLayer = this.map.createBlankLayer("foreground", tileset, TILEMAP_X, TILEMAP_Y)
        this._setupLevel()
    }  

    /**
     * moves to next level
     */
    _nextLevel() {
        if(Level.isLast(this.level)) {
            textWon(this)
            this.running = false            
        } else {
            this.level++
            this._setupLevel()
        }
    }


    update(time, delta) { 
        this.fps.setText(Math.round(this.game.loop.actualFps)+"FPS")
        if (!this.running)
            return
        if (this.eggs == 0) {
            if (this.eggsToAdd.length == 0) {
                this.music.destroy()
                this.sound.play("success_sound")
                this.running = false            
                this.time.delayedCall(3000, this._nextLevel, [], this); 
            } else {
                this.addEggDelay -= delta
                if (this.addEggDelay <= 0) {
                    this.addEggDelay = this.lv.dyn_delay 
                    for(let i=0; this.eggsToAdd.length > 0 && i<this.lv.dyn_eggs; i++) {
                        var t = this.eggsToAdd.pop()
                        this.addEggs(1, t)
                        this.eggs++
                    }
                }    
            }
        }
        var d = this.controller.getDir()
        if (d[0] != 0 || d[1] != 0)
            this.snake.setDir(d)
        
        this.elapsed += delta
        if (this.elapsed < 1000/this.snakeSpeed)
            return
        this.elapsed = 0
        if (this.effectLeft > 0) {
            this.effectLeft--
            if (this.effectLeft === 0) {
                this.resetEffect()
            } else {
                if (this.effectType == EGG_BLACK_ID) {
                    var xy = this.snake.getXY()
                    this.light.x = xy[0]
                    this.light.y = xy[1]
                }
            }
        }
        this.energy -= this.burnRate
        if(this.energy < 0.0)
            this.energy = 0.0
        this.updateEnergyBar()
        if ((!this.snake.update()) | this.energy == 0.0) {
            this.die()
        }
        if (this.light)
            this.light
    }

    /**
     * updates the energy bar display
     */
    updateEnergyBar() {
        this.energyBar.fillColor = colorMix(0x0000FF, 0xFF4040, this.energy)
        this.energyBar.y = ENERGY_BAR_Y + ENERGY_BAR_HEIGHT * (1- this.energy)
        this.energyBar.height = ENERGY_BAR_HEIGHT * this.energy
    }

    /**
     * handles death of the snake
     */
    die() {
        this.lives--
        this.music.destroy()
        this.sound.play("death_sound")
        this.music = null
        if (this.lives === 0) {
            textGameOver(this)
        } else
            this.time.delayedCall(3000, this._setupLevel, [], this); 
        this.running = false
    }

    /** 
     * @param { number } r
     * @param { number } c
     * @return { number }
     */
    getTileAt(x, y) {
        return this.map.getTileAt(x, y).index
    }

    /**
     * 
     * @param { number } idx 
     * @param { number } r 
     * @param { number } c 
     */
    putTileAt(idx, x, y) {
        this.map.putTileAt(idx, x, y)
    }


    /** 
     * Add a number of eggs of a given type to the screen,
     * avoiding collision with walls, snake or other eggs.
     * @param { number } number number of eggs to add
     * @param { number } type the tile type of the eggs
     */
    addEggs(cnt, type){
        for(let i=0; i < cnt; i++) {
            do {
                var r = Phaser.Math.Between(1, TILEMAP_ROWS - 2)
                var c = Phaser.Math.Between(1, TILEMAP_COLS - 2)
            } while(this.getTileAt(c, r) != EMPTY_ID)
            this.putTileAt(type, c, r)
        }
    }

    resetEffect() {
        this.snakeSpeed = DEFAULT_SNAKE_SPEED_TILES_PER_SEC
        if(this.light) {
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
    eatEgg(type, value, energy) {
        switch(type) {
            case EGG_GOLD_ID:
                this.resetEffect()
                this.effectType = EGG_GOLD_ID
                this.effectLeft = 100
                this.snakeSpeed = 3 * DEFAULT_SNAKE_SPEED_TILES_PER_SEC
                this.cameras.main.shake(10000, .001)
                break
            case EGG_BLACK_ID:
                this.resetEffect()
                this.effectType = EGG_BLACK_ID
                this.mazeLayer.setPipeline("Light2D")
                this.bgLayer.setPipeline("Light2D")
                var xy = this.snake.getXY()
                this.light = this.lights.addLight(xy[0], xy[1], 200).setScrollFactor(0.0).setIntensity(2);
                this.lights.enable().setAmbientColor(0);
                this.effectLeft = 100
                break
        }
        if (type != EGG_BLACK_ID) {
            this.eggs--
            this.sound.play("chomp_sound")
        } else {
            this.sound.play("bleah_sound")
        }
        this.energy += energy
        if (this.energy > 1.0)
            this.energy = 1.0
        this.score += Math.floor(value)
        this.score += Math.floor(value)
        this.scoreTxt.setText('Score: '+this.score)
    }
}