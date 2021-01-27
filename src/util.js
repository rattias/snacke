import Phaser from './lib/phaser.js'

export function randomize (arr) {
  for (let i = 0; i < arr.length; i++) {
    const j = Math.floor(Math.random() * i)
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

export function colorMix (c1, c2, f) {
  const mix = function (c1, c2, b, f) {
    const shf = 8 * b
    let v = Math.floor(((c1 >> shf) & 0xFF) * f + ((c2 >> shf) & 0xFF) * (1 - f))
    if (v < 0) v = 0; else if (v > 0xFF) v = 0xFF
    return v
  }

  const r = mix(c1, c2, 2, f)
  const g = mix(c1, c2, 1, f)
  const b = mix(c1, c2, 0, f)
  return (r << 16) | (g << 8) | b
}

export function isMobile (scene) {
  return scene.sys.game.device.os.android ||
    scene.sys.game.device.os.iOS ||
    scene.sys.game.device.os.iPad ||
    scene.sys.game.device.os.iPhone
}

export function energyFromValue (value) {
  return value / 1000
}

export function onTouchOrKeyOnce (scene, handler) {
  if (isMobile(scene)) {
    function mobileWrapper (pointer) {
      handler()
      scene.input.off('pointerdown', mobileWrapper)
    }
    scene.input.on('pointerdown', mobileWrapper)
  } else {
    function desktopWrapper (evemt) {
      handler()
      scene.input.keyboard.off('keydown', desktopWrapper)
    }
    scene.input.keyboard.on('keydown', desktopWrapper)
  }
}

export function switchToScene (currScene, nextSceneName) {
  currScene.cameras.main.fadeOut(500, 0, 0, 0)
  currScene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
    currScene.scene.start(nextSceneName)
  })
}

export function buttonize (obj, onClick, color, bgColor, overColor, overBgColor) {
  obj.setInteractive({ useHandCursor: true })
  obj.on(Phaser.Input.Events.POINTER_OVER, function () {
    obj.setStyle({ color: overColor, backgroundColor: overBgColor })
  }, this)
  obj.on(Phaser.Input.Events.POINTER_OUT, function () {
    obj.setStyle({ color: color, backgroundColor: bgColor })
  }, this)
  obj.on(Phaser.Input.Events.POINTER_UP, onClick, this)
}

export function linkify (obj, url, color, bgColor, overColor, overBgColor) {
  buttonize(obj, function () { navigate(url) }, color, bgColor, overColor, overBgColor)
}

export function navigate (url) {
  console.log('navigating to ' + url)
  const s = window.open(url, '_blank')
  if (s && s.focus) {
    s.focus()
  } else if (!s) {
    window.location.href = url
  }
}
