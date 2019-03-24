import AdmZip from 'adm-zip';
import Input from './Input';

export default class Unzipper {
  private zip: AdmZip;
  private accEntry: AdmZip.IZipEntry;
  private gyroEntry: AdmZip.IZipEntry;

  constructor(path: string) {
    this.zip = new AdmZip(path);
    const templateName = path.slice(0, -4).replace(/\_/g, ':');
    this.accEntry = this.zip.getEntry(`${templateName}/accelerometer.csv`);
    this.gyroEntry = this.zip.getEntry(`${templateName}/gyro.csv`);
  }

  private checkAccelerometerFile(): boolean {
    return this.accEntry == null;
  }
  private checkGyroFile(): boolean {
    return this.gyroEntry == null;
  }
  validateInputFiles(): boolean {
    return this.checkAccelerometerFile() && this.checkGyroFile();
  }

  readAccelerometerDataToArray(): Array<Input> {
    return this.readSessionFileDataToArray(this.accEntry);
  }

  readGyroDataToArray(): Array<Input> {
    return this.readSessionFileDataToArray(this.gyroEntry);
  }

  readSessionFileDataToArray(entry: AdmZip.IZipEntry): Array<Input> {
    const list = this.zip.readAsText(entry).split('\n');
    const arr: Array<Input> = [];

    for (let i = 1; i < list.length; i++) {
      const line = list[i].split(',');

      const temp_line: Array<any> = [];
      temp_line.push(line[0]);
      for (let j = 1; j < line.length - 1; j = j + 2) {
        temp_line.push(
          line
            .slice(j, j + 2)
            .join(',')
            .replace(',', '.')
            .substring(1)
        );
      }

      let time: string = temp_line[0].substring(1).replace(',', '.');
      let x: string = temp_line[1];
      let y: string = temp_line[2];
      let z: string = temp_line[3];
      arr.push(
        new Input(parseInt(time), parseFloat(x), parseFloat(y), parseFloat(z))
      );
    }
    return arr;
  }
}
