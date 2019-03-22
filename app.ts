import Unzipper from './src/unzipper'
const args = process.argv.slice(2);
const unzip = new Unzipper(args[0])

if (unzip.validateInputFiles()) {
  let accData: any = unzip.readAccelerometerDataToArray()
  let gyroData: any = unzip.readGyroDataToArray()
  
}