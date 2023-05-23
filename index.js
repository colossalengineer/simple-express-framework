// Extra
process.env.root = __dirname;

// Config
const { port, version } = require('./config');


// Logger
const { Logger } = require('./log');
log = new Logger("index.js")

process.on('uncaughtException', function(err) {
        log.error('Caught exception: ' + err);
    });

log.addinfomessage("STARTING")
log.addinfomessage(log.dateFormat())
log.addinfomessage(`Version: ${version}`)
log.info(`Starting AQ!`)

// Database
const Database = require("./database")

// Imports
const express = require('express')

const path = require("path")
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
    const body = req.body
    try{
        var result = await Database.query(body.query)
        if(result){
            res.json(result);
        }
        res.json({ "error": "unknown"})
    }catch(error){
        res.json({ "error": error})
    }
})

app.post("/version",async (req,res)=>{
    res.json({ "version": version})
})

app.use("/",express.static("./www"))

app.get("*", (req,res)=>{
    res.render(path.join(__dirname,"view/404.ejs"),{
        path: req.path
    })
})

app.listen(port, () => log.info(`short listening on port ${port}!`))