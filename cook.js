const express = require("express");
const expHbs = require("express-handlebars");
const cookieParser = require("cookie-parser");

const port = 9000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine("handlebars", expHbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(cookieParser());

app.get("/", (req, res) => {
  let username = req.cookies.username;
  return res.render("index", { uname: username });
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
  let udata = { uname: "Noman", password: "noman" };
  if (uname === udata.uname && password === udata.password) {
    res.cookie("username", uname);
    return res.redirect("/welcome");
  } else {
    return res.redirect("/login?msg=fail");
  }
});
app.get("/welcome", (req, res) => {
  let username = req.cookies.username;
  return res.render("welcome", { username: username });
});

app.get("/logout", (req, res) => {
  res.clearCookie("username");
  return res.redirect("/login");
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running ${port}`);
  }
});
