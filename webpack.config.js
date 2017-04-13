var path = require("path");

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./app/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        port: 9000
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ExtractTextPlugin.extract({use:"css-loader"})
            },{
                test: /\.html$/,
                use: [{loader:"html-loader"}]
            }]
    },
    plugins: [
        new ExtractTextPlugin("bundle.css"),
        new HtmlPlugin()
    ]
};
