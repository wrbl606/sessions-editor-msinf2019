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
  const info = [
    {
      sensor: 'Accelerometer',
      time: accData[accData.length - 1].time - accData[0].time,
      entries: accData.length,
    },
    {
      sensor: 'Gyroscope',
      time: gyroData[gyroData.length - 1].time - gyroData[0].time,
      entries: gyroData.length,
    },
  ];

  console.info(`Session ${args[0]} details: `);
  console.table(info);
  process.exit(0);
}

parameters.validateParameters(accData, gyroData, numOfFiles);

save.createFolder(unzip.fileName);
save.saveToCsv(
  accData,
  numOfFiles,
  unzip.fileName,
  parameters.limit,
  'accelerometer'
);
save.saveToCsv(gyroData, numOfFiles, unzip.fileName, parameters.limit, 'gyro');

var accValue = [];
var accTime = [];

for (let i = 1; i < accData.length - 1; i++)
  if (
    (accData[i].norm > accData[i - 1].norm &&
      accData[i].norm > accData[i + 1].norm) ||
    (accData[i].norm < accData[i - 1].norm &&
      accData[i].norm < accData[i + 1].norm)
  ) {
    accValue.push(accData[i].norm);
    accTime.push(accData[i].time);
  }

console.log('\n acc Peaks: \n');
for (let i = 0; i <= accValue.length - 1; i++)
  console.log(accValue[i], accTime[i]);

var gyroValue = [];
var gyroTime = [];

for (let i = 1; i < gyroData.length - 1; i++)
  if (
    (gyroData[i].norm > gyroData[i - 1].norm &&
      gyroData[i].norm > gyroData[i + 1].norm) ||
    (gyroData[i].norm < gyroData[i - 1].norm &&
      gyroData[i].norm < gyroData[i + 1].norm)
  ) {
    gyroValue.push(gyroData[i].norm);
    gyroTime.push(gyroData[i].time);
  }

console.log('\n gyro Peaks: \n');
for (let i = 0; i <= gyroValue.length - 1; i++)
  console.log(gyroValue[i], gyroTime[i]);
