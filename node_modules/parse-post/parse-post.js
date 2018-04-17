var qs = require("querystring");

function create_parser(opts) {
	opts = opts || {};
	var parser = opts.parser || qs.parse;
	var limit = opts.limit || 1e6;
	var errorContentType = opts["error-content-type"] || opts.errorContentType || "text/plain";
	var message = opts.message || "Too much";

	var parse_post = function parse_post(handler) {
		return function(req, res) {
			var pthis = this, args = Array.apply(null, arguments);

			var body = "";
			req.on("data", function(chunk) {
				body += chunk;
				if(body.length > limit) {
					body = null;
					res.writeHead(413, { "Content-Type": errorContentType }).end(message);
					req.connection.destroy();
				}
			});
			req.on("end", function() {
				req.body = parser(body);
				handler.apply(pthis, args);
			});
		};
	};
	parse_post.config = create_parser;

	return parse_post;
}

module.exports = create_parser();