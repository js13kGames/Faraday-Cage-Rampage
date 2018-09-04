
build = open('index.html', "w+")
js_out = ''
index_out = ''
with open("src.html", "r") as f:
  for l in f.readlines():
    if 'type="text/javascript"' in l and 'src' in l:
      js_flie_name = l.split('"')[3]
      if js_flie_name not in ['stats.js', 'record.js']:
        with open(js_flie_name, "r") as jsFile:
          js_out += jsFile.read()+'\n'        
    else:
      index_out += l

index_out = index_out.replace('<!--BUILD_JS-->', '<script type="text/javascript">'+js_out+'</script>')
build.write(index_out)
build.close()

  
