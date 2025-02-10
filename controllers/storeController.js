const path = require('path');
const Home = require('../models/home');
const User = require("../models/User");
const rootDir = require("../utils/pathUtil");

const getHomes = (req, res, next) => {
    Home.find()
        .then((registeredHomes) => {
            res.render('store/homeList', { registeredHomes: registeredHomes, pageTitle: 'Homes List',isLoggedIn: req.session.isLoggedIn,user: req.session.user});
        })
        .catch((err) => {
            console.log('Error fetching homes', err);
            res.redirect('/');  
        });
};
exports.getHomes = getHomes;
const getIndex = (req, res, next) => {
    Home.find()
        .then((registeredHomes) => {
            res.render('store/index', { registeredHomes: registeredHomes, pageTitle: 'AirBnb Home',isLoggedIn: req.session.isLoggedIn,user: req.session.user});
        })
        .catch((err) => {
            console.log('Error fetching homes for index', err);
            res.redirect('/');  
        });
};

exports.getIndex = getIndex;
exports.getBookings = (req, res, next) => {
    res.render('store/bookings', { pageTitle: 'My Bookings',isLoggedIn: req.session.isLoggedIn,user: req.session.user});
};

exports.getFavouriteList = async (req, res, next) => {
    const userId = req.session.user._id;
    try {
      const user = await User.findById(userId).populate('favouriteHomes');
            res.render("store/favouriteList", {
                homes: user.favouriteHomes,
                pageTitle: "Favourites",
                isLoggedIn: req.session.isLoggedIn,
                user: req.session.user
            });
    }
    catch (err) {
        console.log("Error while fetching favourites", err);
        res.redirect("/favouriteList");
    }
};

const getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findById(homeId)
        .then((home) => {
            if (!home) {
                res.redirect('/homes'); 
            } else {
                res.render('store/homeDetail', { home: home, pageTitle: "Home Details",isLoggedIn: req.session.isLoggedIn,user: req.session.user});
            }
        })
        .catch((err) => {
            console.log('Error fetching home details', err);
            res.redirect('/homes');
        });
};
exports.getHomeDetails = getHomeDetails;

exports.postAddToFavouriteList = async (req, res, next) => {
    const homeId = req.body.id;
    const userId = req.session.user._id;
  try {
    const user = await User.findOne({_id: userId});
    if (!user.favouriteHomes.includes(homeId)) {
      user.favouriteHomes.push(homeId);
      await user.save();
    }
    console.log('Home added to favourites', user);
  } catch(err) {
    console.log(err);
  } finally {
    res.redirect("/favouriteList");
  }
};
exports.postRemoveFromFavouriteList = (req, res, next) => {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    User.findById(userId)
        .then((user) => {
            user.favouriteHomes.pull(homeId);
            return user.save();
        })
        .then((result) => {
            console.log('Home removed from favourites', result);
            res.redirect('/favouriteList');
        })
        .catch((err) => {
            console.log('Error while removing home from favourites', err);
        });
};

exports.getRules = (req, res, next) => {
    //const houseId = req.params.houseId;
    const rulesFileName = 'Airbnb-Rules.pdf';
    const filePath = path.join(rootDir, 'rules', rulesFileName);
    //res.sendFile(filePath);
    res.download(filePath, "Rules.pdf");
};
