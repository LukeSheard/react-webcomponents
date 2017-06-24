module.exports = {
  context: __dirname,
  devtool: "inline-sourcemap",
  entry: "./index.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loaders: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  devServer: {
    contentBase: __dirname,
    compress: true,
    port: 9000
  }
};