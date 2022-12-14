const express = require("express");
const expHbs = require("express-handlebars");
// const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userModel = require("./models/userModel");
const multer = require("multer");
const mime = require("mime-types");
const port = 8000;
const sec12 = "123asdf";
const path = require("path");
const oneDay = 1000 * 60 * 60 * 24;
const saltRounds = 10;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine("handlebars", expHbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
// app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    let ext = mime.extension(file.mimetype);
    cb(null, file.filename + "-" + Date.now() + "." + ext);
    console.log(ext);
  },
});

const upload = multer({ storage: storage });

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

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/uploadFile", upload.single("att"), (req, res) => {
  let uploadedFile = req.file.fieldname;
  if (uploadedFile) {
    res.send("File uploaded successfully");
  } else {
    res.send("Error while uploading please try again");
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

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/postRegister", async (req, res) => {
  let { name, uname, email, password } = req.body;
  let hash = bcrypt.hashSync(password, saltRounds);
  console.log(hash);
  // res.send(hash);
  const user = await userModel.create({
    naame: name,
    uname: uname,
    email: email,
    password: hash,
  });
  res.status(201).redirect("/login");
  console.log(user);
  console.log(password);
});

app.post("/postdata", (req, res) => {
  let { uname, password } = req.body;
  //   res.send(req.body);
  userModel.findOne({ username: uname }, (err, data) => {
    if (err) {
      return res.redirect("/login?msg=fail");
    } else if (data == null) {
      return res.redirect("/login?msg=fail");
    } else {
      if (bcrypt.compareSync(password, data.password)) {
        session = req.session;
        session.username = uname;
        console.log(req.session);
        return res.redirect("/welcome");
      } else {
        return res.redirect("/login?msg=fail");
      }
    }
  });
});

app.get("/resetPass", (req, res) => {
  res.render("resPass");
});

app.get("/welcome", (req, res) => {
  //   let username = req.cookies.username;
  let username = req.session.username;
  return res.render("welcome", { username: username });
});

app.get("/accActivate/:id", (req, res) => {
  let id = req.params.id;
  userModel.findById(id);
  console.log(id);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  //   res.clearCookie("username");
  return res.redirect("/login");
});

const connectToDB = mongoose.connect(
  "mongodb://localhost:27017/users",
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Database Connected succesfully`);
    }
  }
);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running ${port}`);
  }
});
