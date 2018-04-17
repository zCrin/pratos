# parse-post

A function that wraps ordinary request handler and automatically parse posts.  It also protects again nuke requests.

Currently works with node.js v0.10.1+.

## Examples

```javascript
var parse_post = require("parse-post");

var route = beeline.route({
	"/": function(req, res) {
		"GET": function(req, res) { /*** GET Code ***/ },
		"POST": parse_post(function(req, res) {
			// req.body has parsed POST request body
		})
	}
});

http.createServer(route).listen(8014);
```

Example uses [beeline](https://github.com/xavi-/beeline).

## The API

- `require("parse-post")` -- Returns a function that expects a node.js [request object](http://nodejs.org/docs/latest/api/http.html#http_http_incomingmessage) and a node.js [response object](http://nodejs.org/docs/latest/api/http.html#http_class_http_serverresponse) as the first and second parameters.
- `require("parse-post").config(opt)` -- Creates a new version of `parse-post` configured with values in by `opt`:
	- `opt.parser` -- A function that's used to parse the contents of the parse body. Defaulted to [`require("querystring").parse`](http://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options)
	- `opt.limit` -- Defines the maximum size in bytes of a post request. Defaulted to `1e6`.
	- `opt.message` -- Error message sent as response body when post request is over `opt.limit`.  Defaulted to "Too much".
	- `opt["error-content-type"]` -- Content type of the response sent when the post request is over `opt.limit`.  Defaulted to `text/plain`.

## Getting parse-post

The easiest way to get parse-post is with [npm](http://npmjs.org/):

    npm install parse-post

Alternatively you can clone this git repository:

    git clone git://github.com/xavi-/node-parse-post.git


## Developed by
* Xavi Ramirez

## License
This project is released under [The MIT License](http://www.opensource.org/licenses/mit-license.php).
