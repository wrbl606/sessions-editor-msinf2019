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

// P E A K S

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

// find minimal peak

const gMin = Minimum(...gyroValue);
const accMin = Minimum(...accValue);
const gMax = Maximum(...gyroValue);
const accMax = Maximum(...accValue);

function Minimum(...args: number[]) {
  var i;
  var min = Infinity;
  for (i = 0; i < args.length; i++) {
    if (args[i] < min) {
      min = args[i];
    }
  }
  return min;
}

function Maximum(...args: number[]) {
  var i;
  var max = -Infinity;
  for (i = 0; i < args.length; i++) {
    if (args[i] > max) {
      max = args[i];
    }
  }
  return max;
}

// I N T E G R A L (numeric, of course)

var accIntegral = 0;
for (let i = 0; i < accData.length - 1; i++) {
  accIntegral += accData[i].norm * (accData[i + 1].time - accData[i].time);
}

var gyroIntegral = 0;
for (let i = 0; i < gyroData.length - 1; i++) {
  gyroIntegral += gyroData[i].norm * (gyroData[i + 1].time - gyroData[i].time);
}

var avgAccPeaks =
  ((accValue.length - 1) /
    (accData[accData.length - 1].time - accData[0].time)) *
  60000;
var avgGyroPeaks =
  ((gyroValue.length - 1) /
    (gyroData[gyroData.length - 1].time - gyroData[0].time)) *
  60000;

var txt = unzip.fileName + '.txt';

var fs = require('fs');
fs.writeFile(
  txt,
  accValue.length +
    '\n' +
    gyroValue.length +
    '\n' +
    avgAccPeaks +
    '\n' +
    avgGyroPeaks +
    '\n' +
    accMin +
    '\n' +
    gMin +
    '\n' +
    accMax +
    '\n' +
    gMax +
    '\n' +
    accIntegral +
    '\n' +
    gyroIntegral,
  'utf8',
  (err: Error) => {
    if (err) throw err;
    else console.log("It's saved!");
  }
);
/*Serializes data
number of accelerometer peaks
number of gyroscope peaks
average number of accelerometer peaks per minute
average number of gyroscope peaks per minute
minimal peak of accelerometer
minimal peak of gyroscope
maximal peak of accelerometer
maximal peak of gyroscope
integral of accelerometer
integral of gyroscope

Need to write the name of the user by hand at the end of .txt file
*/
