// Extra
process.env.root = __dirname;

const log = new Logger()

var child_process = require('child_process');

child_process.exec(`start ./database/surreal.exe start --log debug --user root --pass root "file:${path.join(__dirname,"database/DB")}"`);

process.on('uncaughtException', function(err) {
        // log.error('Caught exception: ' + err);
});

let interval

process.on('exit', function (){
    console.log("bye")
    clearInterval(interval)
    child_process.exec("taskkill /F /im surreal.exe")
    child_process.exec("taskkill /F /im node.exe")
    child_process.exec("taskkill /F /im OpenConsole.exe")
});
process.on('SIGINT', function (){
    console.log("bye")
    clearInterval(interval)
    child_process.exec("taskkill /F /im surreal.exe")
    child_process.exec("taskkill /F /im node.exe")
    child_process.exec("taskkill /F /im OpenConsole.exe")
});

log.addinfomessage("STARTING")
log.addinfomessage(log.dateFormat())
log.addinfomessage(`Version: ${Config.version}`)
log.info(`Starting AQ!`)

// Imports
const express = require('express')

const app = express()
const bodyParser = require('body-parser');
const { config } = require('dotenv');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.set('view engine', 'ejs');

app.use((req,res,next)=>{
    log.debug(`Method: ${req.method} | Path: ${req.path}`)
    res.setHeader("X-Powered-By","simple express app")
    next()
})

app.post("/query",async (req,res)=>{
    try{
        const body = req.body
        log.debug(JSON.stringify(body))
        var result = await Database.query(body.query)
        if(result){
            res.json(result);
        }
        res.json({ "error": "unknown"})
    }catch(error){
        log.error(error)
        res.json({ "error": `${error}`})
    }
})

app.post("/version",async (req,res)=>{
    res.json({ "version": Config.version})
})

app.use("/",express.static("./www"))

app.get("*", (req,res)=>{
    res.status(404).render(path.join(__dirname,"view/404.ejs"),{
        path: req.path
    })
})

app.listen(Config.port, () => log.info(`Http Server listening on port ${Config.port}!`))