const path = require('path');

module.exports = {
    entry: {
        index: './src/index.ts',
        kula: './src/kula.ts',
        pole: './src/pole.ts',
        main: "./src/main.ts"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
};