const path = require('path')

module.exports = {
  entry: path.join(__dirname, '/app.ts'),
  output: {
    filename: 'app.js',
    path: `${__dirname}/dist`
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  target:"node",
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}
