const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/app/app.js',
   plugins: [
     new HtmlWebpackPlugin({
       title: 'app.html',
       template: './src/app/app.html',
       filename: 'app.html',
     }),
     new CopyWebpackPlugin([
       {from: './assets/json/gyro_element_vertices.json', to: 'assets/json'}
     ]),
     new webpack.ProvidePlugin({
        'window.decomp': 'poly-decomp' 
      })
   ],
  output: {
    filename: 'webpack.js',
    path: path.resolve(__dirname, './src/app/dist'),
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
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/img'
        }
      },
      {
        test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/fonts'
            }
          }
        ]
      }
    ]
  },
};