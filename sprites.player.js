// PLAYER

//  ['  bbbbbbbbbbbb   '// 0
//  ,' bHHHHHHHHHHHHb  '// 1
//  ,'bHHGGGGGGGGGGGHb '// 2

var P1SpriteTemplate = 
  ['      pypy       '// 0
  ,'    mympppym     '// 1
  ,'  ypmppyppmmym   '// 2
  ,' yymmmmppmpmymyp '// 3
  ,'bHGGGGGbbbGGGbbbb'// 4
  ,'bHGGGGbwwbbGbwwbb'// 5
  ,'bHGGGGbwwwbGbwwwb'// 6
  ,'bHgGGGGbbbGGGbbb '// 7
  ,'bHgxGGGGGGGbGGHb '// 8
  ,'bHgxGGGGGGGGGGHb '// 9
  ,'bHgxGGGGGGbbbGHb '//10
  ,'bHgxGGGGGbwwwbHb '//11
  ,'bHHgxGGGGGbbbGHb '//12
  ,'bHGGGGGGGGGGGGHb '//13
  ,'bHGGGGGGGGGGGHHb '//14
  ,' bHGHHHHHHHdggb  '//15
  ,'  bHHHHHHHgggb   '//16
  ,'  bHHbbbbbgggb   '//17
  ,'  bHb     bgb    '//18
  ,'  bb      bb     '//19
]//           1111111
 // 01234567890123456

var P1palette = {
  ' ': 'rgba(255,255,255,0)'
  ,x: '#EA9CAE'
  ,G: '#C36278'
  ,H: '#9C344C'
  ,g: '#75142A'
  ,b: 'black'
  ,w: 'white'
  ,B: 'blue'
  ,r: 'red'
  ,y: '#B9B9B9'
  ,m: '#9C9C9C'
  ,p: '#828282'
}

var MOVING_LEGS = 
  [spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === P1SpriteTemplate.length - 4){return ' bHHHHHHHHgggb    '}
    if (i === P1SpriteTemplate.length - 3){return ' bgggbbbbbgggb    '}
    if (i === P1SpriteTemplate.length - 2){return ' bgbb     bbb     '}
    if (i === P1SpriteTemplate.length - 1){return ' bb               '}
    return x
  }), P1palette)
  ,spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === P1SpriteTemplate.length - 4){return ' bHHHbbbbbgggb    '}
    if (i === P1SpriteTemplate.length - 3){return ' bbbb     bbbb    '}
    if (i === P1SpriteTemplate.length - 2){return '                  '}
    if (i === P1SpriteTemplate.length - 1){return '                  '}
    return x
  }), P1palette)
  ,spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === P1SpriteTemplate.length - 4){return ' bHHHHHHHHgggb    '}
    if (i === P1SpriteTemplate.length - 3){return ' bbbbbbbbbggb     '}
    if (i === P1SpriteTemplate.length - 2){return '         bgb      '}
    if (i === P1SpriteTemplate.length - 1){return '         bb       '}
    return x
  }), P1palette)
  ,spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === P1SpriteTemplate.length - 4){return ' bbHHHHHHHgggb    '}
    if (i === P1SpriteTemplate.length - 3){return '   bbbbbbbggb     '}
    if (i === P1SpriteTemplate.length - 2){return '         bgb      '}
    if (i === P1SpriteTemplate.length - 1){return '         bb       '}
    return x
  }), P1palette)
  ,null
]
// jumping state repeat
MOVING_LEGS[4] = MOVING_LEGS[1]

var MOVING_EYES = 
  [spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === P1SpriteTemplate.length - 10){return 'bHGGGGGbbbGGGbbbb'}
    if (i === P1SpriteTemplate.length - 11){return 'bHGGGGbwwbbGbwwbb'}
    if (i === P1SpriteTemplate.length - 12){return 'bHGGGGbwwwbGbwwwb'}
    if (i === P1SpriteTemplate.length - 13){return 'bHgGGGGbbbGGGbbb '}
    return x
  }), P1palette)
  ,spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === P1SpriteTemplate.length - 10){return 'bHGGGGGbbbGGGbbbb'}
    if (i === P1SpriteTemplate.length - 11){return 'bHGGGGbbwwbGbbwwb'}
    if (i === P1SpriteTemplate.length - 12){return 'bHGGGGbwwwbGbwwwb'}
    if (i === P1SpriteTemplate.length - 13){return 'bHgGGGGbbbGGGbbb '}
    return x
  }), P1palette)
  ,spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === P1SpriteTemplate.length - 10){return 'bHGGGGGbbbGGGbbbb'}
    if (i === P1SpriteTemplate.length - 11){return 'bHGGGGbwwwbGbwwwb'}
    if (i === P1SpriteTemplate.length - 12){return 'bHGGGGbbwwbGbbwwb'}
    if (i === P1SpriteTemplate.length - 13){return 'bHgGGGGbbbGGGbbb '}
    return x
  }), P1palette)
  ,spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === P1SpriteTemplate.length - 10){return 'bHGGGGGbbbGGGbbbb'}
    if (i === P1SpriteTemplate.length - 11){return 'bHGGGGbwwwbGbwwwb'}
    if (i === P1SpriteTemplate.length - 12){return 'bHGGGGbwwbbGbwwbb'}
    if (i === P1SpriteTemplate.length - 13){return 'bHgGGGGbbbGGGbbb '}
    return x
  }), P1palette)
]

var BLINK_EYES = []

var EYE_OPEN = spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === 4){return 'bHGGGGGbbbGGGbbbb'}
    if (i === 5){return 'bHGGGGbwwbbGbwwbb'}
    if (i === 6){return 'bHGGGGbwwwbGbwwwb'}
    if (i === 7){return 'bHgGGGGbbbGGGbbb '}
    return x
  }), P1palette)

for (var _i = 0; _i < 20; _i++) {
  BLINK_EYES.push(EYE_OPEN)
}
for (var _i = 0; _i < 1; _i++) {
  BLINK_EYES.push(spriteFactory(P1SpriteTemplate.map((x,i) => {
    if (i === 4){return 'bHGGGGGGGGGGGGGGb'}
    if (i === 5){return 'bHGGGGbbbbbGbbbbb'}
    if (i === 6){return 'bHGGGGbbbbbGbbbbb'}
    if (i === 7){return 'bHgGGGGGGGGGGGGb '}
    return x
  }), P1palette))
}


var P1Sprites = {
  idleRight: BLINK_EYES,
  idleLeft: BLINK_EYES.map(function(s) {return mirrorCanvas(s)}),
  moveRight: MOVING_LEGS,
  moveLeft: MOVING_LEGS.map(mirrorCanvas)
}

var PLAYER1 = entityFactory(P1Sprites)
