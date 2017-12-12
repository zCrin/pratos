# SYNOPSIS
node module using slice-file to get last line of a file

# INSTALL

`npm install last-line`

# EXAMPLE

```js
var lastLine = require('last-line');
lastLine('./path/to/file', function (err, res) {
  // handle err (empty file?)
  process.stdout.write(res);
});
```

# LICENSE
MIT
