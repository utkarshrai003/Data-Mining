/**
 * UsersController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	get_associated_users: function(req, res) {
		var id = req.allParams()["id"];

		if(!id) {
			return res.send(400, {error: "User id not found"});
		}

		User.find({"Id": id}).exec(function(err, record) {
			if(err) {
				return res.send(400, {error: "No suc user exists"});
			}

		})
	}
};
