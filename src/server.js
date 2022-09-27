// create server
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

/* Server */
const app = express();

/* Log */
const logger = morgan("dev"); // using middleware morgan.

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

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
app.use("/uploads", express.static("uploads"));
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
