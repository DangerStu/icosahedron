const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	devtool: "inline-source-map",
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: "Development",
		}),
	],
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ["file-loader"],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: ["file-loader"],
			},
		],
	},
};
