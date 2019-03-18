//----------------------------------------------- Require Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
//----------------------------------------------- require Routes
const rootRoute = require("./Routes/index");
const usersRoute = require("./Routes/users");

//----------------------------------------------- Configuration
// Passport Config
require("./Config/passport")(passport);
// DB Config
const db = require("./Config/database");
// Connect to mongoose
mongoose.Promise = global.Promise;
mongoose
    .connect(db.mongoURI, {
        useNewUrlParser: true
    })
    .then(() => console.log("Connected to MongoDB ..."))
    .catch(err => console.log(err));

//----------------------------------------------- MiddleWares
// Static folder
app.use(express.static(path.join(__dirname, "Public")));
// Handlebars MiddleWare
app.engine(
    "hbs",
    exphbs({
        defaultLayout: "main",
        extname: ".hbs"
    })
);
app.set("view engine", "hbs");
// BodyParser MiddleWare
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
// MethodOverride MiddleWare
app.use(methodOverride("_method"));
// Express session MiddleWare
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
        // Using the code below will break the app
        // cookie: {
        //   secure: true
        // }
    })
);
// Passport MiddleWare
// Have to come after the Express session MiddleWare
app.use(passport.initialize());
app.use(passport.session());
// Flash MiddleWare
app.use(flash());

//----------------------------------------------- Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

//----------------------------------------------- Routes
// Mount Routes
app.use("/", rootRoute);
app.use("/users", usersRoute);

//----------------------------------------------- Port Listening
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port} ...`);
});