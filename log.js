var fs = require('fs');
const { logsFolder, lineBreak, lineBreakChar } = require('./config');
module.exports = {
    Logger: class{
        constructor(){
            
        }

        levels = ["INFO","DEBUG","WARN","ERROR"]

        _getCallerFile = function() {
            try {
                var err = new Error();
                var callerfile;
                var currentfile;
        
            Error.prepareStackTrace = function (err, stack) { return stack; };
        
            currentfile = err.stack.shift().getFileName();
        
            while (err.stack.length) {
                callerfile = err.stack.shift().getFileName();
        
                if(currentfile !== callerfile){
                    var file = callerfile.split("\\")
                    return file[file.length - 1]
                };
            }
        } catch (err) {}
        return "undefined";
        
        
        }

        createline(length){
            var line = ""
            for(var i = 0; i<(Math.floor(lineBreak/2))-(length/2); i++){
                line += lineBreakChar
            }
            return line
        }

        space = " "

        async addinfomessage(message){
            var length = message.length
            
            var data = `${this.createline(length)} ${message} ${this.createline(length)}`

            console.log(data)
        }

        async createlog(level,message,obj){
            var data = `${this.dateFormat()} | ${level} | ${this._getCallerFile()} | ${message} | `
            if(obj){
                try{
                    data += `data: ${JSON.stringify(obj)} |`
                }catch(e){
                    this.createlog("ERROR",e)
                }
            }
            console.log(data)
        }
        
        dateFormat(){
            return new Date(Date.now()).toUTCString()
        }

        info(message){
            this.createlog("INFO",message)
        }

        info(message,obj){
            this.createlog("INFO",message,obj)
        }

        debug(message){
            this.createlog("DEBUG",message)
        }

        debug(message,obj){
            this.createlog("DEBUG",message,obj)
        }

        error(message){
            this.createlog("ERROR",message)
        }

        error(message,obj){
            this.createlog("ERROR",message,obj)
        }
    }
}

