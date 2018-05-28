#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');


const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

var sim11 = null;


const codeFile = process.argv[2];
const incmd = process.argv[3];

if(!codeFile) {
  console.log(`[${(new Date()).toLocaleTimeString()}] Error - no file specified`);
} else {

  const objFile = `${path.basename(codeFile, '.s11')}.o11`;

  var reloadSimulator = function (event, filename) {

    console.log('\n\n');
    console.log('############### detected change, recompiling! ##############');
    console.log(`[${(new Date()).toLocaleTimeString()}][as11]: Running as11`);
    const as11 = exec(`as11 ./${codeFile}`, (err, stdout, stderr) => {
      if(err) {
        console.log(`[${(new Date()).toLocaleTimeString()}][as11][ERROR]: as11 failed`);
        console.log(`[${(new Date()).toLocaleTimeString()}][as11][stderr]: ${stderr}`);
      } else {
        console.log(`[${(new Date()).toLocaleTimeString()}][as11]: as11 finished`);
        if(stderr)
          console.log(`[${(new Date()).toLocaleTimeString()}][as11as11][stderr]: ${stderr}`);
        if(stdout)
          console.log(`[${(new Date()).toLocaleTimeString()}][as11][stdout]: ${stdout}`);

        if(sim11) {
          console.log(`[${(new Date()).toLocaleTimeString()}][sim11]: killing sim11`);
          sim11.kill('SIGINT');
        }

        console.log(`[${(new Date()).toLocaleTimeString()}][sim11]: starting sim11 - ${objFile}`);
        var simargs = [];
        if(incmd)
          simargs.push('-w');
        simargs.push(`./${objFile}`);
        sim11 = spawn('sim11', simargs);
        sim11.stdout.on('data', (data) => {
          console.log(`[${(new Date()).toLocaleTimeString()}][sim11][stdout]: ${data}`);
        })

        sim11.stderr.on('data', (data) => {
          console.log(`[${(new Date()).toLocaleTimeString()}][sim11][stderr]: ${data}`);
        })

        sim11.on('close', () => {
          console.log(`[${(new Date()).toLocaleTimeString()}][sim11]: sim11 closed`);
        })
      }
    });
  }

  console.log(`[${(new Date()).toLocaleTimeString()}] Running simulator...`);
  reloadSimulator();

  console.log(`[${(new Date()).toLocaleTimeString()}] Start watching...`);
  fs.watch(`./${codeFile}`, debounce(reloadSimulator, 300));
}
