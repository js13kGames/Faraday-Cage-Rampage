var worldFactory = function(tileScale, nxTiles, nyTiles, nWalls, nAntennas, seed) {
  var tileSize = PSIZE * tileScale
  var world = {}
  world.count = 0
  world.buildingCage = false
  world.cagesToBuild = 0
  world.lost = false
  world.invalid = false
  world.scrapCount = 0
  world.energy = 100
  world.w = tileSize*nxTiles
  world.h = tileSize*nyTiles
  world.thingsPaintOrder = THINGS_PAINT_ORDER
  world.things = {}
  
  for (var j = 0; j < POOLS.length; j++) {
    world.things[POOLS[j]] = []
    for (var _i = (POOLSize[POOLS[j]] || 100) ; _i >= 1; _i--) {

      /*
      var thing =  entityFactory()
      thing._toRecycle = true
      world.things[POOLS[j]].push(thing)
      */

      world.things[POOLS[j]].push({
        x: null,
        y: null,
        w: null,
        h: null,
        speed: null,
        movex: null,
        color: null,
        _toRecycle: true,
        xhit: 0,
        yhit: 0,
        whit: null,
        hhit: null
      })
    }
  }
  world.enemyCount = 0
  // create a buffer with a flag where a wall will exist
  // starting all true
  var wallBuff = Array.from(Array(nxTiles), function() {
    return new Array(nyTiles).fill(true)
  })

  var wallBuffNeighboursAll = function(x, y) {
    return {
      right: wallBuff[x+1] ? wallBuff[x+1][y] : undefined,
      left: wallBuff[x-1] ? wallBuff[x-1][y] : undefined,
      bottom: wallBuff[x][y+1],
      top: wallBuff[x][y-1]
    }
  }

  var wallBuffNeighbours = function(x, y) {
    return mapKeys(wallBuffNeighboursAll(x, y))
    .filter(function(item) {
      return item !== undefined
    })
  }

  var hasNeighboursPath = function(x, y) {
    return wallBuffNeighbours(x, y)
    .filter(function(item) {
      return !item
    }).length > 0
  }

  // starting player position
  var x = randomMinMax(2, nxTiles-1) - 1
  var y = randomMinMax(2, nyTiles-1) - 1
  wallBuff[x][y] = false

  PLAYER1.x = x*tileSize + 30/2
  PLAYER1.y = y*tileSize + 25/2
  PLAYER1.toSide = 1
  PLAYER1.life = 100
  PLAYER1.speed = 200
  world.things.players = [PLAYER1]
  PLAYER1.reactToBulletCollision = function() {
    this.life -= 10
    aa.play( 'damage' )
    
    byId('life').innerHTML = '' + this.life
    if (this.life <= 0) {
      WORLD.lost = true
      LEVEL = 0
      byId('pressAnyKey').style.display = 'none'
      acceptKeyForNewGame = false
      // filter currente pressed key
      window.setTimeout(function() {
        acceptKeyForNewGame = true
        byId('pressAnyKey').innerHTML = 'PRESS ANY KEY TO PLAY AGAIN'
        byId('pressAnyKey').style.display = 'block'
      }, 2000)
      byId('boardHeader').style.display = 'block'
      byId('boardHeader').innerHTML = 'You died.'

      fillBoard()
      byId('board').style.display = 'block'
      ACCSCORE = 0
    }
  }

  var SHADOW = entityFactory({
      idle: [ShadowSprite]
    },
    recycle(world.things.shadows)
  )
  SHADOW.x = PLAYER1.x
  SHADOW.y = PLAYER1.y+35
  PLAYER1.followers.push(SHADOW)

  var mv = {}
  var digCount = 0
  var hallFactor = randomMinMax(2, 5)
  // loop to "dig" the walls
  for (var _i = nWalls*1.5; _i >= 0; _i--) {
    // direction to dig, avoiding boundaries
    mv = [
      {move: 'left', p: x  === 1 ? null : random()},
      {move: 'right', p: x  === (nxTiles - 2) ? null : random()},
      {move: 'up', p: y  === 1 ? null : random()},
      {move: 'down', p: y === (nyTiles - 2) ? null : random()}
    ].filter(function(m) {
      return !!m.p
    })
    .map(function(m) {
      // if hallFactor is more close to 1, the stage looks 
      // more like a cave. As its get biggger than 1, the stage
      // looks more like a hall (corredor)


      m.p *= mv.move === m.move ? 1 : hallFactor
      return m
    })
    .map(function(m) {
      return m
      /*
      m.p *= mv.move === 'right' && m.move === 'left' ? 1 : 2
      m.p *= mv.move === 'left' && m.move === 'right' ? 1 : 2
      m.p *= mv.move === 'up' && m.move === 'down' ? 1 : 2
      m.p *= mv.move === 'down' && m.move === 'up' ? 1 : 2
      */
    })
    .sort(function(a, b) {
      return a.p - b.p
    })[0]

    if (mv.move === 'right') {++x}
    if (mv.move === 'left') {--x}
    if (mv.move === 'down') {++y}
    if (mv.move === 'up') {--y}

    if (wallBuff[x][y] !== false) {
      digCount++
    }
    // mark as dug 
    wallBuff[x][y] = false
    if (digCount/nWalls > 0.7) {
      break
    }
  }
  
  world.things.walls = []
  world.things.decorativeWalls = []
  world.things.paths = []
  var square
  for (var i = wallBuff.length - 1; i >= 0; i--) {
    for (var j = wallBuff[i].length - 1; j >= 0; j--) {
      var square = entityFactory(randomPick(TILESpritesSet))
      square.x = i*tileSize
      square.y = j*tileSize
      // change hitbox of walls, so other 
      // entities can get behind 
      square.yhit = 5
      square.hhit = square.h - square.yhit

      if (wallBuff[i][j]) {
        // have a path next to wall, 
        // push a colisable wall
        // else, a decorative wall
        if (hasNeighboursPath(i, j)) {
          world.things.walls.push(square)
        } else {
          world.things.decorativeWalls.push(square)
        }
      } else {
        square.sprites = FLOORSpritesSet[randomMinMax(0, FLOORSpritesSet.length-1)]
        world.things.paths.push(square)
      }
    }
  }

  // set neighbors paths
  world.things.paths.map(function(path) {
    path.pathNeighbors = {}
    path.pathNeighbors.diagonal = world.things.paths.filter(function(item) {
      return (Math.abs(item.x - path.x) === path.w) &&
        (Math.abs(item.y - path.y) === path.h)
      ;
    })
    path.pathNeighbors.orthogonal = world.things.paths.filter(function(item) {
      return ((Math.abs(item.x - path.x) === path.w) && item.y === path.y) ||
        ((Math.abs(item.y - path.y) === path.h) && item.x === path.x)
      ;
    })
  })

  // place antenna

  for (var _i = 0; _i < nAntennas; _i++) {
    var antennaPath = randomPick((world.things.paths.filter(function(path) {

      return path.pathNeighbors.diagonal.length === 4 &&
      path.pathNeighbors.orthogonal.length === 4 && !path.hasAntenna
    })))

    if (antennaPath) {
      antennaPath.hasAntenna = true
      var antenna = entityFactory({
          idle: [
            spriteFactory(ANTENNASpriteTemplate, ANTENNASpritePalette),
            spriteFactory(ANTENNASpriteTemplate2, ANTENNASpritePalette)
          ],
          caged: [
            spriteFactory(ANTENNASpriteCagedTemplate, ANTENNASpritePalette),
            spriteFactory(ANTENNASpriteCagedTemplate2, ANTENNASpritePalette)
          ]
        },
        recycle(world.things.antennas)
      )

      antenna.x = antennaPath.x
      antenna.y = antennaPath.y
      antenna.xhit = 5
      antenna.whit -= 10
      antenna.yhit = 10
      antenna.hhit -= 20
      antenna.type = 'antenna'
      antenna.caged = false
      antenna.buildingCagePct = 0
      world.cagesToBuild++

    } else {
      world.invalid = true
    }
    
  }


  // add shade effect to walls
  var p = world.things.paths.filter(function(path) {
    var orthogonal = path
      .pathNeighbors
      .orthogonal
    ;
    for (var i = 0; i < orthogonal.length; i++) {      
      // get only bottom path position
      if (orthogonal[i].y < path.y) return false
    }
    return true
  })
    
  for (var i = 0; i < p.length; i++) {
    var square = entityFactory(randomPick(WALLFACEpritesSet))
    square.x = p[i].x
    square.y = p[i].y
    square.type = 'perspectiveWall'
        
    world.things.decorativeWalls.push(square)

    var shadow = entityFactory({idle: [ShadowSprite2]}, recycle(world.things.shadows))
    shadow.x = square.x
    shadow.y = square.y+square.h
    square.followers.push(shadow)
  }

  // change hitbox of left and rigth walls
  // so entities can walk "behind" it
  // Also, set a Spaw area, so enemyes will 
  // spawn only near walls
  for (var i = 0; i < world.things.paths.length; i++) {
    var path = world.things.paths[i]
    world.things.walls.filter(function(w) {
      return (w.y === path.y) && (Math.abs(w.x - path.x) === path.w)
    }).map(function(wall) {
      wall.xhit = 6
      wall.whit = wall.w - wall.xhit*2

      path.isSpawn = true
    })
  }
  
  world.enemySpawnArea = world.things.paths.filter(function(path) {
    return path.isSpawn
  })

  // add some decoration to walls without left of right neighbors
  var allWalls = world.things.walls.concat(world.things.decorativeWalls)
  world.things.walls.map(function(wall) {
    var rWalls = allWalls.filter(function(wall2) {
      return (wall2.x === (wall.x + wall.w)) &&
        wall2.y === wall.y && 
        wall2.type !== 'perspectiveWall'
      ;
    })
    if (!rWalls.length && ((wall.x/wall.w) !== nxTiles-1)) {
      wall.sprites = randomPick(TILESpritesSetHallL)
    }

    var lWalls = allWalls.filter(function(wall2) {
      return (wall2.x === (wall.x - wall.w)) &&
        wall2.y === wall.y && 
        wall2.type !== 'perspectiveWall'
      ;
    })
    if (!lWalls.length && ((wall.x/wall.w) !== 0)) {
      wall.sprites = randomPick(TILESpritesSetHallR)
    }

    var rlWalls = allWalls.filter(function(wall2) {
      return (Math.abs(wall2.x - wall.x) === wall.w) &&
        wall2.y === wall.y && 
        wall2.type !== 'perspectiveWall'
      ;
    })
    if (!rlWalls.length && ((wall.x/wall.w) !== 0)) {
      wall.sprites = randomPick(TILESpritesSetHallRL)
    }

  })

  return world
}

// create a entity with all properties 
// handled on main loop
var entityFactory = function(sprites, toRecycle) {
  var spriteCicle = {
    timeline: 0,
    spriteCicle: 10,
    spriteI: 0
  }
  var obj
  if (toRecycle) {
    obj = toRecycle
  } else {
    obj = {}
  }
  sprites.moveLeft = sprites.moveLeft || sprites.idle
  sprites.moveRight = sprites.moveRight || sprites.idle

  obj.h = sprites.idleRight ? sprites.idleRight[0].height : sprites.idle[0].height
  obj.w = sprites.idleRight ? sprites.idleRight[0].width : sprites.idle[0].width
  obj.speed = 200
  obj.lastShoot = null
  obj.coolDown = 20
  obj.sprites = sprites
  obj.idle = Object.create(spriteCicle),
  obj.move = Object.create(spriteCicle)
  obj.toSide = null
  obj._toRecycle = false
  obj.xhit = 0
  obj.yhit = 0
  obj.whit = obj.w
  obj.hhit = obj.h
  obj.type = ''
  obj.followers = []
  obj.life = 0
  obj.x = 0
  obj.y = 0
  obj._prevx = 0
  obj._prevy = 0
  obj.spriteSet = ''
  obj.hasAntenna = false

  return obj
}

var enemyMap = {
  SlimDroneAnim: {
    speed: 200,
    life: 1,
    coolDown: 100,
    stateChange: 30
  },
  FatDroneAnim: {
    speed: 100,
    life: 3,
    coolDown: 150,
    stateChange: 150
  },
  TriDroneAnim: {
    speed: 300,
    life: 1,
    coolDown: 50,
    stateChange: 60
  }
}

var Drone = function() {
  if (LEVEL === 1) {
    var enemyProfile = 'SlimDroneAnim'
  }
  if (LEVEL === 2) {
    var enemyProfile = randomPick(['SlimDroneAnim', 'SlimDroneAnim', 'FatDroneAnim'])
  }
  if (LEVEL > 2) {
    if (random()/LEVEL < 0.3) {
      var enemyProfile = randomPick(Object.keys(enemyMap))
    } else {
      var enemyProfile = randomPick(['SlimDroneAnim', 'FatDroneAnim'])
    }
  }

  var enemy = entityFactory({
      idle: window[enemyProfile]
    },
    recycle(WORLD.things.enemies)
  )
  enemy.explode = function() {
    this._toRecycle = true
    aa.play( 'explode' )

    var explosion = entityFactory({
        idle: ExplosionIdleAnim
      },
      recycle(WORLD.things.explosions)
    )
    explosion.idle.timeline = randomMinMax(0, 30) // mut be < than what is cheched on main
    explosion.x = this.x
    explosion.y = this.y

    BOARD.drone += 1
    for (var i = this.followers.length - 1; i >= 0; i--) {
      this.followers[i]._toRecycle = true
    }
    WORLD.enemyCount -= 1

    var scrap = entityFactory({
        idle: [spriteFactory(SCRAPSpriteTemplate, SCRAPSpritePalette)]
      },
      recycle(WORLD.things.scraps)
    )
    scrap.x = this.x + this.w/2
    scrap.y = this.y + this.h*0.8    
  },
  enemy.reactToBulletCollision = function() {
    this.life -= 1
    if (this.life <= 0) {
      this.explode()
    } else {
      aa.play( 'enemyDamage' )
    }
  }

  // AI
  enemy._aiTimeline = 1
  enemy._aiStateChange = enemyMap[enemyProfile].stateChange
  enemy.coolDown = enemyMap[enemyProfile].coolDown
  enemy.speed = enemyMap[enemyProfile].speed
  enemy.life = enemyMap[enemyProfile].life
  enemy.ai = function() {
    this._aiTimeline++
    var stucked = ((this.x === this._prevx) && (this.y === this._prevy))
    if (!(this._aiTimeline % this._aiStateChange)) {
      if (Math.random() > 0.6) {
        this.movex = 0
        this.movey = 0
      } else {
        this.movex = [-1,0,1][randomMinMax(0,2)]
        this.movey = [-1,0,1][randomMinMax(0,2)]
      }
      //this._aiStateChange = randomMinMax(50, 150)
    }
    if (Math.random() > 0.9 && stucked && (WORLD.count - this.lastShoot >= this.coolDown)) {
      this.lastShoot = WORLD.count
      var enemyBullet = recycle(WORLD.things.enemyBullets)
      aa.play('enemyShot') 
      enemyBullet.x = this.x+this.w/2-PSIZE*4/2
      enemyBullet.y = this.y+this.h/2-PSIZE*4/2
      enemyBullet.w = PSIZE*4
      enemyBullet.h = PSIZE*4
      enemyBullet.speed = 400
      var dx = (PLAYER1.x - this.x)
      var dy = (PLAYER1.y - this.y)
      var deltaP = Math.atan2(dy, dx)
      deltaP = deltaP+((randomMinMax(0, 10)-5)/20)

      enemyBullet.movex = Math.cos(deltaP)//Math.atan2(dy, dx)
      enemyBullet.movey = Math.sin(deltaP)//Math.atan2(dy, dx)
      enemyBullet.color = '#FF3D00FF'
    }
  }
  return enemy
}
