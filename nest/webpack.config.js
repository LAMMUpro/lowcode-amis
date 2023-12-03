const path = require('path');
const IgnorePlugin = require('webpack').IgnorePlugin;
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (config, context) => ({
  entry: './dist/src/main.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build_webpack'),
  },
  target: 'node',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,//不将注释提取到单独的文件中
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
          '@nestjs/platform-express',
          'cache-manager',
          'class-validator',
          'class-transformer',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource);
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
  ]
})