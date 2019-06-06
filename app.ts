import SessionUnzipper from './src/SessionUnzipper';
import SessionSave from './src/SessionSave';
import SessionDataRow from './src/SessionDataRow';
import * as parameters from './src/ParametersHandler';
import SessionCharacteristics from './src/SessionCharacteristics';
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
  [...accData],
  numOfFiles,
  unzip.fileName,
  parameters.limit,
  'accelerometer'
);
save.saveToCsv(
  [...gyroData],
  numOfFiles,
  unzip.fileName,
  parameters.limit,
  'gyro'
);
// podzielić tablicę to co Bartek save to csv. Nie zapisywać do pliku tylko wydzieloną tablicę zapisać do tablicy.
// podzielić tak jak na pliki
const accSlices = new Array<Array<SessionDataRow>>();
//console.log(accData.length, parameters.limit);
let counter = 0;
do {
  accSlices.push(
    accData.slice(parameters.limit * counter, parameters.limit * (counter + 1))
  );
  counter++;
} while (accData.length > parameters.limit * (counter + 1));
//console.log(accSlices.length, accData.length, parameters.limit);
//console.log(accSlices[accSlices.length - 1].length);
const gyroSlices = new Array<Array<SessionDataRow>>(); //H E R E
counter = 0;
do {
  gyroSlices.push(
    gyroData.slice(parameters.limit * counter, parameters.limit * (counter + 1))
  );
  counter++;
} while (gyroData.length > parameters.limit * (counter + 1));
//console.log(gyroSlices.length, gyroData.length, parameters.limit);
//console.log(gyroSlices[gyroSlices.length - 1].length);

// P E A K S

function integral(array: Array<SessionDataRow>) {
  let integral = 0;
  for (let i = 1; i < array.length - 1; i++) {
    integral += array[i].norm * (array[i + 1].time - array[i].time);
  }
  return integral;
}

function peaks(array: Array<SessionDataRow>) {
  let peaks = [];
  let times = [];
  for (let i = 1; i < array.length - 1; i++) {
    if (
      (array[i].norm > array[i - 1].norm &&
        array[i].norm > array[i + 1].norm) ||
      (array[i].norm < array[i - 1].norm && array[i].norm < array[i + 1].norm)
    ) {
      peaks.push(accData[i].norm);
      times.push(accData[i].time);
    }
  }
  return {
    peaks,
    times,
  };
}

// M i n s    a n d    M a x e s
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

// c a l c u l a t i n g

function toTxt(slice: number, characteristics: SessionCharacteristics) {
  let txt = 'char' + unzip.fileName + '-' + slice.toString() + '.txt';

  let fs = require('fs');
  fs.writeFile(
    txt,
    characteristics.accValueLength +
      '\n' +
      characteristics.gyroValueLength +
      '\n' +
      characteristics.avgAccPeaks +
      '\n' +
      characteristics.avgGyroPeaks +
      '\n' +
      characteristics.accMin +
      '\n' +
      characteristics.gMin +
      '\n' +
      characteristics.accMax +
      '\n' +
      characteristics.gMax +
      '\n' +
      characteristics.accIntegral +
      '\n' +
      characteristics.gyroIntegral +
      '\n' +
      characteristics.accIntegralPerSecond +
      '\n' +
      characteristics.gyroIntegralPerSecond +
      '\n' +
      characteristics.accAvgInterval +
      '\n' +
      characteristics.gyroAvgInterval,

    'utf8',
    (err: Error) => {
      if (err) throw err;
      else console.log("It's saved!");
    }
  );
}

function serialization(
  acc: Array<SessionDataRow>,
  gyro: Array<SessionDataRow>
): SessionCharacteristics {
  let calcAccPeaks = peaks(acc);
  let accValue = calcAccPeaks.peaks;
  let accTime = calcAccPeaks.times;
  let accIntegral = integral(acc);

  let calcGyroPeaks = peaks(gyro);
  let gyroValue = calcGyroPeaks.peaks;
  let gyroTime = calcGyroPeaks.times;
  let gyroIntegral = integral(gyro);
  let accAvgInterval = 0;
  let gyroAvgInterval = 0; // average intervals between peaks

  for (let i = 1; i < accTime.length - 1; i++) {
    accAvgInterval += accTime[i] - accTime[i - 1];
  }
  accAvgInterval = accAvgInterval / accTime.length / 1000;

  for (let i = 1; i < gyroTime.length - 1; i++) {
    gyroAvgInterval += gyroTime[i] - gyroTime[i - 1];
    //console.log('gyroAvgInterval iterator #', i);
  }
  gyroAvgInterval = gyroAvgInterval / gyroTime.length / 1000;
  // find min and max peaks

  let gMin = Minimum(...gyroValue);
  let accMin = Minimum(...accValue);
  let gMax = Maximum(...gyroValue);
  let accMax = Maximum(...accValue);

  let avgAccPeaks =
    ((accValue.length - 1) /
      (accData[accData.length - 1].time - accData[0].time)) *
    60000;
  //console.log('avgAccPeaks');
  let avgGyroPeaks =
    ((gyroValue.length - 1) /
      (gyroData[gyroData.length - 1].time - gyroData[0].time)) *
    60000;
  //console.log('avgGyroPeaks');

  let accIntegralPerSecond =
    accIntegral / (acc[acc.length - 1].time - acc[0].time);

  //console.log('accintegralpersecond');
  let gyroIntegralPerSecond =
    gyroIntegral / (gyro[gyro.length - 1].time - gyro[0].time);
  //console.log('gyrointegralpersecond');

  return new SessionCharacteristics(
    accValue.length, //number of accelerometer peaks
    gyroValue.length, //number of gyroscope peaks
    avgAccPeaks, //average number of accelerometer peaks per minute
    avgGyroPeaks, //average number of gyroscope peaks per minute
    accMin, //minimal peak of accelerometer
    gMin, //minimal peak of gyroscope
    accMax, //maximal peak of accelerometer
    gMax, //aximal peak of gyroscope
    accIntegral, //integral of accelerometer
    gyroIntegral, //integral of gyroscope
    accIntegralPerSecond, //integral of accelerometer per second
    gyroIntegralPerSecond, //integral of gyroscope per second
    accAvgInterval, //average interval between accelerometer peaks
    gyroAvgInterval //average interval between gyroscope peaks
  );
}
let shorter = accSlices.length;
if (gyroSlices.length < shorter) shorter = gyroSlices.length;
for (let j = 0; j < shorter; j++) {
  let o = serialization(accSlices[j], gyroSlices[j]);
  toTxt(j, o);
}
//console.log(accSlices.length);

//console.log(serialization(accSlices[1], gyroSlices[1]));

// Zamknąć w funkcję żeby zapisywać do slice'ów
/*Serializes data










Need to write the name of the user by hand at the end of .txt file
*/
