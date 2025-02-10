//const path=require('path');
const express=require('express');

const hostRouter=express.Router();
//const rootDir=require('../utils/pathUtil');
const exp = require('constants');
const hostController=require("../controllers/hostController");
hostRouter.get("/add-home",hostController.getAddHome);

hostRouter.post("/add-home",hostController.postAddHome);

hostRouter.get("/hosthomeList",hostController.getHostHomes);
hostRouter.get("/editHome/:homeId",hostController.getEditHome);
hostRouter.post("/editHome",hostController.postEditHome);
hostRouter.post("/deleteHome/:homeId",hostController.postDeleteHome);
module.exports=hostRouter;
