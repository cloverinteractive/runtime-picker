var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|build)/,
        use: {
          loader: 'babel-loader',
        },
      }
    ],
  },
  externals: {
    'react': 'commonjs react',
    'react-bootstrap': 'commonjs react-bootstrap',
    'react-dom': 'commonjs react-dom',
  },
};
