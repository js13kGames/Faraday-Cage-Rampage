// FLOOR

var FLOORSpalette = 
  {a: '#fd00ff'
  ,b: '#92B4B5'
  ,c: '#00f9ff'
  ,d: '#16EBF0'
}

var FLOORSpritesSet = []
for (var s = 0; s < 10; s++) {
  var FLOOR = []
  for (var i = 0; i < 30; i++) {
    FLOOR.push([])
    for (var j = 0; j < 30; j++) {
      FLOOR[i] += ['c','d'][randomMinMax(0,1)]
    }
  }

  FLOORSpritesSet.push({idle: [spriteFactory(FLOOR, FLOORSpalette)]})
}