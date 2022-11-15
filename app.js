var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const compression = require("compression");
const helmet = require("helmet");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var catalogRouter = require("./routes/catalog");

var app = express();

// initialize mongoose (orm)
const mongoose = require("mongoose");
const dev_db_url =
  "mongodb+srv://m001-student:mongodb-basics@sandbox.ed9rkru.mongodb.net/local_library?retryWrites=true&w=majority";

const mongoDb = process.env.MONGODB_URI || dev_db_url;

// connect to mongo database
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", () => {
  console.error("MongoDb connection error");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression()); //Compress all routes
app.use(helmet());

app.use("/", indexRouter);
app.use("/catalog", catalogRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

module.exports = app;
