var seed = Date.now()
function random () {
  var x = Math.sin(.8765111159592828 + seed++) * 10000;
  return x - Math.floor(x);
}

random = Math.random

var randomMinMax = function(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

var mapKeys = function(obj) {
  return Object.keys(obj).map(function(item) {return obj[item]})
}

var groupBy = function(arr, key) {
  var grouped = {}
  var plucked = arr.map(function(item) {
    return item[key]
  })
  var group
  for (var i = 0; i < plucked.length; i++) {
    group = plucked[i]
    if (!grouped[group]) {
      grouped[group] = arr.filter(function(item) {
        return item[key] === group
      })
    }
  }
  return grouped
}

var recycle = function(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i]._toRecycle) {
      arr[i]._toRecycle = false
      return arr[i]
    }
  }
  return null
}

var randomPick = function(arr) {
  return arr[randomMinMax(0, arr.length-1)]
}

var byId = function(id) {
  return document.getElementById(id)
}
