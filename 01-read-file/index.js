const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt'); 
const rs = fs.createReadStream(pathToFile);

let buf = '';
rs.on('readable', () => {
    let chunk;
    while (null !== (chunk = rs.read())) {
      buf += chunk.toString();
    }
});

rs.on('end', () => {
    console.log(buf);
});