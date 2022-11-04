"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userController = require("../controllers/userController");
var _videoController = require("../controllers/videoController");
var _middlewares = require("../middlewares");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var globalRouter = _express["default"].Router();
globalRouter.get("/", _videoController.home);
globalRouter.route("/join").all(_middlewares.publicOnlyMiddelware).get(_userController.getJoin).post(_userController.postJoin);
globalRouter.route("/login").all(_middlewares.publicOnlyMiddelware).get(_userController.getLogin).post(_userController.postLogin);
globalRouter.get("/search", _videoController.search);
var _default = globalRouter;
exports["default"] = _default;