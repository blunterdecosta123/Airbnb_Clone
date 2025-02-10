const error404=(req,res,next)=>{
    //res.status(404).sendFile(path.join(__dirname,"views","404.html"));
    res.status(404).render('404',{pageTitle: 'Page Not Found', isLoggedIn: req.session.isLoggedIn,user: req.session.user});
}
exports.error404=error404;