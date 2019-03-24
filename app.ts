import SessionUnzipper from './src/SessionUnzipper';
import SessionDataRow from './src/SessionDataRow';

const args = process.argv.slice(2);
const unzip = new SessionUnzipper(args[0]);

if (!unzip.validateInputFiles())
  throw new Error('Given file is not proper session file');

const accData: Array<SessionDataRow> = unzip.readAccelerometerDataToArray();
const gyroData: Array<SessionDataRow> = unzip.readGyroDataToArray();
