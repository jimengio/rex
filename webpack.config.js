var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: ["./src/main.tsx"],
	output: {
		filename: "index.js",
		path: path.join(__dirname, "/dist")
	},
	devtool: "cheap-source-map",
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					"style-loader", // creates style nodes from JS strings
					"css-loader" // translates CSS into CommonJS
				]
			},
			{
				test: /\.tsx?$/,
				loader: "awesome-typescript-loader",
				exclude: /node_modules/
			},
			{
				test: /\.(eot|svg|ttf|jpg|png|woff2?|mp3)(\?.+)?$/,
				loader: "url-loader",
				query: {
					limit: 100,
					name: "assets/[hash:8].[ext]"
				}
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	devServer: {
		contentBase: __dirname,
		publicPath: "/",
		compress: true,
		clientLogLevel: "info",
		disableHostCheck: true,
		host: "0.0.0.0"
	},
	plugins: [
		new webpack.NamedModulesPlugin(),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "template.ejs"
		})
	]
};
