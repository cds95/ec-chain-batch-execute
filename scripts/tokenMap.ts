const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, '../../cards/QmfC87yxZKPSU3vQdsh8CBdgJttrLDJmS1HSfFfYqeRyUQ');


fs.readdir(directoryPath, function (err, folders) {
    if (err) {
        return console.log('Unable to scan folder: ' + err);
    }
    folders.forEach(function (folder) {
        console.log(folder);
        fs.readdir(path.join(directoryPath, folder), function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan files: ' + err);
            }
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                console.log(file);
            });
        });
    });
});
