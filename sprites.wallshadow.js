// WALL FACE

var WALLFACEpalette = 
  {x: '#2A032A'
  ,b: '#2A032A'
  ,c: '#2A032A'
  ,1: '#331533'
  ,2: '#2F002F'
  ,3: '#2D2D2D'
  ,4: '#584701'
}

var WALLFACETemplates = []
WALLFACETemplates.push(
['xxxxx1xxxxxxxxxxxxxxxxxxxxxxxx'
,'xxxxx1xxxxxxxxxxxxxxxxxxxxxxxx'
,'xxxxx1xxxxxxxxxxxxxxxxxxxxxxxx'
,'xxxxx1xxxxxxxxxxxxxxxxxxxxxxxx'
,'xxxxx1xxxxxxxxxx1xxxxxxxxxxxxx'
,'111111xxxxxxxxxx1xxxxxxxxxxxxx'
,'22222111xxxxx1112xxxxxxxxxxxxx'
,'xbbbb2221xxxx122bxxxxxxxxxxxxx'
,'xbbbbbbb111112bbbxxxxxxxxxxxxx'
,'xbbbbbbb12222bbbbxxxxx44xxxxxx'
,'xbbbbbbb1bbbbbbbbxx1xx44xxxxxx'
])
WALLFACETemplates.push(
['xxxxxxx1xxxxxxxxxxxxxxxxxxxxxx'
,'xxxxxx1xxxxxxxxxxxxxxxxxxxxxxx'
,'xxxxx1xxxxxxxxxxxxxxxxxxxxxxxx'
,'xxx1111xxxxxxxxxxxxxxxxxxxxxxx'
,'x1122221xxxxxxxxxxxxxxxxxxxxxx'
,'122bbbbbb2xxxxxxxxxxxxxxxxxxxx'
,'2bbbbbbbb2xxxxxxxxxxxxxxxxxxxx'
,'bbbbbbbbb2xxxxxxxxxxxxxxxxxxxx'
,'bbbbbbbbb2xxxxxxxxxxxxxxxxxxxx'
,'bbb44bbbb2xxxxx2xxxxx111xxx44x'
,'bbb44bbbb2xxxxx2111112221xx44x'
])
WALLFACETemplates.push(
['xxxxxxx12xxxxxxxxxxxxxxxxxxxxx'
,'xxxxxxxx12xxxxxxxxxxxxxxxxxxxx'
,'xxxxxxxx12xxxxxxxxxxxxxxxxxxxx'
,'xxxxxxxx12xxxxxxxxxxxxxxxxxxxx'
,'xxxxxxxx122xxxxxxxxxxxxxxxxxxx'
,'xxxxxxx12x12xxxxxxxxxxxxxxx111'
,'xxxxxxx12bb12xxxxxxxxxxxxxx122'
,'xxxxx122bbbbbxxxxxxxxxx11111bb'
,'xxxxx12bbbbbbxxxxxxxxxx12222bb'
,'4xxxx12bbbbbbxxxx44xxxx12bbbbb'
,'4xxx2cbbbbbbb1xxx44xxxxcbbbbbb'
])

var WALLFACEpritesSet = buildIdleTileVersions(WALLFACETemplates, WALLFACEpalette, function(row, y) {
  var res = ''
  var modLastRow = false
  var cells = row.split('').map(function(c) {
    if ((c === 'x') && (Math.random() > 0.97)) {
      res += y > 6 ? '2' : '1'
    } else if (((y === 0) && (Math.random() > 0.8)) || modLastRow) {
      res += ['3','4'][randomMinMax(0,1)]
      modLastRow = !modLastRow
    } else {
      res += c
    }
    return res
  })
  return res
})
