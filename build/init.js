"use strict";

require("dotenv/config");
require("./db");
require("./models/Video");
require("./models/User");
require("./models/Comment");
var _server = _interopRequireDefault(require("./server"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// initialize server

//서버에 db를 연결시키고, db에서는 mongoose를 연결시켜서 model을 인식하게 한다.

var PORT = 4000;
var handleListening = function handleListening() {
  console.log("\u2705 Server listenting on http://localhost:".concat(PORT, " \uD83D\uDE80 "));
};
_server["default"].listen(PORT, handleListening); // server is listening to request by using express server