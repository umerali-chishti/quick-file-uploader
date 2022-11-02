const path = require('path')
module.exports = {
	entry:['./src/index.js','./index.js'],
	mode: 'development',
	output:{
		filename: 'index.js',
		path: path.resolve(__dirname,'./lib')
	},
	module: {
	    rules: [
	    	{
	        test: /\.js$/,
	        use: {
	          loader: "babel-loader",
	        },
	      },
	      {
	        test: /\.css$/i,
	        use: ["style-loader", "css-loader"],
	      },
	    ],
	 },
} 