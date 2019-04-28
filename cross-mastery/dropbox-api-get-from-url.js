//@cr A File URL is posted to the CHAT in the Resolution Field and the server render the content to the browser with the file content

var fetch = require('isomorphic-fetch'); // or another library of choice.
var fs = require('fs');
var Dropbox = require('dropbox').Dropbox;
var token = process.env.DROPBOX_TOKEN;
var dbx = new Dropbox({ accessToken: token, fetch: fetch });
var annoter_file = "9c6a35efe357580f32e759908430643d.annoter.txt";
var annoter_folder_path = '/x/_/_db/annoter';
var annoter_file_path = annoter_folder_path + '/' + annoter_file;
dbx.filesListFolder({ path: annoter_folder_path })
  .then(function (response) {
    //	console.log(response);
    var { entries } = response;
    entries.forEach(file => {
      if (file.name == annoter_file) {
        console.log(file);

        //@feature Create a Shared Link for the File
        dbx.sharingCreateSharedLink({ path: file.path_lower })
          .then((lnk) => {
            console.log("--------dbx URL---------");
            console.log(lnk.url);
            //@feature Download the file using the URL created

            dbx.sharingGetSharedLinkFile({ url: lnk.url })
              .then(function (data) {
                console.log("\t-----Downloaded from URL completed------");
                var fname = '_' + data.name;
                fs.writeFile(fname, data.fileBinary, 'binary', function (err) {
                  if (err) { throw err; }
                  console.log('File: ' + fname + ' saved.');
                });
              })
              .catch(function (err) {
                throw err;
              });
            console.log("--------------------");


          }).catch((errLNK) => {
            console.log(errLNK);
          })
          ;




      }

    });

  })
  .catch(function (error) {
    console.log(error);
  });

