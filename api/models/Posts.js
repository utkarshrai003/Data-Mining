/**
 * Posts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var underscore = require('underscore');

module.exports = {

  attributes: {

  },

  // Method to update Tags from string to object
  // so as to query efficiently for grouping or categorizing purpose
  update_tags: function() {
    Posts.find({}).exec(function(err, records) {
      if(err) {
        return console.log("Got error");
      }
      // Updating tags string for each record to an array of tags
      underscore.each(records, function(element, index, list) {
        var tag_string = element.Tags

        // Preparing array of tags if tag is a string
        var tags = typeof (tag_string) === 'string' ? underscore.map(underscore.compact(tag_string.split(">")), function(elem) {
          return elem.slice(1, elem.length);
        }) : tag_string ;

        // Updating tags
        Posts.update({"Id": element.Id.toString()}, {"Tags": tags}).exec(function(err, record) {
          if(err) {
            return console.log("Problem while updating");
          }
        });
      });

      console.log("Successfully Updated Tag records");
    });
  },

  // Method to group Posts according to Category
  get_categorized_posts: function() {
    return new Promise(function(fulfilled, rejected) {
      Posts.native(function(err, collection) {
        if(err) {
          rejected(err);
        }
        collection.aggregate([{$unwind: "$Tags"}, {$group: {_id: "$Tags", record: {$push: "$$ROOT"}}}]).toArray(function(err, result) {
          if (err) {
            rejected(err);
          }

          fulfilled(result);
        });
      });
    });
  }

}
