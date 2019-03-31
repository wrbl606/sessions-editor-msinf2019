'use strict';

var limit = 2000;
var files = -1;
var isInfo: boolean = false;

function setLimit(arg = '2000') {
  const arg_i = parseInt(arg);

  if (Number.isInteger(arg_i) === false) {
    console.log('Limit has to be an integer.');
    return;
  }

  if (arg_i < 1) {
    console.log('Limit has to be greater than 0.');
    return;
  }

  limit = Math.round(arg_i);
}

function setFiles(arg = '-1') {
  const arg_i = parseInt(arg);

  if (arg_i < 1) {
    console.log('Number of files has to be greater than 0.');
    return;
  }

  if (Number.isInteger(arg_i) === false) {
    console.log('Number of files has to be an integer.');
    return;
  }

  files = Math.round(arg_i);
}

for (let j = 0; j < process.argv.length; j++) {
  if (process.argv[j] === '-l' || process.argv[j] === '--limit')
    setLimit(process.argv[j + 1]);
  if (process.argv[j] === '-f' || process.argv[j] === '--files')
    setFiles(process.argv[j + 1]);
  if (process.argv[j] === '-i' || process.argv[j] === '--info') isInfo = true;
}

export { limit, files, isInfo };

//const fs = require('fs');
//fs.truncate()

// limit nie może być większy niż liczba wpisów w obu plikach
// liczba plików nie może być większa niż liczba wpisów
// implementacja w app.ts
