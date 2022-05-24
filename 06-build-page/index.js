const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function readFiles(streams) {
    let buf = '';
    for(let i = 0; i < streams.length; i++) {
        buf += '\n';
        for await (const chunk of streams[i]) {
            buf += chunk;
        }
    }
    return buf;
}

async function copyAssets(src, dest) {
    fs.promises.mkdir(dest, {recursive: true}).then(() => {
        fs.promises.readdir(src, { withFileTypes: true }).then((files) => {
            files.forEach(file => {   
                  
                if(file.isFile()) { 
                    let srcName = path.join(src, file.name);
                    let destName = path.join(dest, file.name); 
                    fs.promises.copyFile(srcName, destName);
                }
                else {
                    copyAssets(path.join(src, file.name), path.join(dest, file.name));
                }
            });
        }).catch((err) => {
            console.log(err, 'Failed to read directory');
        });
        
    }).catch((err) => {
        console.log(err, 'Failed to create directory');
    });
}

async function readComponentFiles(streams) {
    let buf = {};
    for(let i = 0; i < streams.length; i++) {
        buf[path.basename(streams[i].path, '.html')] = '\n';
        for await (const chunk of streams[i]) {
            buf[path.basename(streams[i].path, '.html')] += chunk;
        }
    }
    return buf;
}

async function readTemplate(templatePath, components) {
    let buf = '';
    const rs = fs.createReadStream(templatePath);

    const rl = readline.createInterface({
        input: rs,
        crlfDelay: Infinity
    });

    for await (let line of rl) {
        buf += '\n';
       if(line.includes('{{'))
       {
           line = line.trim();
           line = line.substring(2, line.length - 2);
           buf += components[line];
       }
       else buf += line;
    }

    return buf;
}



(async () => {
    let pathToFolder = path.join(__dirname, 'project-dist');
    let bundlePath = path.join(pathToFolder, 'style.css'); 
    let stylesPath = path.join(__dirname, 'styles');
    let assetsPath = path.join(__dirname, 'assets');
    let assetsProjPath = path.join(pathToFolder, 'assets');
    let templatePath = path.join(__dirname, 'template.html');
    let componentsPath = path.join(__dirname, 'components');
    let indexPath = path.join(pathToFolder, 'index.html');

    let dirExist = false;
    try {
        await fs.promises.access(pathToFolder, fs.constants.R_OK | fs.constants.W_OK);
        dirExist = true;          
    } catch (error) {       
        dirExist = false; // empty. Dir project-dist doesnt exist  
    }

    let promise = new Promise(function(resolve, reject) {resolve();});

    if(!dirExist) {
        promise.then(function(resolve, reject) {
            fs.promises.mkdir(pathToFolder, {recursive: true});
            return new Promise(function(resolve, reject) {
                resolve();
            });
        });
    }

    promise.then(function() {
        fs.writeFile(bundlePath, '', (err) => {
            if (err) throw err;
        });

        return new Promise(function(resolve, reject) {
            resolve();
        });
    })
    .then(function() {
        let files = fs.promises.readdir(stylesPath, { withFileTypes: true });

        return new Promise(function(resolve, reject) {
            resolve(files);
        });
    })
    .then(function(files) {      
        let streams = [];
        for(let file of files) {        
            if(file.isFile() && path.extname(file.name) === '.css') {               
                let filePath = path.join(stylesPath, file.name); 
                const rs = fs.createReadStream(filePath);
                streams.push(rs);
            };
        }

        return new Promise(function(resolve, reject) {
            resolve(streams);
        });
    })
    .then(function(streams) {
        buf = '';      
        buf = readFiles(streams);

        return new Promise(function(resolve, reject) {
            resolve(buf);
        });
    })
    .then(function(buf) {
        fs.appendFile(bundlePath, buf, (err) => {
            if (err) throw err;
        });

        return new Promise(function(resolve, reject) {
            resolve();
        });
    })
    .then(function() {
        fs.promises.mkdir(assetsProjPath, {recursive: true});       
        copyAssets(assetsPath, assetsProjPath);
        
        return new Promise(function(resolve, reject) {
            resolve();
        });
    })
    .then(function() {
        fs.writeFile(indexPath, '', (err) => {
            if (err) throw err;
        });

        return new Promise(function(resolve, reject) {
            resolve();
        });
    })
    .then(function() {
        let files = fs.promises.readdir(componentsPath, { withFileTypes: true });

        return new Promise(function(resolve, reject) {
            resolve(files);
        });
    })
    .then(function(files) {      
        let streams = [];
        for(let file of files) {        
            if(file.isFile() && path.extname(file.name) === '.html') {               
                let filePath = path.join(componentsPath, file.name); 
                const rs = fs.createReadStream(filePath);
                streams.push(rs);
            };
        }

        return new Promise(function(resolve, reject) {
            resolve(streams);
        });
    })
    .then(function(streams) {
        components = {};      
        components = readComponentFiles(streams);
        
        return new Promise(function(resolve, reject) {
            resolve(components);
        });
    })
    .then(function(components) {
        let buf = '';
        buf = readTemplate(templatePath, components);

        return new Promise(function(resolve, reject) {
            resolve(buf);
        });
    })
    .then(function(buf) {     
        fs.appendFile(indexPath, buf, (err) => {
            if (err) throw err;
        });

        return new Promise(function(resolve, reject) {
            resolve();
        });
    });
})();