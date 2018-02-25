var express   = require('express'),
    
    router    = express.Router(),
    
    multer    = require('multer'),
    
    path      = require('path'),
    
    split_pdf = require('../split_pdf'),
        
    date      = require('node-datetime'),
    
    fs        = require('fs');





////////////////////////////////////////////////////////////////////////////////
// STORAGE SETTING
////////////////////////////////////////////////////////////////////////////////
var storage = multer.diskStorage({
 
    destination: function(req, file, callback) {
    
      callback(null, './uploads')
    },
    
    filename: function(req, file, callback) {
      
      callback(null, file.fieldname + path.extname(file.originalname))
      
    }
})
    

////////////////////////////////////////////////////////////////////////////////
// UPLOADING SETTING
////////////////////////////////////////////////////////////////////////////////
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



////////////////////////////////////////////////////////////////////////////////
// ROUTING UPLOAD FILE REQUEST
////////////////////////////////////////////////////////////////////////////////
router.post('/', uploading, function (req, res) {
  
   res.sendFile( path.resolve('./views/split.html')  );

});

module.exports = router    
