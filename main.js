var lifeEl = byId('life')
var scrapEl = byId('scrap')
var buildingCageEl = byId('buildingCage')
var pressAnyKeyEl = byId('pressAnyKey')
var levelMsgEl = byId('levelMsg')
var boardHeaderEl = byId('boardHeader')
var boardEl = byId('board')
var scrapCountEl = byId('scrapCount')
var introEl = byId('intro')
var statsEl = byId('stats')
var tinfoilHatEnergyEl = byId('tinfoilHatEnergy')

var canvas = document.createElement('canvas');
canvas.id = 'canvas';
document.body.appendChild(canvas);

var vw
var vh
var setCanvasSize = function() {
  vw = Math.min(window.innerWidth, 640)
  vh = Math.min(window.innerHeight, 480)
  canvas.width = vw
  canvas.height = vh
}
setCanvasSize()
window.onresize = function(event) {
  setCanvasSize()
}

var CAMERA

var ctx = canvas.getContext('2d', { alpha: false })

var TYPES = THINGS_PAINT_ORDER.reverse()
var TIME_FACTOR
var WasCloseToBuildCage = null
function update (dt) {
  if (WORLD.count === 0) {
    lifeEl.innerHTML = player.life
    levelMsgEl.style.display = 'block'
    levelMsgEl.innerHTML = 'Level ' + LEVEL
    aa.play('newLevel')
    
    window.setTimeout(function() {
      levelMsgEl.style.display = 'none'
    }, 1500)
  }
  // TODO: using dt cause collision handling errors. Fix it
  TIME_FACTOR = 0.01 * 1//dt/(1/60)
  var thingsOfType
    , things
    , thing
    , collisions
    , detail;

  if (WORLD.scrapCount !== scrapCountPrev) {
    scrapCountEl.innerHTML = WORLD.scrapCount
    scrapCountPrev = WORLD.scrapCount
  }

  if (!WORLD.lost) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000000'
    ctx.fill()
    ctx.closePath()
  }

  if (WORLD.recoredInput) {
    CAMERA = {
      xoffset: player.w/2+player.x-vw/2,
      yoffset: player.h/2+player.y-vh/2
    }
    if (WORLD.recoredInput[WORLD.count]) {
      INPUT = WORLD.recoredInput[WORLD.count]
    } else {
      WORLD.test()
    }
  } else {

    CAMERA = 
      {xoffset: ~~((CAMERA.xoffset*0.8) + (player.w/2+player.x-vw+INPUT.mousex)*0.2)
      ,yoffset: ~~((CAMERA.yoffset*0.8) + (player.h/2+player.y-vh+INPUT.mousey)*0.2)
    }    
  }

  // input record
  if (RECORD_INPUT) {
    RECORDED_INPUT.push(cloneInput())
  }

  // Iterate object types
  for (var i = TYPES.length - 1; i >= 0; i--) {
    thingsOfType = WORLD.things[TYPES[i]]
    // Iterate things of certain type    
    for (var j = thingsOfType.length - 1; j >= 0; j--) {
      thing = thingsOfType[j]
      if (thing._toRecycle) continue

      var spriteControl
      if (
          ((thing.x+thing.w) > CAMERA.xoffset) &&
          ((thing.x) < CAMERA.xoffset+vw) &&
          
          ((thing.y+thing.h) > CAMERA.yoffset) &&
          ((thing.y) < CAMERA.yoffset+vh) && 
          thing.sprites
      ) {
        var spriteSet = null
        if (thing.movex || thing.movey) {
          spriteSet = thing.toSide === -1 ? 'moveLeft' : 'moveRight'
          spriteControl = 'move'
        } else {
          if (thing.spriteSet !== '') { // forced sprite set
            spriteSet = thing.spriteSet
          } else if (thing.toSide) { // moving sprite set
            spriteSet = thing.toSide === -1 ? 'idleLeft' : 'idleRight'
          } else {
            spriteSet = 'idle'
          }
          spriteControl = 'idle'
        }
        var toPaint
        if (spriteSet) {
          var spriteIndex = thing[spriteControl].spriteI
          toPaint = thing.sprites[spriteSet][spriteIndex]
          if (!(thing[spriteControl].timeline % thing[spriteControl].spriteCicle)) {
            if (thing[spriteControl].spriteI < thing.sprites[spriteSet].length-1) {
              thing[spriteControl].spriteI++
            } else {
              thing[spriteControl].spriteI = 0
            }
          }

          ctx.drawImage(toPaint, ~~(thing.x-CAMERA.xoffset), ~~(thing.y-CAMERA.yoffset))
          thing[spriteControl].timeline++
        }
        
      } else {
        if (
            ((thing.x+thing.w) > CAMERA.xoffset) &&
            ((thing.x) < CAMERA.xoffset+vw) &&
            
            ((thing.y+thing.h) > CAMERA.yoffset) &&
            ((thing.y) < CAMERA.yoffset+vh)
        ) {
          
          ctx.beginPath()
          ctx.rect(~~(thing.x-CAMERA.xoffset), ~~(thing.y-CAMERA.yoffset), ~~thing.w, ~~thing.h)
          ctx.fillStyle = thing.color || '#00ff00'
          ctx.fill()
          ctx.closePath()
        }
      }

      if (WORLD.lost) continue

      // store prev position, useful for
      // collision handling and other stuff
      thing._prevx = thing.x
      thing._prevy = thing.y

      if (TYPES[i] === 'explosions') {
        if (thing.idle.timeline === 40) {
          thing._toRecycle = true
        }
      }

      if (TYPES[i] === 'playerBullets' || TYPES[i] === 'enemyBullets') {
        if (
          (thing.x > WORLD.w) ||
          ((thing.x + thing.w) < 0) ||
          (thing.y > WORLD.h) ||
          ((thing.y + thing.h) < 0)
        ) {
          thing._toRecycle = true
          continue
        }

        collisions = checkCollision(thing, WORLD.things.walls, undefined, true)
        handleBulletWallColl(collisions)

        if (TYPES[i] === 'playerBullets') {
          collisions = checkCollision(thing, WORLD.things.enemies)
          handleBulletThingColl(collisions)
        }

        if (TYPES[i] === 'enemyBullets') {
          collisions = checkCollision(thing, WORLD.things.players)
          handleBulletThingColl(collisions)
        }
      }

      // objects with property `movex` or `movey` have 
      // position increased by speed
      if (thing.movex) {thing.x += thing.movex * TIME_FACTOR * thing.speed}
      if (thing.movey) {thing.y += thing.movey * TIME_FACTOR * thing.speed}

      if (thing.ai) {thing.ai()}
      
      if (TYPES[i] === 'enemies' || TYPES[i] === 'players') {
        collisions = checkCollision(thing, WORLD.things.walls.concat(WORLD.things.antennas))
        handlePlayerColl(collisions)
        tinfoilHatEnergyEl.innerHTML = ~~WORLD.energy
      }
      if (TYPES[i] === 'enemies' && !WORLD.cagesToBuild) {
        thing.explode()
        //thing._toRecycle = true
        //thing.followers[0]._toRecycle = true
      }

      if (TYPES[i] === 'players') {
        handleInput(player)
        collisions = checkCollision(thing, WORLD.things.scraps)
        handlePlayerScrapColl(collisions)
      }

      if (TYPES[i] === 'antennas') {
        if (!thing.caged) {
          let xd = thing.x - player.x + 15
          let yd = thing.y - player.y

          let sumRadius = thing.w/2 + player.w/2
          let sqrRadius = sumRadius * sumRadius

          let distSqr = (xd * xd) + (yd * yd)
          if (WORLD.energy < 100) {
            WORLD.energy += (1/distSqr)*200
          }
          //WORLD.energy += distSqr
          // TODO: Capture energy from antenna signal
          var isClose = (distSqr <= sqrRadius*1.5)

          if (isClose) {
            thing.closeToBuildCage = true
            // Dont have scraps to build
            if (WORLD.scrapCount < scrapsToBuildCage) {
              //...
            } else {
              if (!thing.buildingCage) {
                thing.buildingCage = true
              }
              // Increment building count if stay near antenna
              thing.buildingCagePct += 1
              buildingCageEl.innerHTML = ~~((thing.buildingCagePct/buildingCagePctTarget)*100)
              if (thing.buildingCagePct >= buildingCagePctTarget) {
                // build complete
                thing.buildingCagePct = 0
                WORLD.cagesToBuild--
                thing.caged = true
                aa.play( 'caged' )
                thing.closeToBuildCage = false
                thing.spriteSet = 'caged'
                BOARD.cage += 1
                WORLD.scrapCount -= scrapsToBuildCage
              }
            }
            
          } else {
            thing.closeToBuildCage = false
            // Reset building if you leave near antenna
            if (thing.buildingCage) {
              thing.buildingCage = false
              thing.buildingCagePct = 0
            }
          }
        }
      }

      if (thing.followers) {
        for (var fi = thing.followers.length - 1; fi >= 0; fi--) {
          thing.followers[fi].x += thing.x-thing._prevx
          thing.followers[fi].y += thing.y-thing._prevy
        }
      }
    }
  }
  if (WORLD.lost) return

  var closeToBuildCage = false
  for (var _i = WORLD.things.antennas.length - 1; _i >= 0; _i--) {
    closeToBuildCage = closeToBuildCage || WORLD.things.antennas[_i].closeToBuildCage
  }

  if (WasCloseToBuildCage !== closeToBuildCage) {
    
    if (closeToBuildCage && WORLD.scrapCount < scrapsToBuildCage) {
      buildingCageEl.innerHTML = 'You need 10 scraps to build a cage'
      aa.play( 'unable' )
    }

    if (!closeToBuildCage) {
      buildingCageEl.innerHTML = ''
    }

  }

  WasCloseToBuildCage = closeToBuildCage


  if (WORLD.cagesToBuild === 0) {
    WORLD.cagesToBuild = null
    levelMsgEl.style.display = 'block'
    levelMsgEl.innerHTML = 'Level Disrupted!'
    pressAnyKeyEl.style.display = 'none'
    window.setTimeout(function() {
      levelMsgEl.style.display = 'none'
      window.setTimeout(function() {
        boardHeaderEl.style.display = 'block'
        boardHeaderEl.innerHTML = ''
        boardEl.style.display = 'block'
        fillBoard()
        window.setTimeout(function() {
          acceptKeyForNewGame = true
          pressAnyKeyEl.innerHTML = 'PRESS ANY KEY TO NEXT LEVEL'
          pressAnyKeyEl.style.display = 'block'
        }, 2000)
      }, 2000)
    }, 2000)
  }

  var noEnemies = (WORLD.enemyCount <= 0 && !((WORLD.count+1) % 30))
  if (!!WORLD.cagesToBuild && (noEnemies || !((WORLD.count+1) % 100) && (WORLD.enemyCount < WORLD.maxEnemies))) {
    // generate enemies
    var pathToBornI = randomMinMax(0, WORLD.enemySpawnArea.length-1)
    var pathToBorn = WORLD.enemySpawnArea[pathToBornI]
    // they are born not to close to player
    var safeDist = Math.abs(pathToBorn.x - WORLD.things.players[0].x) > ORT_BORN_DIST || 
      Math.abs(pathToBorn.x - WORLD.things.players[0].x) > ORT_BORN_DIST
    ;
    if (safeDist) {

      var newEnemy = Drone()
      WORLD.enemyCount += 1

      newEnemy.x = pathToBorn.x
      newEnemy.y = pathToBorn.y

      var SHADOW = entityFactory({
          idle: [ShadowSprite3]
        },
        recycle(WORLD.things.shadows)
      )
      SHADOW.x = newEnemy.x+2
      SHADOW.y = newEnemy.y+30
      newEnemy.followers.push(SHADOW)
    }
  }
  WORLD.count += 1
}
