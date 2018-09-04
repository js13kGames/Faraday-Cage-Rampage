//document.getElementById('hermitPlace').appendChild(PLAYER1.sprites.idleLeft[0])
var INPUT = {
  moveLeft: null,
  moveRight: null,
  moveUp: null,
  moveDown: null,
  fireLeft: null,
  fireRight: null,
  fireUp: null,
  fireDown: null,
  mousex: null,
  mousey: null,
  mouseDownCount: 0,
  mouseDown: [0, 0, 0, 0, 0, 0, 0, 0, 0]
};

var acceptKeyForNewGame = true
var startNewLevel = function() {
  acceptKeyForNewGame = false
  if (!WORLD) {
    start(update)
  }
  newLevel()
  
  CAMERA = {
    xoffset: player.w/2+player.x-vw+INPUT.mousex,
    yoffset: player.h/2+player.y-vh+INPUT.mousey  
  }

  WORLD.lost = false

  document.getElementById('board').style.display = 'none'
  introEl.style.display = 'none'
  
  statsEl.style.display = 'flex'
  

  INPUT.moveLeft = null
  INPUT.moveRight = null
  INPUT.moveUp = null
  INPUT.moveDown = null
  INPUT.fireLeft = null
  INPUT.fireRight = null
  INPUT.fireUp = null
  INPUT.fireDown = null
  INPUT.mouseDownCount = 0
  INPUT.mouseDown = [0, 0, 0, 0, 0, 0, 0, 0, 0]
}

document.onkeydown = function (event) {
  if (acceptKeyForNewGame) {
    startNewLevel()
  }


  if (event.keyCode === 27 && RECORD_INPUT) {stopRecordFn()} // esc

  if (event.keyCode === 65) {INPUT.moveLeft = true}
  if (event.keyCode === 68) {INPUT.moveRight = true}
  if (event.keyCode === 87) {INPUT.moveUp = true}
  if (event.keyCode === 83) {INPUT.moveDown = true}

  if (event.keyCode === 37) {INPUT.fireLeft = true}
  if (event.keyCode === 39) {INPUT.fireRight = true}
  if (event.keyCode === 38) {INPUT.fireUp = true}
  if (event.keyCode === 40) {INPUT.fireDown = true}
}
document.onkeyup = function (event) {
  if (event.keyCode === 65) {INPUT.moveLeft = false}
  if (event.keyCode === 68) {INPUT.moveRight = false}
  if (event.keyCode === 87) {INPUT.moveUp = false}
  if (event.keyCode === 83) {INPUT.moveDown = false}

  if (event.keyCode === 37) {INPUT.fireLeft = false}
  if (event.keyCode === 39) {INPUT.fireRight = false}
  if (event.keyCode === 38) {INPUT.fireUp = false}
  if (event.keyCode === 40) {INPUT.fireDown = false}
}
INPUT.mousex = ~~window.innerWidth/2
INPUT.mousey = ~~window.innerHeight/2
document.onmousemove = function (event) {
  if (WORLD && WORLD.lost) return
  var canvasRect = canvas.getBoundingClientRect()
  INPUT.mousex = event.clientX-canvasRect.x
  INPUT.mousey = event.clientY-canvasRect.top
}

// taken from https://stackoverflow.com/questions/322378/javascript-check-if-mouse-button-down#322827
INPUT.mouseDown = [0, 0, 0, 0, 0, 0, 0, 0, 0]
INPUT.mouseDownCount = 0

document.onmousedown = function(event) { 
  if (acceptKeyForNewGame) {
    startNewLevel()
  }

  ++INPUT.mouseDown[event.button]
  if (INPUT.mouseDownCount === 0) ++INPUT.mouseDownCount
}

document.onmouseup = function(event) {
  if (acceptKeyForNewGame) {
    startNewLevel()
  }
  --INPUT.mouseDown[event.button]
  if (INPUT.mouseDownCount > 0) --INPUT.mouseDownCount
}

var cloneInput = function() {
  return {
    moveLeft: INPUT.moveLeft, 
    moveRight: INPUT.moveRight, 
    moveUp: INPUT.moveUp, 
    moveDown: INPUT.moveDown,
    fireLeft: INPUT.fireLeft,
    fireRight: INPUT.fireRight,
    fireUp: INPUT.fireUp,
    fireDown: INPUT.fireDown,
    mousex: INPUT.mousex,
    mousey: INPUT.mousey,
    mouseDownCount: INPUT.mouseDownCount,
    mouseDown: INPUT.mouseDown
  }
}

var handleInput = function(thing) {
  thing.movex = 0
  thing.movey = 0
  if (!INPUT.moveLeft || !INPUT.moveRight) {
    if (INPUT.moveLeft) {
      thing.movex = -1
    }
    if (INPUT.moveRight) {
      thing.movex = 1
    }
  }

  thing.toSide = thing.movex !== 0 ? thing.movex : thing.toSide

  if (!INPUT.moveUp || !INPUT.moveDown) {
    if (INPUT.moveUp) {
      thing.movey = -1
    }
    if (INPUT.moveDown) {
      thing.movey = 1
    }
  }

  if (INPUT.mouseDownCount || INPUT.fireRight || INPUT.fireLeft || INPUT.fireUp || INPUT.fireDown) {

    if (!WORLD.energy) return
    if (WORLD.count - thing.lastShoot < thing.coolDown) return

    var bulletSize = PSIZE*4
    var bullet
    // search for a recyclable bullet and recycle
    bullet = recycle(WORLD.things.playerBullets)
    bullet.x = ~~thing.x+thing.w/2-bulletSize/2
    bullet.y = ~~thing.y+thing.h/10
    bullet.w = bulletSize
    bullet.h = bulletSize
    bullet.xhit = bulletSize
    bullet.yhit = bulletSize
    bullet.speed = 800
    bullet.movex = 0
    bullet.movey = 0
    bullet.whit = bulletSize
    bullet.hhit = bulletSize
    
    if (INPUT.mouseDownCount) {
      var dx = (INPUT.mousex - (bullet.x+bullet.h/2 - CAMERA.xoffset))
      var dy = (INPUT.mousey - (bullet.y+bullet.w/2 - CAMERA.yoffset))
      var deltaP = Math.atan2(dy, dx)
      deltaP = deltaP+((randomMinMax(-5, 5))/100)

      bullet.movex = Math.cos(deltaP)
      bullet.movey = Math.sin(deltaP)

    } else {
      if (INPUT.fireRight || INPUT.fireLeft) {
        bullet.movex = INPUT.fireRight ? 1 : -1
      } else {
        bullet.movey = INPUT.fireDown ? 1 : -1
      }
    }

    bullet.color = '#C36278'
    thing.lastShoot = WORLD.count
    WORLD.energy -= 1
    if (WORLD.energy < 0) WORLD.energy = 0
    aa.play( 'laser' )
  }
}