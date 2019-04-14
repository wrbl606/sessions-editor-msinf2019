import Path from 'path';
import AdmZip from 'adm-zip';
import SessionDataRow from './SessionDataRow';
const ObjectsToCsv = require('objects-to-csv');
const mkdirp = require('mkdirp');


export default class SessionUnzipper {
  private zip: AdmZip;
  private accEntry: AdmZip.IZipEntry;
  private gyroEntry: AdmZip.IZipEntry;
  public fileName: string;

  constructor(path: string) {
    const sessionArchivePath: string = Path.normalize(path);
    this.zip = new AdmZip(sessionArchivePath);
    const fileName: string = Path.basename(sessionArchivePath, '.zip');
    const templateName = this.getSessionInternalFolderName(fileName);
    this.accEntry = this.zip.getEntry(`${templateName}/accelerometer.csv`);
    this.gyroEntry = this.zip.getEntry(`${templateName}/gyro.csv`);
	this.fileName=fileName;
  }

  private getSessionInternalFolderName(fileName: string): string {
    const sessionDateFromFileName: string = fileName.split(' ')[0];
    const sessionTimeFromFileName: string = fileName
      .split(' ')[1]
      // for some reason
      .replace(/-/g, ':')
      .replace(/_/g, ':');

    return `${sessionDateFromFileName} ${sessionTimeFromFileName}`;
  }

  private checkAccelerometerFile(): boolean {
    return this.accEntry != null;
  }

  private checkGyroFile(): boolean {
    return this.gyroEntry != null;
  }

  validateInputFiles(): boolean {
    return this.checkAccelerometerFile() && this.checkGyroFile();
  }

  readAccelerometerDataToArray(): Array<SessionDataRow> {
    return this.readSessionFileDataToArray(this.accEntry);
  }

  readGyroDataToArray(): Array<SessionDataRow> {
    return this.readSessionFileDataToArray(this.gyroEntry);
  }

  readSessionFileDataToArray(entry: AdmZip.IZipEntry): Array<SessionDataRow> {
    const list = this.zip.readAsText(entry).split('\n');
    const arr: Array<SessionDataRow> = [];
    for (let i = 1; i < list.length - 1; i++) {
	  arr.push(this.rawSessionDataRowToInput(this.getSessionDataRow(list[i])));
    }
    return arr;
  }

  private getSessionDataRow(dataRowAsText: string): Array<string> {
    const splittedDataRowAsText = dataRowAsText.split(',');
    const temp_line: Array<string> = [];
    temp_line.push(splittedDataRowAsText[0]);
    for (let j = 1; j < splittedDataRowAsText.length - 1; j = j + 2) {
      temp_line.push(
        splittedDataRowAsText
          .slice(j, j + 2)
          .join(',')
          .replace(',', '.')
          .substring(1)
      );
    }
	
    return temp_line;
  }

  private rawSessionDataRowToInput(
    rawSessionDataRow: Array<string>
  ): SessionDataRow {
    const time: string = rawSessionDataRow[0].substring(1).replace(',', '.');
    const x: string = rawSessionDataRow[1];
    const y: string = rawSessionDataRow[2];
    const z: string = rawSessionDataRow[3];
	

    return new SessionDataRow(
      parseInt(time),
      parseFloat(x),
      parseFloat(y),
      parseFloat(z)
    );
  }
  public createCsvFromArray(data: any[], limit: number, name: string, fileindex: number) {
   mkdirp(this.fileName, (err: any)=> {
   if(err){
   console.log("Error");
   }else{
   for (let i: number = 0; i < data.length; i++){
   if (i === limit){
   fileindex += 1;
   new ObjectsToCsv(data.slice(0, limit)).toDisk(`C:/Users/barte/OneDrive/Pulpit/zadanko/dist/${this.fileName}/${name}-${fileindex}.csv`);
            data.splice(0, limit);
            i = 0;
   }
   }
   console.log(`You have successfully created the .csv files`);
   }
   });
  }
 
}
