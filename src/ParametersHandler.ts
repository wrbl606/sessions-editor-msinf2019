'use strict';

let limit = 2000;
let files = -1;
let isInfo: boolean = false;

function setLimit(arg = '2000') {
  const arg_i = parseInt(arg);

  if (Number.isInteger(arg_i) === false)
    throw new Error('Limit has to be an integer.');


  if (arg_i < 1)
    throw new Error('Limit has to be greater than 0.');


  limit = Math.round(arg_i);
}

function setFiles(arg = '-1') {
  const arg_i = parseInt(arg);

  if (arg_i < 1)
    throw new Error('Number of files has to be greater than 0.');


  if (Number.isInteger(arg_i) === false)
    throw new Error('Number of files has to be an integer.');


  files = Math.round(arg_i);
}

for (let j = 0; j < process.argv.length; j++) {
  if (process.argv[j] === '-l' || process.argv[j] === '--limit')
    setLimit(process.argv[j + 1]);
  if (process.argv[j] === '-f' || process.argv[j] === '--files')
    setFiles(process.argv[j + 1]);
  if (process.argv[j] === '-i' || process.argv[j] === '--info') isInfo = true;
}

function validateParameters(accData: any[], gyroData: any[], numOfFiles: number) {
  if (accData.length < limit)
    throw new Error(`Number of Accelerometer's records has to be greater than the record limit or equal. 
Current limit: ${limit}. 
The number of records in the file: ${accData.length}.
You can inspect the number of records in the file by adding parameter -i or --info after the session name.
You can change the record limit by adding parameter -l {number} or --limit {number} after the session name, replacing {number} with a number you want the limit to be. 
  `);

  if (gyroData.length < limit)
    throw new Error(`Number of Gyroscope's records has to be greater than the record limit or equal. 
Current limit: ${limit}. 
The number of records in the file: ${gyroData.length}.
You can inspect the number of records in the file by adding parameter -i or --info after the session name.
You can change the record limit by adding parameter -l {number} or --limit {number} after the session name, replacing {number} with a number you want the limit to be. 
  `);

  if (accData.length < numOfFiles)
    throw new Error(`Number of Accelerometer's records has to be greater than the maximum number of output files or equal. 
Current maximum number of output files: ${files}. 
The number of records in the file: ${accData.length}.
You can inspect the number of records in the file by adding parameter -i or --info after the session name.
You can change the maximum number of output files by adding parameter -f {number} or --files {number} after the session name, replacing {number} with a number you want the limit to be. 
  `);

  if (gyroData.length < numOfFiles)
    throw new Error(`Number of Gyroscope's records has to be greater than the maximum number of output files or equal. 
Current maximum number of output files: ${files}. 
The number of records in the file: ${gyroData.length}.
You can inspect the number of records in the file by adding parameter -i or --info after the session name.
You can change the maximum number of output files by adding parameter -f {number} or --files {number} after the session name, replacing {number} with a number you want the limit to be. 
  `);
}

export { limit, files, isInfo, validateParameters };
