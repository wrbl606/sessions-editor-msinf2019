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
// podzielić tablicę to co Bartek save to csv. Nie zapisywać do pliku tylko wydzieloną tablicę zapisać do tablicy.
// podzielić tak jak na pliki
const accSlices = new Array<Array<SessionDataRow>>();
let counter = 0;
do {
  accSlices.push(
    accData.slice(parameters.limit * counter, parameters.limit * (counter + 1))
  );
  counter++;
} while (accData.length > parameters.limit * (counter + 1));
console.log(accSlices.length);

const gyroSlices = gyroData.slice(parameters.limit); //H E R E

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

// zamknąć w funkcję żeby zapisywać do slice'ów. Odtąd wszystko do slice'ów.

function sliceToArrays(
  slices: Array<Array<SessionDataRow>>,
  data: any[],
  maxFiles: number,
  limit: number,
  smaller: number
) {
  let fileIndex = 0;
  for (let i: number = 0; i < smaller; i++) {
    if (maxFiles <= fileIndex) {
      break;
    }
    if (i === limit) {
      fileIndex += 1;

      slices.push(data.splice(0, limit)); // to pushuj do tablicy slices
      i = 0;
    }
  }
  console.log(`You have successfully finished Bartek's job.`);
}

function serialization(
  acc: Array<SessionDataRow>,
  gyro: Array<SessionDataRow>
) {
  let calcAccPeaks = peaks(acc);
  let accValue = calcAccPeaks.peaks;
  let accTime = calcAccPeaks.times;
  let accIntegral = integral(acc);

  let calcGyroPeaks = peaks(gyro);
  let gyroValue = calcGyroPeaks.peaks;
  let gyroTime = calcGyroPeaks.times;
  let gyroIntegral = integral(gyro);

  // find min and max peaks

  let gMin = Minimum(...gyroValue);
  let accMin = Minimum(...accValue);
  let gMax = Maximum(...gyroValue);
  let accMax = Maximum(...accValue);

  let avgAccPeaks =
    ((accValue.length - 1) /
      (accData[accData.length - 1].time - accData[0].time)) *
    60000;
  let avgGyroPeaks =
    ((gyroValue.length - 1) /
      (gyroData[gyroData.length - 1].time - gyroData[0].time)) *
    60000;

  let txt = unzip.fileName + '.txt';

  let fs = require('fs');
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
}

serialization(accSlices[0], gyroSlices);

// Zamknąć w funkcję żeby zapisywać do slice'ów
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

/*var accIntegralPerSecond = [];
function perSecond(){
for (let i = 0; i + 1000 < accData.length; i += 1000) {sliceToArrays(
  accData,
  numOfFiles,
  unzip.fileName,
  parameters.limit,
  'accelerometer'
); 

  
}

}
 ^^ to też ze slice'ów. */
