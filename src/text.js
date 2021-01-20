import {
  EGG_BROWN_ID, EGG_WHITE_ID, EGG_BLUE_ID, EGG_GOLD_ID, EGG_BLACK_ID,
  EGG_BROWN_VALUE, EGG_WHITE_VALUE, EGG_BLUE_VALUE, EGG_GOLD_VALUE,
  EGG_BROWN_LEN_INC, EGG_WHITE_LEN_INC, EGG_BLUE_LEN_INC, EGG_GOLD_LEN_INC,
  TILEMAP_Y, SCREEN_WIDTH, TILEMAP_HEIGHT
} from './constants.js'
import { isMobile, energyFromValue } from './util.js'

const GAME_OVER_FS = 80
const GAME_OVER_TEXT_STYLE = { fontFamily: 'Arial Black', fontSize: GAME_OVER_FS, color: '#FF3030', stroke: '#FFFFFF', strokeThickness: 3 }
const RELOAD_TEXT_STYLE = { fontFamily: 'Arial Black', fontSize: GAME_OVER_FS / 2, color: '#3030FF' }
const DESC_TEXT_STYLE = { fontFamily: 'Arial Black', fontSize: GAME_OVER_FS / 2, color: '#903030', wordWrap: { width: SCREEN_WIDTH - 60 } }

function tweenConfig (target) {
  return {
    targets: target,
    alpha: { from: 0, to: 1 },
    scale: { from: 0, to: 1 },
    ease: 'Linear',
    duration: 1000,
    repeat: 0,
    yoyo: false
  }
}

export function mkText (scene, x, y, text, config) {
  const res = scene.add.text(x, y, text, config)
  res.setOrigin(0, 0.1)
  return res
}

export function textSnacke (scene) {
  const txt = mkText(scene, scene.cameras.main.centerX, 100, 'SNAcKE', GAME_OVER_TEXT_STYLE)
  txt.setOrigin(0.5)
  return txt
}

export function textDescription (scene) {
  const txt = mkText(scene, scene.cameras.main.centerX, 100 + GAME_OVER_FS + 30,
    "You're a snake who grows as it snacks on eggs. Don't bite yourself, or you'll die!\n\n" +
    'Your health decreases as time passes, but increases when you eat. Keep an eye on the health bar on the right!\n\n' +
    'Different eggs have different characteristics:', DESC_TEXT_STYLE)
  txt.setAlpha(0.0)
  txt.setOrigin(0.5, 0)
  return txt
}

export function textEgg (scene, y, egg) {
  let value
  let len

  switch (egg) {
    case EGG_BROWN_ID: value = EGG_BROWN_VALUE; len = EGG_BROWN_LEN_INC; break
    case EGG_WHITE_ID: value = EGG_WHITE_VALUE; len = EGG_WHITE_LEN_INC; break
    case EGG_BLUE_ID: value = EGG_BLUE_VALUE; len = EGG_BLUE_LEN_INC; break
    case EGG_GOLD_ID: value = EGG_GOLD_VALUE; len = EGG_GOLD_LEN_INC; break
  }
  const energy = energyFromValue(value)
  let txt
  if (egg !== EGG_BLACK_ID) {
    txt = mkText(scene, 0, y, '   value: ' + value + '; growth: ' + len + '; energy: ' + (energy * 100) + '%' +
     (egg === EGG_GOLD_ID ? '; watch for the speed boost!' : ''), DESC_TEXT_STYLE)
  } else {
    txt = mkText(scene, 0, y, "   don't eat the rotten egg, you'll vision will be impaired for a while!", DESC_TEXT_STYLE)
  }
  txt.setOrigin(0, 0.5)
  txt.setAlpha(0)
  return txt
}

export function textFullscreen (scene) {
  const txt = mkText(scene, scene.cameras.main.centerX, scene.cameras.main.centerY,
    isMobile(scene) ? 'touch to enter\nfull scree' : 'Press a key to\nenter fullscreen', RELOAD_TEXT_STYLE)
  txt.setAlpha(0.0)
  txt.setOrigin(0.5)
  scene.tweens.add(tweenConfig(txt))
  return txt
}

export function textPressAnyKeyToStart (scene) {
  const txt = mkText(scene, scene.cameras.main.centerX, scene.cameras.main.centerY,
    isMobile(scene) ? 'touch to start' : 'Press any key to start', RELOAD_TEXT_STYLE)
  txt.setOrigin(0.5)
  txt.setAlpha(0.0)
  return txt
}

export function textWon (scene) {
  const txt = mkText(scene, scene.cameras.main.centerX, scene.cameras.main.centerY, 'Game Completed\nCongratulations!', GAME_OVER_TEXT_STYLE)
  txt.setAlpha(0.0)
  txt.setOrigin(0.5)
  scene.tweens.add(tweenConfig(txt))
  return txt
}

export function textGameOver (scene) {
  const gameOver = mkText(scene, SCREEN_WIDTH / 2, (TILEMAP_Y + TILEMAP_HEIGHT) / 2, 'Game Over', GAME_OVER_TEXT_STYLE)
  gameOver.setAlpha(0.0)
  gameOver.setOrigin(0.5)
  scene.tweens.add(tweenConfig(gameOver))
  return gameOver
}
