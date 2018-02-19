var express   = require('express'),
    
    router    = express.Router(),
    
    db        = require('../db-mysql'),
    
    email     = require('../email-sender'), 

    fs        = require('fs');



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

router.get('/', function (req, res) {

   query_and_send(cf_arr, new_dir, function (not_sent_to, sent_to){
           
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
  

