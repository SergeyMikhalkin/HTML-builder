const fs = require('fs');
const path = require('path');

let buf = '';

async function readDir(folderPath) {
    let files = await fs.promises.readdir(folderPath, { withFileTypes: true });
    for(let file of files) {        
        if(file.isFile() && path.extname(file.name) === '.css') {               
            let filePath = path.join(__dirname, 'styles', file.name); 
            const rs = fs.createReadStream(filePath);
            await readFile(rs);                      
        };
    }
}

async function addToBundle() {
    let bundlePath = path.join(__dirname, 'project-dist', 'bundle.css'); 
    await fs.appendFile(bundlePath, buf, (err) => {
        if (err) throw err;
    });
}

async function readFile(rs) {
    buf += '\n';
    for await (const chunk of rs) {
        buf += chunk;
    }
}

(async () => {
    let bundlePath = path.join(__dirname, 'project-dist', 'bundle.css'); 
    fs.writeFile(bundlePath, '', (err) => {
        if (err) throw err;
    });

    const foldPath = path.join(__dirname, 'styles'); 
    await readDir(foldPath);
    await addToBundle();
})();
