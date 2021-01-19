export function randomize(arr) {
    for(let i = 0; i < arr.length; i++){
        const j = Math.floor(Math.random() * i)
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
    return arr
}

export function colorMix(c1, c2, f) {
    var mix = function(c1, c2, b, f) {
        var shf = 8 * b
        var v = Math.floor(((c1 >> shf) & 0xFF) * f + ((c2 >> shf) & 0xFF) * (1-f))
        if(v < 0) v = 0; else if(v > 0xFF) v = 0xFF
        return v
    }
    
    var r = mix(c1, c2, 2, f)
    var g = mix(c1, c2, 1, f)
    var b = mix(c1, c2, 0, f)   
    return (r << 16) | (g << 8) | b
}

export function isMobile(scene) {
    return scene.sys.game.device.os.android 
        || scene.sys.game.device.os.iOS 
        || scene.sys.game.device.os.iPad
        || scene.sys.game.device.os.iPhone
/*      scene.sys.game.device.os.linux        // Is running on linux?
        scene.sys.game.device.os.macOS        // Is running on macOS?
        scene.sys.game.device.os.node         // Is the game running under Node.js?
        scene.sys.game.device.os.nodeWebkit   // Is the game running under Node-/Webkit?
        scene.sys.game.device.os.webApp       // Set to true if running as a WebApp, i.e. within a WebView
        scene.sys.game.device.os.windows      // Is running on windows?
        scene.sys.game.device.os.windowsPhone // Is running on a Windows Phone?
*/
}

export function energyFromValue(value) {
    return value / 1000
}

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

