const express = require("express");
const expHbs = require("express-handlebars");
// const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const port = 8000;
const sec12 = "123asdf";
const oneDay = 1000 * 60 * 60 * 24;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine("handlebars", expHbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
// app.use(cookieParser());
app.use(
  sessions({
    secret: sec12,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
let session;
app.get("/", (req, res) => {
  session = req.session;
  if (session.username) {
    return res.render("index", { uname: session.username });
  } else {
    return res.redirect("login");
  }
});

app.get("/login", (req, res) => {
  let auth = req.query.msg ? true : false;
  if (auth) {
    return res.render("login", { error: "Invalid username or password" });
  } else {
    return res.render("login");
  }
});

app.post("/postdata", (req, res) => {
  let { uname, password } = req.body;
  //   res.send(req.body);
  let udata = { uname: "Noman", password: "noman" };
  if (uname === udata.uname && password === udata.password) {
    // res.cookie("username", uname);
    session = req.session;
    session.username = uname;
    console.log(req.session);
    return res.redirect("/welcome");
  } else {
    return res.redirect("/login?msg=fail");
  }
});
app.get("/welcome", (req, res) => {
  //   let username = req.cookies.username;
  let username = req.session.username;
  return res.render("welcome", { username: username });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  //   res.clearCookie("username");
  return res.redirect("/login");
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running ${port}`);
  }
});
