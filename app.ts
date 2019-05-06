import SessionUnzipper from './src/SessionUnzipper';
import SessionSave from './src/SessionSave';
import SessionDataRow from './src/SessionDataRow';
import * as parameters from './src/ParametersHandler';
const args = process.argv.slice(2);
const unzip = new SessionUnzipper(args[0]);
const save = new SessionSave();

if (!unzip.validateInputFiles())
  throw new Error('Given file is not proper session file');

const accData: Array<SessionDataRow> = unzip.readAccelerometerDataToArray();
const gyroData: Array<SessionDataRow> = unzip.readGyroDataToArray();

let numOfFiles = parameters.files;
let maxF;

if (gyroData.length < accData.length)
  maxF = Math.floor(gyroData.length / parameters.limit);
else maxF = Math.floor(accData.length / parameters.limit);

if (maxF < numOfFiles) {
  console.warn(
    numOfFiles,
    'is too big to be a number of files. Max number of files is: ',
    maxF
  );
  numOfFiles = maxF;
}

if (numOfFiles == -1) numOfFiles = maxF;

if (parameters.isInfo) {
  const info = [{
    sensor: 'Accelerometer',
    time: accData[accData.length - 1].time - accData[0].time,
    entries: accData.length
  }, {
    sensor: 'Gyroscope',
    time: gyroData[gyroData.length - 1].time - gyroData[0].time,
    entries: gyroData.length
  },
  ];

  console.info(`Session ${args[0]} details: `);
  console.table(info);
  process.exit(0);
}

parameters.validateParameters(accData, gyroData, numOfFiles);

save.createFolder(unzip.fileName);
save.saveToCsv(accData, numOfFiles, unzip.fileName, parameters.limit, 'accelerometer');
save.saveToCsv(gyroData, numOfFiles, unzip.fileName, parameters.limit, 'gyro');
