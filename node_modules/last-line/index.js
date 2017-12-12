var slice = require('slice-file');

function lastLine(path, cb) {
  cb = cb || function(err, res) {
    if(err) { throw err; }
    process.stdout.write(res);
  };

  var ret;

  slice(path).sliceReverse(-1, 1)
  .on('data', function(data) {
    ret = data.toString();
  })
  .on('end', function() {
    if (!ret) {
      return cb("no line?");
    }
    cb(null, ret);
  })
  .on('error', function(err) {
    cb(err);
  });
}

module.exports = lastLine;

