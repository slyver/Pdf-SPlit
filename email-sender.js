var date           = require('node-datetime');
var nodemailer     = require('nodemailer');
var smtpTransport  = require('nodemailer-smtp-transport');
var fs             = require("fs");

var now = date.create();

var testo_mail = "L'azienda " + global.azienda +" le fornisce il cedolino del mese " + now.format('m-Y');

module.exports = function(to, attachments, callback){

  console.log('testo mail: ', testo_mail);

  console.log('to: ', to);  
  
  console.log('attachments: ', attachments);
  
  var transporter = nodemailer.createTransport(
    
    smtpTransport(
      
      {
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'wdltest470@gmail.com',
          pass: 'Naruto43!'
        }
      }
      
    )
  );
  
  // verify connection configuration
  transporter.verify(function(error, success) {

    if (error) {
      
      console.log('transporter verify: ', error);

    } else {

      console.log('Server is ready to take our messages');
    }

    
  });
  
  transporter.sendMail({
    
    from: 'wdltest470@gmail.com',
    
    subject:" Cedolini ",
    
    text: testo_mail,
    
    attachments:[
    {
      'filename':'Cedolini.pdf',
      'path': attachments
    }
    ],
    
    to: to
    
  }, function(error, info) {
    
    if (error) {
      
      callback(false, to);
      
      return console.log('transporter sendMail: ', error);
      
    }
    
    console.log('Message %s sent: %s', info.messageId, info.response);
    
    console.log("Mail sent successfully");
    
    callback(true, to);
    
  });
  
}
