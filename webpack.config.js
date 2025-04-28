const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'auth0-bundle': './public/app/auth0-bundle.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'public/dist')
  }
};
