module.exports=function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.redirect('/page_404.html')
  } else {
    next(err);
  }
}