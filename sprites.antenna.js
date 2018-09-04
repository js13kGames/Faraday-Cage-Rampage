
var ANTENNASpriteTemplate = 
  ['               R               '// 0
  ,'               r               '// 1
  ,'               x               '// 2
  ,'  xxxxxxxxxxxxxxxxxxxxxxxxxxx  '// 3
  ,' x x  x  x  x  x  x  x  x  x x '// 4
  ,'xx  x  x  x  x  x  x  x  x  x x'// 5
  ,'xddddddddddddbbwbbddddddddddddx'// 6
  ,'x  x  x  x  x  xw x  x  x  x  x'// 7
  ,' xx x  x  x  x  xw x  x  x  xx '// 8
  ,'   xxxxxxxxxxxxxxxxxxxxxxxxx   '// 9
  ,'          xx       xx          '//10
  ,'  vvvvvvvvx x  x  x x          '//11
  ,' bbbbbbbbbxbbxcxxxbbxbbbbbbbbb '//12
  ,'bbcccccccbbxxxxxxxxxbbbbbbbbbbb'//13
  ,'bncccccccccccnxxxccnccccccccccc'//14
  ,'bcccccccccnccccccccccnnnnnnnccc'//14
  ,'bccccbccccccccccnbccncccccbbccc'//14
]//           111111111
 // 0123456789012345678

var ANTENNASpriteTemplate2 = Object.create(ANTENNASpriteTemplate)
ANTENNASpriteTemplate2[0] = ANTENNASpriteTemplate[0].replace('R', 'r')

// caged

var ANTENNASpriteCagedTemplate = 
  ['eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'// 0
  ,'e    e    e    e    e    e    e'// 1
  ,'e    e    e    e    e    e    e'// 2
  ,'e    e    e    e    e    e    e'// 3
  ,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'// 4
  ,'e    e    e    e    e    e    e'// 5
  ,'e    e    e    e    e    e    e'// 6
  ,'e    b    e    e    e    e    e'// 7
  ,'eeeeeeeeeeeeeeeeeebbeeeeeeeeeee'// 8
  ,'e    e    e    e    e    e    e'// 9
  ,'e    e    e    e    b    e    e'//10
  ,'e    e    b    e    e    e    e'//11
  ,'eeeeeeebeeeeeeeeeeeeeeeeeeeeeee'//12
  ,'e    e    e    e    e    e    e'//13
  ,'e    b    e    e    b    e    e'//14
  ,'e    e    e    e    e    e    e'//14
  ,'eebeeeeeeeeeeeeeeeeeeeebeeeeeee'//14
]//           111111111
 // 0123456789012345678

var ANTENNASpriteCagedTemplate = ANTENNASpriteTemplate.map(function(r, i) {
  if (!(i % 4)) {
    return 'e'.repeat(r.length)
  }
  return r.split('').map(function(c, j) {
    return !(j % 6) ? 'e' : ANTENNASpriteTemplate[i][j]
  }).join('')
})

var ANTENNASpriteCagedTemplate2 = Object.create(ANTENNASpriteCagedTemplate)
ANTENNASpriteCagedTemplate2[0] = ANTENNASpriteCagedTemplate[0].replace('R', 'r')

var ANTENNASpritePalette = {
  ' ': 'rgba(255,255,255,0)'
  ,x: 'black'
  ,b: '#4C4C4CFF'
  ,c: '#736767FF'
  ,n: '#7F7373FF'
  ,d: '#292929FF'
  ,e: '#292929FF'
  ,r: '#9A0000'
  ,R: '#FF3737'
  ,w: 'white'
}

