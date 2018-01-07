
var express = require('express'),
    
    router = express.Router(),
    
    multer = require('multer'),
    
    path = require('path'),
    
    split_pdf = require('../split_pdf'),
    
    file_name = "";

    
    
var storage = multer.diskStorage({
 
    destination: function(req, file, callback) {
    
      callback(null, './uploads')
    },
    
    filename: function(req, file, callback) {
      
      callback(null, file.fieldname + path.extname(file.originalname))
      // '-' + Date.now() +
    }
})
    


var uploading = multer({
    
  storage: storage,  
  
  fileFilter: function(req, file, callback){
    
    var ext = path.extname(file.originalname)
    
    if (ext !== '.pdf') {
      
      return callback(res.end('Only PDF are allowed'), null)
    }
    
    callback(null, true)
  }
}).single('userFile');



router.post('/', uploading, function (req, res, next) {
  
  res.write( 'maa file is uploaded');
  
  next();
 
}, function (req, res, next){
  
  split_pdf('./uploads/userFile.pdf', './splitted');
  
  next();

}, function (req, res, next){
  
  res.end('split!');
  
});

module.exports = router
