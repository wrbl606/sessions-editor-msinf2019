import Input from './Input'
import * as AdmZip from 'adm-zip'
const admzip = require('adm-zip')
export default class Unzipper {
    private zip: AdmZip
    private accEntry: any
    private gyroEntry: any

    constructor(path: string) {
        this.zip = new admzip(path)
        let templateName = path.slice(0, -4).replace(/\_/g, ":")
        this.accEntry = this.zip.getEntry(`${templateName}/accelerometer.csv`)
        this.gyroEntry = this.zip.getEntry(`${templateName}/gyro.csv`)

    }
    private checkAccelerometerFile(): boolean {
        if (this.accEntry == null) {
            return false
        } else {
            return true
        }
    }
    private checkGyroFile(): boolean {
        if (this.gyroEntry == null) {
            return false
        } else {
            return true
        }
    }
    validateInputFiles(): boolean {
        if (this.checkAccelerometerFile() && this.checkGyroFile()) {
            return true
        } else {
            return false
        }
    }

    readAccelerometerDataToArray(): Array<Input> {
        let list = this.zip.readAsText(this.accEntry).split("\n")

        let accArr: any = []

        for (let i = 1; i < list.length; i++) {
            let line = list[i].split(",");

            let temp_line: Array<any> = [];
            temp_line.push(line[0])
            for (let j = 1; j < line.length - 1; j = j + 2) {
                temp_line.push((line.slice(j, j + 2).join(",").replace(',', '.').substring(1)))
            }
            let time: string = temp_line[0].substring(1).replace(',', '.')
            let x: string = temp_line[1]
            let y: string = temp_line[2]
            let z: string = temp_line[3]
            accArr.push(new Input(parseInt(time), parseFloat(x), parseFloat(y), parseFloat(z)))
        }
        return accArr
    }
    readGyroDataToArray(): Array<Input> {
        let list = this.zip.readAsText(this.gyroEntry).split("\n")
        let gyroArr: any = []
        for (let i = 1; i < list.length; i++) {
            let line = list[i].split(",");

            let temp_line: Array<any> = [];
            temp_line.push(line[0])
            for (let j = 1; j < line.length - 1; j = j + 2) {
                temp_line.push((line.slice(j, j + 2).join(",").replace(',', '.').substring(1)))
            }

            let time: string = temp_line[0].substring(1).replace(',', '.')
            let x: string = temp_line[1]
            let y: string = temp_line[2]
            let z: string = temp_line[3]
            gyroArr.push(new Input(parseInt(time), parseFloat(x), parseFloat(y), parseFloat(z)))
        }
        return gyroArr
    }

}