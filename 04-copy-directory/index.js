const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, 'files');
const pathToFolderCopy = path.join(__dirname, 'files-copy'); 

fs.promises.mkdir(pathToFolderCopy, {recursive: true}).then(() => {
    fs.promises.readdir(pathToFolder, { withFileTypes: true }).then((files) => {
        files.forEach(file => {        
            if(file.isFile()) {
                let src = path.join(pathToFolder, file.name);
                let dest = path.join(pathToFolderCopy, file.name);
                fs.promises.copyFile(src, dest);
            };
        });
    }).catch((err) => {
        console.log(err, 'Failed to read directory');
    });
    
}).catch((err) => {
    console.log(err, 'Failed to create directory');
});