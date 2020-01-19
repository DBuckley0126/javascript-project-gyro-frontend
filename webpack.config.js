const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/app/app.js',
  output: {
    filename: 'webpack.js',
    path: path.resolve(__dirname, './src/app'),
  },

  module: {
    rules:[
      {
        test: /\.css$/i,
        use: ["style-loader", 
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          }
        }
      ],
      },
    ]
  },
};