const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  output: {
    filename: "main.js",
    //path: "./assets/js", -> error : The provided value "./assets/js" is not an absolute path!
    path: path.resolve(__dirname, "assets", "js"), // /Users/chanwoobok/Fitips/assets/js
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader", // 프론트도 babel을 이용해 js코드를 컴퓨터가 알아들을수있게 바꿔줌.in webpack
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};
