var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ["./src/index.ts", './scss/main.scss'],
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "./",
        filename: "index.js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
    },
    module: {
        // rules: [{ // sass / scss loader for webpack
        //     test: /\.(sass|scss)$/,
        //     loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
        // }],
        loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            },
            {
                test: require.resolve('snapsvg'),
                loader: 'imports-loader?this=>window,fix=>module.exports=0'
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({ // define where to save the file
            filename: 'main.bundle.css',
            allChunks: true,
        }),
    ]
};