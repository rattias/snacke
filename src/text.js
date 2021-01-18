import {EGG_BROWN_TILE, EGG_WHITE_TILE, EGG_BLUE_TILE, EGG_GOLD_TILE, EGG_BLACK_TILE} from './constants.js'
import {EGG_BROWN_VALUE, EGG_WHITE_VALUE, EGG_BLUE_VALUE, EGG_GOLD_VALUE} from './constants.js'
import {EGG_BROWN_LEN_INC, EGG_WHITE_LEN_INC, EGG_BLUE_LEN_INC, EGG_GOLD_LEN_INC} from './constants.js'
import {TILEMAP_Y, SCREEN_WIDTH, TILEMAP_HEIGHT } from './constants.js'
import {isMobile, energyFromValue} from "./util.js"

const GAME_OVER_FS = 80
const GAME_OVER_TEXT_STYLE = {fontFamily: "Arial Black", fontSize: GAME_OVER_FS, color: '#3030FF', stroke: '#FFFFFF', strokeThickness: 3}
const RELOAD_TEXT_STYLE =  {fontFamily: "Arial Black", fontSize: GAME_OVER_FS/2, color: '#3030FF'}
const DESC_TEXT_STYLE = {fontFamily: "Arial Black", fontSize: GAME_OVER_FS/2, color: '#903030', wordWrap: { width : SCREEN_WIDTH-60}}

function tweenConfig(target) {
    return {
        targets: target,
        alpha: {from: 0, to: 1 }, 
        scale: {from: 0, to: 1},
        ease: 'Linear',
        duration: 1000,
        repeat: 0,
        yoyo: false}
}


export function mkText(scene, x, y, text, config){
    var res = scene.add.text(x, y, text, config);
    res.setOrigin(0, .1)
    return res
}

export function textSnake(scene) {
    var txt = mkText(scene, scene.cameras.main.centerX, 100, "SNAKE", GAME_OVER_TEXT_STYLE);
    txt.setOrigin(0.5);
    return txt
}

export function textDescription(scene) {
    var txt = mkText(scene, scene.cameras.main.centerX, 100 + GAME_OVER_FS+30, 
        "You're a snake who grows as it eats eggs. Make sure not to bite yourself, or you'll die!\n\n" +
        "Your health decreases as time goes by, but increases when eating eggs. Keep an eye on the health bar on the right!\n\n" +
        "Different eggs colors have different characteristics:", DESC_TEXT_STYLE);
    txt.setAlpha(0.0)
//    txt.setAlign('justify')
    txt.setOrigin(0.5, 0);
    return txt
}

export function textEgg(scene, y, egg) {
    var value, len, energy

    switch(egg) {
        case EGG_BROWN_TILE: value = EGG_BROWN_VALUE; len = EGG_BROWN_LEN_INC; break;
        case EGG_WHITE_TILE: value = EGG_WHITE_VALUE; len = EGG_WHITE_LEN_INC; break;
        case EGG_BLUE_TILE: value = EGG_BLUE_VALUE; len = EGG_BLUE_LEN_INC; break;
        case EGG_GOLD_TILE: value = EGG_GOLD_VALUE, len = EGG_GOLD_LEN_INC; break;
    }
    var energy = energyFromValue(value)
    var txt
    if (egg != EGG_BLACK_TILE) {
        txt = mkText(scene, 0, y, "   value: " + value+"; growth: "+len+"; energy: "+(energy*100)+"%", DESC_TEXT_STYLE);
    } else {
        txt = mkText(scene, 0, y, "   don't eat the rotten egg!", DESC_TEXT_STYLE)
    }
    txt.setOrigin(0, .5);
    txt.setAlpha(0)
    return txt
}

export function textFullscreen(scene) {
    var txt = mkText(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 
        isMobile(scene) ? "touch to enter\nfull screen" : "Press a key to\nenter fullscreen", RELOAD_TEXT_STYLE);
    txt.setAlpha(0.0)
    txt.setOrigin(0.5);
    scene.tweens.add(tweenConfig(txt))
    return txt
}

export function textPressAnyKeyToStart(scene) {
    var txt = mkText(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 
        isMobile(scene) ? "touch to start" : "Press any key to start", RELOAD_TEXT_STYLE);
    txt.setOrigin(0.5);
    txt.setAlpha(0.0)
    return txt
}

export function textWon(scene) {
    var txt = mkText(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, "Game Completed\nCongratulations!", GAME_OVER_TEXT_STYLE);
    txt.setAlpha(0.0)
    txt.setOrigin(0.5);
    scene.tweens.add(tweenConfig(txt))
    return txt
}

export function textGameOver(scene) {
    var gameOver = mkText(scene, SCREEN_WIDTH/2, (TILEMAP_Y + TILEMAP_HEIGHT) / 2, "Game Over", GAME_OVER_TEXT_STYLE);
    gameOver.setAlpha(0.0)
    gameOver.setOrigin(0.5);
    var reload = mkText(scene, scene.cameras.main.centerX, scene.cameras.main.centerY + GAME_OVER_FS, "Reload to play again", RELOAD_TEXT_STYLE);
    reload.setAlpha(0.0)
    reload.setOrigin(0.5);
    scene.tweens.add(tweenConfig(gameOver))
    scene.tweens.add(tweenConfig(reload))
    return [gameOver, reload]
}