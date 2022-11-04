"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _connectMongo = _interopRequireDefault(require("connect-mongo"));
var _morgan = _interopRequireDefault(require("morgan"));
var _middlewares = require("./middlewares");
var _rootRouter = _interopRequireDefault(require("./routers/rootRouter"));
var _userRouter = _interopRequireDefault(require("./routers/userRouter"));
var _videoRouter = _interopRequireDefault(require("./routers/videoRouter"));
var _apiRouter = _interopRequireDefault(require("./routers/apiRouter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// create server

/* Server */
var app = (0, _express["default"])();

/* Log */
var logger = (0, _morgan["default"])("dev"); // using middleware morgan.

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json()); // express에게 브라우저에서 서버로 json을 보내고 있다고 알려줌.->문자열을 받아서 json으로 바꿔줍니다.
// headers: { "Content-type": "application/json" }인 request만 express.json()을 실행한다.

// session middleware 추가 ! -> router전에 선언 해야 한다.
app.use((0, _expressSession["default"])({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  //default저장장소는 메모리인데, 메모리는 서버를 껐다키면 모두 초기화된다.
  store: _connectMongo["default"].create({
    mongoUrl: process.env.DB_URL
  })
}));
/*
app.use((req, res, next) => {
  res.locals.sexy = "me";
  console.log(res.locals);
  req.sessionStore.all((error, sessions) => {
    next();
  });
});
*/
/* adding new property in session object
app.get("/add-one", (req, res, next) => {
  req.session.mango += 1;
  console.log("req.session : " + req.session);
  res.end();
});
*/
app.use("/uploads", _express["default"]["static"]("uploads")); // static : express한테 폴더안에있는 파일들을 볼 수 있게끔 요청하는것
// 폴더들은 기본적으로 공개되어있지 않음. 서버가 공개할 폴더를 정하는 것.
app.use("/static", _express["default"]["static"]("assets"));
app.use(_middlewares.localsMiddleware);
app.use("/", _rootRouter["default"]);
app.use(function (req, res, next) {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use("/users", _userRouter["default"]);
app.use("/videos", _videoRouter["default"]);
app.use("/api", _apiRouter["default"]);
var _default = app;
exports["default"] = _default;