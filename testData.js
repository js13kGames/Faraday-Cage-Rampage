var WORLD
var scrapCountPrev
var player
var buildingCagePctTarget = 400
var scrapsToBuildCage = 10
var LEVEL = 0
var ACCSCORE = 0
var BOARD

var fillBoard = function() {
  var scrapPts = BOARD.scrap * 1
  document.getElementById('scrapPts').innerText = scrapPts
  
  var dronePts = BOARD.drone * 2
  document.getElementById('dronePts').innerText = dronePts
  var cagePts = BOARD.cage * 10
  document.getElementById('cagePts').innerText = cagePts
  
  document.getElementById('scrapQtd').innerText = BOARD.scrap
  document.getElementById('droneQtd').innerText = BOARD.drone
  document.getElementById('cageQtd').innerText = BOARD.cage
  var totalPts = scrapPts+dronePts+cagePts
  document.getElementById('totalPts').innerText = scrapPts+dronePts+cagePts
  ACCSCORE += totalPts

  var highScore = ~~localStorage.getItem('highScore')

  if (ACCSCORE > highScore) {
    document.getElementById('accScore').innerText = 'ACCUMULATED: ' + ACCSCORE + ' pts. NEW HIGHSCORE!'
    localStorage.setItem('highScore', ACCSCORE)
  } else {
    document.getElementById('accScore').innerText = 'ACCUMULATED: ' + ACCSCORE + ' pts. HIGHSCORE: ' + highScore
  }
}

var newLevel = function(nxTiles, nyTiles, nWalls, seed) {

  LEVEL++

  nxTiles = Math.min(8+LEVEL, 15) || 13 // overwrite
  nyTiles = nyTiles || nxTiles
  var nWalls = nxTiles*nxTiles // This ratio gives good map results
  seed = seed || Date.now()
  var world
  var nAntennas = Math.min(POOLSize['antennas'], ~~(1+LEVEL*0.4))
  for (var _i = 0; _i < 100; _i++) {
    world = worldFactory(TILESCALE, nxTiles, nyTiles, nWalls, nAntennas, seed)
    if (!world.invalid) break
  }

  world.maxEnemies = ~~(LEVEL*2.4)
  buildingCagePctTarget = 400
  scrapsToBuildCage = 10

  //world.recoredInput = [{}]
  //world.test = function() {}
  
  player = world.things.players[0]
  player.lastShoot = -1

  scrapCountPrev = null
  
  BOARD = {
    scrap: 0,
    drone: 0,
    cage: 0
  }
  
  WORLD = world
}
