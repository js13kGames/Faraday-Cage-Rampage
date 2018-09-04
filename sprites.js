var spriteFactory = function(template, palette) {
  template = template || ['BBBBBB','BBBBBB','BBBBBB','BBBBBB','BBBBBB','BBBBBB']
  palette = palette ||  {' ': 'rgba(255,255,255,0)'
    ,b: 'black'
    ,B: 'blue'
    ,R: 'red'
    ,w: 'white'
    ,g: 'green'
    ,G: '#438043'
    ,1: '#438043'
  }
  var canvas = document.createElement('canvas')

  canvas.width = template[0].length*PSIZE
  canvas.height = template.length*PSIZE

  var ctx = canvas.getContext('2d', { alpha: true })
  for (var i = 0; i < template.length; i++) {
    var cells = template[i].split('')
    for (var j = 0; j < cells.length; j++) {
      ctx.beginPath();
      ctx.rect(j*PSIZE, i*PSIZE, PSIZE, PSIZE)
      ctx.fillStyle = palette[cells[j]]
      ctx.fill()
      ctx.closePath()
    }
  }
  return canvas
}

var mirrorCanvas = function(x) {
  var newCanvas = document.createElement('canvas')
  var ctx = newCanvas.getContext('2d')
  ctx.height = x.height
  ctx.width = x.width
  ctx.drawImage(x, 0, 0);
  ctx.clearRect(0, 0, x.width, x.height)
  ctx.scale(-1, 1)
  ctx.drawImage(x,0,0,x.width*-1,x.height);
  return newCanvas
}

var buildIdleTileVersions = function(templates, palette, modFun) {
  var tileSet = []
  for (var i = 0; i < templates.length; i++) {
    if (modFun) {
      var templatesMod = templates[i].map(modFun)
    } else {
      var templatesMod = templates[i]
    }
    var TILEprite = {idle: [spriteFactory(templatesMod, palette)]}
    tileSet.push(TILEprite)
  }
  return tileSet
}

var ShadowPalet = {' ': 'rgba(255,255,255,0)',
  'x': 'rgba(0,0,0,0.5)',
  'y': 'rgba(0,0,0,0.4)'
}

var ShadowTemplate = 
['     xxxxxxxxxxx     '
,'  xxxxxxxxxxxxxxxxx  '
,'xxxxxxxxxxxxxxxxxxxxx'
,'  xxxxxxxxxxxxxxxxx  '
,'     xxxxxxxxxxx     ']

var ShadowSprite = spriteFactory(ShadowTemplate, ShadowPalet)

var ShadowTemplate2 = 
['yxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
,'yxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
,'xyxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
,'yyxxxyxxxxxyyyxxxxxxxxyxxxxyxx']

var ShadowSprite2 = spriteFactory(ShadowTemplate2, ShadowPalet)


var ShadowTemplate3 = 
['     xxxxxx     '
,'  xxxxxxxxxxxx  '
,'xxxxxxxxxxxxxxxx'
,'  xxxxxxxxxxxx  '
,'     xxxxxx     ']

var ShadowSprite3 = spriteFactory(ShadowTemplate3, ShadowPalet)