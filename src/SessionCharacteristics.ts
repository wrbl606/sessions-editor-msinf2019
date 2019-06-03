export default class SessionCharacteristics {
  accValueLength: number;
  gyroValueLength: number;
  avgAccPeaks: number;
  avgGyroPeaks: number;
  accMin: number;
  gMin: number;
  accMax: number;
  gMax: number;
  accIntegral: number;
  gyroIntegral: number;
  accIntegralPerSecond: number;
  gyroIntegralPerSecond: number;
  accAvgInterval: number;
  gyroAvgInterval: number;
  constructor(
    accValueLength: number,
    gyroValueLength: number,
    avgAccPeaks: number,
    avgGyroPeaks: number,
    accMin: number,
    gMin: number,
    accMax: number,
    gMax: number,
    accIntegral: number,
    gyroIntegral: number,
    accIntegralPerSecond: number,
    gyroIntegralPerSecond: number,
    accAvgInterval: number,
    gyroAvgInterval: number
  ) {
    this.accValueLength = accValueLength;
    this.gyroValueLength = gyroValueLength;
    this.avgAccPeaks = avgAccPeaks;
    (this.avgGyroPeaks = avgGyroPeaks), (this.accMin = accMin);
    this.gMin = gMin;
    this.accMax = accMax;
    this.gMax = gMax;
    this.accIntegral = accIntegral;
    this.gyroIntegral = gyroIntegral;
    this.accIntegralPerSecond = accIntegralPerSecond;
    this.gyroIntegralPerSecond = gyroIntegralPerSecond;
    this.accAvgInterval = accAvgInterval;
    this.gyroAvgInterval = gyroAvgInterval;
  }
}
