
module.exports = function (page){
  
  //error messages
  var errr = "CF not found";
  
  //fast RegExp based on CF format
  var fast_cf = /[a-zA-Z]{6}[a-zA-Z0-9]{2}[a-zA-Z][a-zA-Z0-9]{2}[a-zA-Z][a-zA-Z0-9]{3}[a-zA-Z]/g;
  
  //RegExp based on official CF format
  var cf = /^(?:(?:[B-DF-HJ-NP-TV-Z](?:[AEIOU]{2}|[AEIOU]X)|[AEIOU]{2}X|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[1256LMRS][\dLMNP-V])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[\dLMNP-V][1-9MNP-V]|[1-9MNP-V][0L]))[A-Z])/i;
  
  //first scan with fast_cf pattern
  var found = page.match(cf);
  
  if (found == null){
    
    console.log(errr);
    
    return null;
  } 
  
  else return found[o];
}




