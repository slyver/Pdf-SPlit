var

express   = require('express'),
router    = express.Router(),
path      = require('path'),
multer    = require('multer'),
split_pdf = require('../split_pdf'),
date      = require('node-datetime'),
fs        = require('fs'),
db        = require('../db-mysql'),
email     = require('../email-sender');
cf_list;
new_dir;



///////////////////////////////////////////////////////////////////
// 0. FORM HOME PAGE
///////////////////////////////////////////////////////////////////
router.get('/', function(req, res, next) {

  res.sendFile(
   
    path.resolve('./views/upload-form.html')
  )

})



////////////////////////////////////////////////////////////////////////////////
// 1. UPLOADED PAGE
////////////////////////////////////////////////////////////////////////////////


// STORAGE SETTING:

var storage = multer.diskStorage({
 
    destination: function(req, file, callback) {
    
      callback(null, './uploads')
    },
    
    filename: function(req, file, callback) {
      
      callback(null, file.fieldname + path.extname(file.originalname))
      
    }
})
    


// UPLOADING SETTING:

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




// ROUTING UPLOAD FILE REQUEST:

router.post('/upload', uploading, function (req, res) {
  
   res.sendFile( path.resolve('./views/split.html')  );

});





////////////////////////////////////////////////////////////////////////////////
// 2. SPLITTED PAGE
////////////////////////////////////////////////////////////////////////////////

router.get('/split', function (req, res) {

   var now = date.create();

   var formatted = now.format('d-m-Y H:M:S');

   new_dir = path.join('./splitted', formatted); 
   
   new_dir = new_dir + '/';   
   
   fs.mkdirSync(new_dir);

   console.log('new dir: ', new_dir);

   split_pdf('./uploads/userFile.pdf', new_dir, function(cf_list){
    
     res.sendFile( path.resolve('./views/send.html') );
    
     console.log('well done Silvio');

     console.log(cf_list);

   });  
});







///////////////////////////////////////////////////////////////////
// 3. SENT PAGE
//////////////////////////////////////////////////////////////////
function query_and_send(cf_arr, dir_path, callback){
  
  console.log('cf_arr: ', cf_arr);
  
  var not_sent_to = '';
  
  var sent_to = '';
  
  for (var cf in cf_arr){
    
    console.log(cf_arr[cf] + '\n');
    
    
    
    db(cf_arr[cf], function(email_address, q){
          
      console.log('query to db \n');
      
      attachment = dir_path + '/' + q + '.pdf';
      
      console.log('attachment: ', attachment);
        
      if (email_address.length == 0){
        
        not_sent_to += q + ',';
        
        console.log('no email for ', not_sent_to);
        
      }
        
      else{
        
        console.log('email ?', email_address[0].email);
        
        
        
        email(email_address[0].email, attachment, function(sent, to){
          
          console.log('email callback, sent? ', sent);
          
          if (! sent) not_sent_to += to + ',';
              
          else sent_to += to + ',';
                      
          console.log('not sent to: ', not_sent_to);
         
          console.log('before callback: ', not_sent_to);
          
          callback(not_sent_to, sent_to);
          
        });  
      } 
    }); 
  }
}





router.get('/send', function (req, res) {
   
   console.log('\n\nCF_LIST:', cf_list);

   query_and_send(cf_list, new_dir, function (not_sent_to, sent_to){
           
      var new_file = './sent-and-unsent/' + formatted + '.txt';
           
      var not_sent_to_arr = not_sent_to.split(',');
           
      var sent_to_arr = sent_to.split(',');

      var result = '';

     

      not_sent_to_arr.pop();
             
      sent_to_arr.pop();
             
     

      for (var unsent in not_sent_to_arr) 
               
         result += 'unsent: ' + not_sent_to_arr[unsent] + '\n';
             
     

      for (var sent in sent_to_arr)
               
         result += 'sent: ' + sent_to_arr[sent] + '\n';
           
           

      fs.writeFileSync(new_file, result);
                  
      res.write('\n Risultato: \n' + result);
         
      res.end('Invio tramite Mail Completato');
         
  });
       
});

module.exports = router
