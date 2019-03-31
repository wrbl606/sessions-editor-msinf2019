import SessionUnzipper from './src/SessionUnzipper';
import SessionDataRow from './src/SessionDataRow';
import { limit, files, isInfo } from './src/feature-parameters';
const args = process.argv.slice(2);
const unzip = new SessionUnzipper(args[0]);

if (!unzip.validateInputFiles())
  throw new Error('Given file is not proper session file');

const accData: Array<SessionDataRow> = unzip.readAccelerometerDataToArray();
const gyroData: Array<SessionDataRow> = unzip.readGyroDataToArray();

console.log(limit, files, isInfo);
if (isInfo) {
  console.log(` Time: ${accData[accData.length - 1].time - accData[0].time}
  Number of accelerometer's 3-dimensional entries: ${accData.length}
  Number of gyroscope entries: ${gyroData.length}
  `);
}
if (accData.length < limit)
  console.log(`Number of Accelerometer's records has to be greater than the record limit or equal. 
Current limit: ${limit}. 
The number of records in the file: ${accData.length}.
You can inspect the number of records in the file by adding parameter -i or --info after the session name.
You can change the record limit by adding parameter -l {number} or --limit {number} after the session name, replacing {number} with a number you want the limit to be. 
  `);

if (gyroData.length < limit)
  console.log(`Number of Gyroscope's records has to be greater than the record limit or equal. 
Current limit: ${limit}. 
The number of records in the file: ${gyroData.length}.
You can inspect the number of records in the file by adding parameter -i or --info after the session name.
You can change the record limit by adding parameter -l {number} or --limit {number} after the session name, replacing {number} with a number you want the limit to be. 
  `);

if (accData.length < files)
  console.log(`Number of Accelerometer's records has to be greater than the maximum number of output files or equal. 
Current maximum number of output files: ${files}. 
The number of records in the file: ${accData.length}.
You can inspect the number of records in the file by adding parameter -i or --info after the session name.
You can change the maximum number of output files by adding parameter -f {number} or --files {number} after the session name, replacing {number} with a number you want the limit to be. 
  `);

if (gyroData.length < files)
  console.log(`Number of Gyroscope's records has to be greater than the maximum number of output files or equal. 
Current maximum number of output files: ${files}. 
The number of records in the file: ${gyroData.length}.
You can inspect the number of records in the file by adding parameter -i or --info after the session name.
You can change the maximum number of output files by adding parameter -f {number} or --files {number} after the session name, replacing {number} with a number you want the limit to be. 
  `);
