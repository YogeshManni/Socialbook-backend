var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var eventsRouter = require("./routes/event");
var mailRouter = require("./routes/mailer");
var userRouter = require("./routes/users");
var postsRouter = require("./routes/posts");
var cors = require("cors");
var db = require("./db/index.js");
var app = express();
const env = require("dotenv");
env.config();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//app.use(bodyParser(express.bodyParser({ limit: "50mb" })));
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.static("public")); // to host static data
app.use("/", indexRouter);
app.use("/event", eventsRouter);
app.use("/users", userRouter);
app.use("/posts", postsRouter);
app.use("/verify", mailRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//start db
global.db = new db();

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
