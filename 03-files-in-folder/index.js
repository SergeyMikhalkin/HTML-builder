const fs = require('fs');
const path = require('path');

async function readDir(folderPath) {
    const files = await fs.promises.readdir(folderPath, { withFileTypes: true });
    files.forEach(file => {        
        if(file.isFile()) {
            let name = path.basename(file.name, path.extname(file.name));
            let ext = path.extname(file.name);
            let size;
            fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
                size = stats.size;
                console.log(name, '-', ext.substring(1), '-', size / 1024 + 'kb');
            });
        };
    });
}

const foldPath = path.join(__dirname, 'secret-folder'); 
readDir(foldPath);