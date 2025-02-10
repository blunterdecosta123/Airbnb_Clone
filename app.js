const ENV = process.env.NODE_ENV || 'production'
require('dotenv').config({
  path: `.env.${ENV}`
});
const fs=require('fs');
const path=require('path');
const express=require('express');
const mongodb_session = require('connect-mongodb-session');
const bodyParser = require("body-parser");
const session = require('express-session');
const mongoose = require("mongoose");
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const storeRouter=require('./routes/storeRouter');
const hostRouter=require('./routes/hostRouter');
const  authRouter  = require("./routes/authRouter");
const rootDir=require('./utils/pathUtil');

const app=express();
app.set("view engine","ejs");
app.set("views","views");


const MongoDbStore = mongodb_session(session);
const MONGO_DB_URL =`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@airbnb.a6v6u.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority&appName=AirBnb`;

const sessionStore = new MongoDbStore({
    uri: MONGO_DB_URL,
    collection: 'sessions',
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    const isValidFile = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype);
    cb(null, isValidFile);
  };

  const loggingPath = path.join(rootDir, 'access.log');
  const loggingStream = fs.createWriteStream(loggingPath, {flags: 'a'});

  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined', {stream: loggingStream}));

app.use(
    session({
      secret: "my secret",
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
    })
);
app.use('/uploads', express.static(path.join(rootDir, "uploads")));
app.use(multer({storage, fileFilter}).single('photo'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(storeRouter);
app.use("/host",(req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }
    next();
  });
app.use("/host", hostRouter);
app.use(authRouter);
app.use(express.static(path.join(rootDir,"public"))); // to make public folder accessible to the client


const error404=require('./controllers/errors').error404;

app.use(error404);

const PORT = process.env.PORT || 3001;
mongoose.connect(MONGO_DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
});

