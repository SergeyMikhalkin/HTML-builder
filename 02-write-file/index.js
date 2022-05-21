const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = require('process');

const pathToFile = path.join(__dirname, 'output.txt'); 
fs.writeFile(pathToFile, '', (err) => {
    if (err) throw err;
});

const rl = readline.createInterface(stdin, stdout);

console.log('Please, enter text');

let  firstLine = true;

rl.on('line', (input) => {
    if(input === 'exit') {
        console.log('Thank you. Bye!');
        process.exit();
    }

    if(firstLine) {
        firstLine = false;
    }
    else input = '\n' + input;

    fs.appendFile(pathToFile, input, (err) => {
        if (err) throw err;
    });
})

rl.on('SIGINT', () => {
    console.log('Thank you. Bye!');
    process.exit();
});