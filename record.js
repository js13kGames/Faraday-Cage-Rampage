  /* handle recorded input */
  var stopRecordFn = function() {
    RECORD_INPUT = false
    var inputSequence = document.createElement('textarea')
    inputSequence.value = JSON.stringify(RECORDED_INPUT)
    inputSequence.style = 'position: absolute;'
    document.body.append(inputSequence)
  }

  if (RECORD_INPUT) {
    document.body.append(document.createElement('br'))

    var stopRecordButton = document.createElement('input')
    stopRecordButton.type = 'button'
    stopRecordButton.value = 'stop record'
    stopRecordButton.style = 'position: absolute;'
    stopRecordButton.accesskey='n'
    document.body.append(stopRecordButton)
    stopRecordButton.onclick = stopRecordFn
  }  