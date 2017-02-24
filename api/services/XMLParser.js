// This is a Service to Parse a XML document
// and create a structured data for the content in it

// Requiring packages
var xml2js = require('xml2js'),
    fs = require('fs'),
    underscore = require('underscore');

var pry = require('pryjs');
var parser = new xml2js.Parser();

// These are the files that needs to be parsed
// This could even be passed to this service, but since at this point of time we have fixed number of files to Parse,
// we are putting it here
const filesToParse = [
  'Badges.xml', 'Comments.xml', 'PostHistory.xml',
  'PostLinks.xml', 'Posts.xml', 'Tags.xml',
  'Users.xml', 'Votes.xml'
]

// Method to take a file path, parse it and create the structured data for it.
var parseXML = function(file_path) {
  fs.readFile(sails.config.appPath + file_path, function(err, data) {
    if(err) { // file not found or not readable
      return sails.log("Can not Parse file - "  + file_path);
    }

    parser.parseString(data, function (err, result) {
      if (err) { // file content can not be read
        return sails.log("Cannot parse the file content for file - " + file_path);
      }

      // Mapping file to appropriate model string to dump XML data
      var file_name = file_path.split("/").reverse()[0].split(".")[0];
      var model_name = file_name.charAt(0).toUpperCase() + file_name.slice(1);
      var model = eval(model_name);

      sails.log("Initializing Structured Record Creation for - " + file_name);

      // By now, the XML data has been converted to JSON objects
      // We need to iterate them and add them to the database
      // result = {
      //   "file_name": {
      //     "row": {
      //       "$": {
      //         // objects
      //       },
      //       "$": {
      //         //objects
      //       }
      //     }
      //   }
      // }
      underscore.each(result[file_name.toLowerCase()]['row'], function(element, index, list) {
        var data = element['$'];
        model.findOrCreate(data, data, function(err, record){
          if(err) {
            return sails.log(err);
          }
          sails.log("File - " + file_name + ", Created record with Id - " + data['Id']);
        });
      });
      console.log('Successfully Created records for XML file - ' + file_path);
    });
  });
}

module.exports.seed_data = function() {
  underscore.each(filesToParse, function(element, index, list) {
    parseXML('/public/' + element);
  });
}
