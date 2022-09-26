// create server
import express from "express";
import session from "express-session";
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
    secret: "hello",
    resave: true,
    saveUninitialized: true,
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
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
