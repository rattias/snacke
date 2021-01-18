import { isMobile } from "./util.js";

export function onTouchOrKeyOnce(scene, handler) {
    if(isMobile(scene)) {
        function mobileWrapper(pointer) {
            handler();
            scene.input.off('pointerdown', mobileWrapper)
        }
        scene.input.on('pointerdown', mobileWrapper)
    } else {
        function desktopWrapper(evemt) {
            handler();
            scene.input.keyboard.off('keydown', desktopWrapper)
        }
        scene.input.keyboard.on('keydown', desktopWrapper)
    }
}

/**
 * Encapsulates input from user. Input may be cursor key pressed, mouse
 * click-and-drag, or swipe events. intentLeft, intentRight, intentUp, 
 * intentDown indicate in what direction the user intended to move what (their
 * last key pressed/swipe was. Note that more than one can be set. For example, 
 * if the user swiped from the center of the screen towards the upper left angle,
 * intentLeft and intentUp will be both set.
 */
export default class DirInput {
    /** @type { Phaser.Scene} */
    scene

    /** @type { number } X where screen was touched/mouse was pressed */
    _pressX

    /** @type { number } X where screen was touched/mouse was pressed */
    _pressY

    /** @type { boolean } user would like to move left */
    left

    /** @type { boolean } user would like to move right */
    right

    /** @type { boolean } user would like to move up */
    up

    /** @type { boolean } user would like to move down */
    down

    resetDir() {
        this.left = this.right = this.up = this.down = false
    }

    readDir() {
        var dir = [this.down - this.up, this.right - this.left]
        this.resetDir()
        return dir
    }

    constructor(scene) {
        this.scene = scene
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.cursors.up.on('down',    function() {this.resetDir(); this.up = true},    this)
        this.cursors.down.on('down',  function() {this.resetDir(); this.down = true},  this)
        this.cursors.left.on('down',  function() {this.resetDir(); this.left = true},  this)
        this.cursors.right.on('down', function() {this.resetDir(); this.right = true}, this)

        scene.input.on('pointerdown', function (pointer) {
            this._pressX = pointer.x;
            this._pressY = pointer.y;
        }, this);   

        scene.input.on('pointerup', function (pointer) {
            var releaseX = pointer.x;
            var releaseY = pointer.y;
            var threshold = 30
            var deltaX = this._pressX - releaseX
            var deltaY = this._pressY - releaseY
            this.resetDir()
            if (Math.abs(deltaX) > Math.abs(deltaY)) 
                deltaY = 0
            else
                deltaX = 0
            if(deltaX > threshold)
                this.left = true
            else if(-deltaX > threshold)
                this.right = true
            else if(deltaY > threshold)
                this.up = true
            else if(-deltaY > threshold)
                this.down = true
        }, this);              
    }
}
