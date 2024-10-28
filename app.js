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
const { Server } = require("socket.io");
var cors = require("cors");
var db = require("./db/index.js");
var app = express();
var http = require("http");
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

/**** connected socket users  ****/

var users = {};
//***  create socket server *******//

var server = http.createServer(app);

const io = new Server(server, {
  /*  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  }, */
});

/************ Socket connection and other functions *****/

io.on("connection", (socket) => {
  // Handle user identification
  socket.on("register", (userId) => {
    //  Add user to the users object if  not already present
    if (!users[userId]) {
      users[userId] = socket.id; // Associate user ID with socket ID
      console.log(`
        ----------------------------------------------------
        User ${userId} registered with socket ID ${socket.id}
        ----------------------------------------------------
        `);
    }
  });

  /*** Send chat messages to a particular user with io.to */
  socket.on("chat message", (data) => {
    const { from, to, message } = data;

    //struct message acc to frontend

    console.log(message, to);
    //send message
    io.to(users[to]).emit("chat message", { to, from, message });
  });

  socket.on("disconnect", () => {
    console.log(`
      ---------------------------
      Disconnecting user ..... 
      ----------------------------
      `);

    for (let userId in users) {
      if (users[userId] === socket.id) {
        console.log(`User ${users[userId]} disconnected`);
        delete users[userId];
        break;
      }
    }
  });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = { app, server };
