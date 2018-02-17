var threads = 4;

var express   = require('express'),
    
    router    = express.Router(),

    path      = require('path'),
    
    split_pdf = require('../split_pdf'),

    fs        = require('fs'),
        
    date      = require('node-datetime'),

    threadify = require('../threadify'); 


router.get('/', function (req, res) {
   
   console.log('\n\n\nnum of cpus: '+threads+'\n\n\n');   

   var cf_list;

   var now = date.create();

   var formatted = now.format('d-m-Y H:M:S');

   var new_dir = path.join('./splitted', formatted); 
   
   new_dir = new_dir + '/';   
   
   fs.mkdirSync(new_dir);

   console.log('new dir: ', new_dir);

   threadify('./uploads/userFile.pdf', new_dir, threads, function(cf_list){
    
     res.sendFile( path.resolve('./views/send.html') );
    
     console.log('well done Silvio');
   });  
});

module.exports = router
