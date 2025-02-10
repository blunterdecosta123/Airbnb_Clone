const Home = require('../models/home');
const Favourite = require('../models/favourite');
const User = require('../models/User');
const { deleteFile } = require("../utils/file");

const getAddHome = (req, res, next) => {
    res.render('host/editHome', { pageTitle: 'Add Home to AirBnb', editing: false,isLoggedIn: req.session.isLoggedIn,user: req.session.user});
};
exports.getAddHome = getAddHome;
const getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editMode = req.query.editing === 'true';

    Home.findById(homeId)
        .then((home) => {
            if (!home) {
                return res.redirect('/host/hosthomeList');
            } else {
                res.render('host/editHome', { pageTitle: 'Edit your Home', editing: editMode, home: home,isLoggedIn: req.session.isLoggedIn,user: req.session.user});
            }
        })
        .catch((err) => {
            console.log('Error in getting home', err);
            res.redirect('/host/hosthomeList');
        });
};
exports.getEditHome = getEditHome;
const getHostHomes = (req, res, next) => {
    Home.find({host: req.session.user._id}).then((registeredHomes) => {
            res.render('host/hosthomeList', { registeredHomes: registeredHomes, pageTitle: 'Host Homes List',isLoggedIn: req.session.isLoggedIn,user: req.session.user});
        })
        .catch((err) => {
            console.log('Error in fetching homes', err);
        });
};
exports.getHostHomes = getHostHomes;
const postAddHome = (req, res, next) => {
    const { houseName, price, location, rating, description } = req.body;
    console.log('Req body: ', req.body);
  console.log('House Photo: ', req.file);
  if (!req.file) {
    return res.status(400).send('No valid image provided');
  }
  const photo = "/" + req.file.path;

    const home = new Home({
        houseName,
        price,
        location,
        rating,
        photo,
        description,
        host: req.session.user._id,
    });

    home
        .save()
        .then((result) => {
            console.log('Home added', result);
            res.redirect('/host/hosthomeList');
        })
        .catch((err) => {
            console.log('Error while adding home', err);
        });
};
exports.postAddHome = postAddHome;
const postEditHome = (req, res, next) => {
    const { id, houseName, price, location, rating, description } = req.body;
    console.log('Req body: ', req.body);
  console.log('House Photo: ', req.file);

    Home.findById(id)
        .then((home) => {
            if (!home) {
                return res.redirect('/host/hosthomeList');
            }

            home.houseName = houseName;
            home.price = price;
            home.location = location;
            home.rating = rating;
            if (req.file) {
                deleteFile(home.photo.substring(1));
                home.photo = "/" + req.file.path;
            }
            home.description = description;

            return home.save();
        })
        .then((result) => {
            console.log('Home updated', result);
            res.redirect('/host/hosthomeList');
        })
        .catch((err) => {
            console.log('Error while editing home', err);
        });
};
exports.postEditHome = postEditHome;
const postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeId;
    User.find({ 'favouriteHomes': homeId })
        .then(users => {
            const updates = users.map(user => {
                user.favouriteHomes.pull(homeId);
                return user.save();
            });
            return Promise.all(updates);
        })
        .then(() => {
            return Home.findByIdAndDelete(homeId);
        })
        .then(() => {
            console.log('Home and its references deleted successfully');
            res.redirect('/host/hosthomeList');
        })
        .catch((error) => {
            console.log('Error while deleting home', error);
            res.status(500).send('An error occurred while deleting the home');
        });
};
exports.postDeleteHome = postDeleteHome;
