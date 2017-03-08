// tools.js
// ========
var md5 = require('md5');

verbose=false;

function reverse(s){
    return s.split("").reverse().join("");
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function ROT13(char){
  //console.log(char);
  //console.log(char + " + 1 = ", String.fromCharCode(char.charCodeAt(0)+1));
      if (char.charCodeAt(0) - 'a'.charCodeAt(0) < 14)
    return String.fromCharCode(char.charCodeAt(0)+13);
    
    return String.fromCharCode(char.charCodeAt(0)-13);
}

module.exports = {
  setVerbose: function(a){
    verbose=a;
    return NULL;
  },
  validString: function (str, toVstr) {
    if(typeof str !== 'string'){
      throw new Error('[VESP] Illegal argument. Must be string. Got '+ typeof str);
    }
    if(verbose) console.log("[VESP] I got: "+ str);
    str=reverse(str);
    auxA=str.substring(0, 16);
    auxB=str.substring(16, 32);
    str=auxB+auxA;
    if(verbose) console.log("[VESP] auxA: "+auxA);
    if(verbose) console.log("[VESP] auxB: "+auxB);

    if(verbose) console.log("[VESP] After ROT13: "+str);

    str=setCharAt(str, 23, '2');

    if(verbose) console.log("[VESP] After Magic: "+str);

    if(verbose)console.log("[VESP] What I should have gotten: "+md5(str));
    if(verbose) console.log("[VESP] What I actually got      : "+toVstr);

    return (md5(str)===toVstr);
  },

  getString: function(){
    return md5(process.hrtime()[1]);
  }
};
