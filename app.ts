import SessionUnzipper from './src/SessionUnzipper';
import SessionDataRow from './src/SessionDataRow';
import { limit, files, isInfo } from './src/feature-parameters';
const args = process.argv.slice(2);
const unzip = new SessionUnzipper(args[0]);

if (!unzip.validateInputFiles())
  throw new Error('Given file is not proper session file');

const accData: Array<SessionDataRow> = unzip.readAccelerometerDataToArray();
const gyroData: Array<SessionDataRow> = unzip.readGyroDataToArray();
console.log('limit: ', limit, 'files: ', files, 'isInfo: ', isInfo);

let numOfFiles = files;
let maxF;

if (gyroData.length < accData.length)
  maxF = Math.floor(gyroData.length / limit);
else maxF = Math.floor(accData.length / limit);

if (maxF < numOfFiles) {
  console.log(
    numOfFiles,
    'is too big to be a number of files. Max number of files is: ',
    maxF
  );
  numOfFiles = maxF;
}

if (numOfFiles == -1) numOfFiles = maxF;

console.log(numOfFiles);

if (isInfo) {
  console.log(` Time: ${accData[accData.length - 1].time - accData[0].time}
  Number of accelerometer's 3-dimensional entries: ${accData.length}
  Number of gyroscope entries: ${gyroData.length}
  `);
}
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
