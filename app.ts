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
