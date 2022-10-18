// create server
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";

/* Server */
const app = express();

/* Log */
const logger = morgan("dev"); // using middleware morgan.

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // express에게 브라우저에서 서버로 json을 보내고 있다고 알려줌.->문자열을 받아서 json으로 바꿔줍니다.
// headers: { "Content-type": "application/json" }인 request만 express.json()을 실행한다.

// session middleware 추가 ! -> router전에 선언 해야 한다.
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    //default저장장소는 메모리인데, 메모리는 서버를 껐다키면 모두 초기화된다.
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
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
app.use("/uploads", express.static("uploads")); // static : express한테 폴더안에있는 파일들을 볼 수 있게끔 요청하는것
// 폴더들은 기본적으로 공개되어있지 않음. 서버가 공개할 폴더를 정하는 것.
app.use("/static", express.static("assets"));
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
