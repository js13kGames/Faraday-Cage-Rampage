var getBodyCoords = function(item) {
  return {
    x0: item.x + (item.xhit || 0)
    , x1: item.x + (item.whit || item.w) + (item.xhit || 0)
    , y0: item.y + (item.yhit || 0)
    , y1: item.y + (item.hhit || item.h) + (item.yhit || 0)
  }
}

var getPrevItemProps = function(item) {
  return {
    x: item._prevx ? item._prevx : item.x
    , y: item._prevy ? item._prevy : item.y
    , w: item.w
    , h: item.h
    , xhit: item.xhit
    , yhit: item.yhit
    , whit: item.whit
    , hhit: item.hhit
  }
}


/*
Returns an object with 
overlap: boolean
value:overlap size
TODO: Optimize
*/
var checkAxisOverlap = function(source, target, axis) {

  var x = [
    source[axis+'0'],
    source[axis+'1'],
    target[axis+'0'],
    target[axis+'1']
  ]

  var sorted
  // Check most common cases before sorting
  if ((x[0]<=x[1])&&(x[1]<=x[2])&&(x[2]<=x[3]))      { sorted = x                     }
  else if ((x[0]<=x[2])&&(x[2]<=x[1])&&(x[1]<=x[3])) { sorted = [x[0],x[2],x[1],x[3]] }
  //else if ((x[1]<=x[3])&&(x[3]<=x[0])&&(x[0]<=x[2])) { sorted = [x[1],x[3],x[0],x[2]] }
  //else if ((x[0]<=x[3])&&(x[3]<=x[1])&&(x[1]<=x[2])) { sorted = [x[0],x[3],x[1],x[2]] }
  //else if ((x[1]<=x[2])&&(x[2]<=x[0])&&(x[0]<=x[3])) { sorted = [x[1],x[2],x[0],x[3]] }
  else if ((x[2]<=x[3])&&(x[3]<=x[0])&&(x[0]<=x[1])) { sorted = [x[2],x[3],x[0],x[1]] }
  else                                               { sorted = x.sort(function(a, b) {return a-b}) }

  //...than this
  //sorted = x.sort(function(a, b) {return a-b})

  /*  s
   ________   t
  |     ___|_____
  |    |   |     |
  s____t___s_____t
  0    0   1     1
  
       |val|
  */

  return {
    overlap: source[axis+'1'] > target[axis+'0'] && source[axis+'0'] < target[axis+'1'],
    val: sorted[2] - sorted[1]
  }
}

/*
Return objects that collides and aditional info,
sorted by overlap area
*/
var checkCollision = function(source, allTargets, heuristic, inspect) {
  // heuristic: check if its source and targed are near
  heuristic = heuristic ? heuristic : source.w*4//*(source.speed ? TIME_FACTOR * source.speed : 1)
  
  var targets = []
  var hTestDx, hTestDy
  for (var i = 0; i < allTargets.length; i++) {
    
    if (allTargets[i]._toRecycle) {
      continue
    }

    hTestDx =  allTargets[i].x - source.x
    hTestDx = hTestDx < 0 ? hTestDx * -1 : hTestDx
    
    hTestDy =  allTargets[i].y - source.y
    hTestDy = hTestDy < 0 ? hTestDy * -1 : hTestDy

    if (hTestDx < heuristic || hTestDy < heuristic) {
      targets.push(allTargets[i])
    }    
  }

  var s = getBodyCoords(source)
  var t
  var target
  var res = []
  var dx
  var dy
  var ax
  var ay
  var area
  var overlapx
  var overlapy
  for (var i = targets.length - 1; i >= 0; i--) {
    target = targets[i]
    t = getBodyCoords(target)

    overlapx = checkAxisOverlap(s, t, 'x')
    overlapy = checkAxisOverlap(s, t, 'y')

    if (overlapx.overlap && overlapy.overlap) {

      /*
       ______
      |     _|___
      |    | |   |
      |    |a|   |
      |____|_|   |
           |_____|
      
      a = intersection area
      
      */

      area = overlapx.val * overlapy.val

      res.push({
        source: source,
        target: target,
        area: area,
        overlapx: overlapx,
        overlapy: overlapy
      })
    }
  }
  return res.sort(function(a, b) {return a.area-b.area})
}

var handlePlayerColl = function(collisions) {
  var s
    , t
    , item
    , n
    , d
    , ax
    , sPrev
    , tPrev
    , axes
    , overlapIn
    , target

  /*
  Filter "cracks"
  */

  if (collisions.length === 2 && 
      (collisions[0].target.y === collisions[1].target.y ||
      collisions[0].target.x === collisions[1].target.x)
    )
  {
    collisions = [Math.abs(collisions[0].area) > Math.abs(collisions[1].area) ? collisions[0] : collisions[1]]
  }

  axes = ['y', 'x']
  for (var i = collisions.length - 1; i >= 0; i--) {
    item = collisions[i].source
    target = collisions[i].target
    s = getBodyCoords(item)
    t = getBodyCoords(target)

    for (var j = axes.length - 1; j >= 0; j--) {
      sPrev = getBodyCoords(getPrevItemProps(item))
      tPrev = getBodyCoords(getPrevItemProps(target))
      ax = axes[j]
      // to smooth wall sliding, we check if objects are starting to overlap.
      // If true, correct the position, if false, object is sliding and dont correct.
      overlapIn = !checkAxisOverlap(sPrev, tPrev, ax).overlap
      if (overlapIn) {
        // normal vector
        n = Math.abs(item[ax] - sPrev[ax+'0'])/(item[ax] - sPrev[ax+'0']) || 0
        // minimal intersection
        d = Math.min(Math.abs(s[ax+'0'] - t[ax+'1']), Math.abs(s[ax+'1'] - t[ax+'0']))
        // correct position
        item[ax] -= d * n
      }
    }
  }
}

var handleBulletWallColl = function(collisions) {
  if (collisions.length) {
    collisions[0].source._toRecycle = true
  }
}

var handlePlayerScrapColl = function(collisions) {
  if (collisions.length) {
    for (var i = collisions.length - 1; i >= 0; i--) {
      collisions[i].target._toRecycle = true
      WORLD.scrapCount += 1
      BOARD.scrap += 1
      aa.play( 'powerup' )
    }
  }
}

var handleBulletThingColl = function(collisions) {
  if (collisions.length) {
    for (var i = collisions.length - 1; i >= 0; i--) {
      if (collisions[i].target.reactToBulletCollision) {
        collisions[i].target.reactToBulletCollision(collisions)
      }
    }
    collisions[0].source._toRecycle = true
  }
}
