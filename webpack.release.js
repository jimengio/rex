var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    vendor: ["react", "react-dom", "font-awesome/css/font-awesome.min.css"],
    main: ["./src/main.tsx"],
  },
  output: {
    filename: "[name].[chunkhash:8].js",
    path: path.join(__dirname, "/dist"),
  },
  devtool: "none",
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|svg|ttf|jpg|png|woff2?|mp3)(\?.+)?$/,
        loader: "url-loader",
        query: {
          limit: 100,
          name: "assets/[hash:8].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.join(__dirname, "src"), "node_modules"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new UglifyJSPlugin({
      uglifyOptions: { ie8: false, ecma: 8 },
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.ejs",
    }),
  ],
};
