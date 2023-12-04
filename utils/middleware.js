const { onErrorResumeNext } = require("rxjs");
const config = require("../config/config");


const middleware = {
    
    validAdmin: function(log){
        if(log == undefined){
            return false;
        }
        if(log.user === config.admin && log.pass === config.padmin){
            return true;
        }else{
            return false;
        }

    },    
}

module.exports = middleware;