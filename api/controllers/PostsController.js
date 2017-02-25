/**
 * PostsController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');

module.exports = {

	// Endpoint to get all the Posts categorized by Tags/Categories
	index : function(req, res) {
		Posts.get_categorized_posts()
		.then(function(fulfilled, rejected) {
			if(rejected) {
				res.send(400, {error: "Canot fetch records"});
			}

			fs.writeFile(sails.config.appPath + "/public/data/posts.txt", JSON.stringify(fulfilled), function(err, data) {
				if (err) {
					return res.send(400, {error: "Problem writting data to the file"});
				}

			res.send(200, {message: "Vist file in /public/data/categorized_posts to get the record"});
		});
	});
}
}
