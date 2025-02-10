//const path=require('path');
const express=require('express');

const storeRouter=express.Router();
//const rootDir=require('../utils/pathUtil');
//const {registeredHomes}=require('./hostRouter');

// userRouter.get("/",(req,res,next)=>{
//     res.sendFile(path.join(rootDir,"views","home.html"));
// });
const storeController=require("../controllers/storeController");
storeRouter.get("/",storeController.getIndex);
storeRouter.get("/bookings",storeController.getBookings);
storeRouter.get("/favouriteList",storeController.getFavouriteList);
storeRouter.get("/homes",storeController.getHomes);
storeRouter.get("/homes/:homeId",storeController.getHomeDetails);

storeRouter.post("/favouriteList",storeController.postAddToFavouriteList);
storeRouter.post("/favouriteList/delete/:homeId",storeController.postRemoveFromFavouriteList);
storeRouter.get('/rules/:houseId', storeController.getRules);

module.exports=storeRouter;