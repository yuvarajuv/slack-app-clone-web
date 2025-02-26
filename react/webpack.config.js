const webpack = require('webpack')
const path = require('path')

// WebPack Plugins.
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const PACKAGE = require('./package.json')

const isProduction =
  process.argv[process.argv.indexOf('--mode') + 1] === 'production'
  
  module.exports = {
    entry: "./src/index.js",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                modules: true,
              },
            },
          ],
          exclude: [
            path.resolve(__dirname, "src/css/react-draft-wysiwyg.css"),
          ]
        },
        {
          test: /.(js)$/,
          exclude: [/node_modules/],
          use: ["babel-loader"],
        },
        {
          test: /.svg$/,
          use: ["@svgr/webpack", "file-loader"],
        },
        {
          test: /.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
      ],
  },
  resolve: {
    extensions: ['*', '.js'],
    alias: {
      '@/i18n': path.resolve(__dirname, 'src', 'i18n'),
      '@/images': path.resolve(__dirname, 'src', 'static', 'assets', 'images'),
      '@/ui': path.resolve(__dirname, 'src', 'components', 'ui'),
      '@/blocks': path.resolve(__dirname, 'src', 'components', 'blocks'),
      '@/hooks': path.resolve(__dirname, 'src', 'hooks'),
      '@/utils': path.resolve(__dirname, 'src', 'utils'),
    },
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    publicPath: !isProduction ? '/slack-app-clone-web/react' : '',
    filename: 'slack-clone.js',
    chunkFilename: '[name].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.EnvironmentPlugin({
      VERSION: PACKAGE.version,
    }),

    // Take Reference of HTML File.
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'src/static/index.html'),
      APP_ROOT_ID: 'slack-clone',
      APP_VERSION: PACKAGE.version,
    }),

    // Copy all Assets, Icons to public Folder.
    new CopyPlugin({
      patterns: [
        { from: './src/static/images', to: 'images' },
        {
          from: './src/static/translations/en.json',
          to: 'translations/en.json',
        },
      ],
    }),
  ],
  devServer: {
    open: ['/slack-app-clone-web/react'],
    historyApiFallback: true,
    static: {
      directory: './src/static',
    },
    hot: true,
    port: 3000,
    proxy: {
      '/api': 'http://YOUR_API_URL:9000',
    },
  },
}
