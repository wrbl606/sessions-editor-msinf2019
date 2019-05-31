const ObjectsToCsv = require('objects-to-csv');
const mkdirp = require('mkdirp');

export default class SessionSave {
  public createFolder(name: string) {
    mkdirp(name, (err: any) => {
      if (err) {
        console.error(
          `You cannot create folder ${name}, application will close in a few seconds`
        );
        process.exit();
      }
    });
  }
  public saveToCsv(
    data: any[],
    maxFiles: number,
    folderName: string,
    limit: number,
    fileName: string
  ) {
    let fileIndex = 0;
    for (let i: number = 0; i < data.length; i++) {
      if (maxFiles <= fileIndex) {
        break;
      }
      if (i === limit) {
        fileIndex += 1;
        new ObjectsToCsv(data.slice(0, limit)).toDisk(
          `./${folderName}/${fileName}-${fileIndex}.csv`
        );
        data.splice(0, limit); // to pushuj do tablicy slices
        i = 0;
      }
    }
    console.log(`You have successfully created the .csv files`);
  }
}
