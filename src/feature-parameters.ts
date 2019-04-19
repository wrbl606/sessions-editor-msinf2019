'use strict';

var limit = 2000;
var files = 2;
var isInfo: boolean = false;

function setLimit(arg = '2000') {
  const arg_i = parseInt(arg);

  if (Number.isInteger(arg_i) === false) {
    throw new Error('Limit has to be an integer.');
    return;
  }

  if (arg_i < 1) {
    throw new Error('Limit has to be greater than 0.');
  }

  limit = Math.round(arg_i);
}

function setFiles(arg = '-1') {
  const arg_i = parseInt(arg);

  if (arg_i < 1) {
    throw new Error('Number of files has to be greater than 0.');
    return;
  }

  if (Number.isInteger(arg_i) === false) {
    throw new Error('Number of files has to be an integer.');
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
