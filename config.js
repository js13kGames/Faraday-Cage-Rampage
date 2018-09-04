var RECORD_INPUT = false
var RECORDED_INPUT = []
//var RESUME_ON_PLAYBACK_FINISH = false

var POOLS = ['playerBullets'
  ,'enemies'
  ,'enemyBullets'
  ,'shadows'
  ,'antennas'
  ,'scraps'
  ,'explosions'
  ,'cages'  
]

var POOLSize = {
  'antennas': 10,
  'cages': 10,
  'enemyBullets': 1000,
  'playerBullets': 1000,
}

var THINGS_PAINT_ORDER = [
'paths'
 , 'shadows'
 , 'decorativeWalls'
 , 'antennas'
 , 'cages'
 , 'scraps'
 , 'players'
 , 'playerBullets'
 , 'enemyBullets'
 , 'enemies'
 , 'explosions'
 , 'walls'
]
var MAP_SIZE = 20
var PSIZE = 2
var TILESCALE = 30
var ORT_BORN_DIST = PSIZE*MAP_SIZE*4