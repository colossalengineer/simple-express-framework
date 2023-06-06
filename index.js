// Config.js
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();
// Version
let package = JSON.parse(fs.readFileSync("./package.json", { encoding: "utf8" }));
const Config = {
    version: package.version,
    port: process.env.PORT,
    lineBreak: process.env.BREAK,
    lineBreakChar: process.env.BREAKCHAR,
    appPath: __dirname,
    DBNamespace: process.env.DBNAMESPACE,
    DBDataBase: process.env.DBDATABASE,
    DBUsername: process.env.DBUSERNAME,
    DBPassword: process.env.DBPASSWORD,
};
class Logger {
    constructor() { }
    levels = ["INFO", "DEBUG", "WARN", "ERROR"];
    _getCallerFile = function () {
        try {
            var err = new Error();
            var callerfile;
            var currentfile;
            Error.prepareStackTrace = function (err, stack) {
                return stack;
            };
            // @ts-ignore
            currentfile = err.stack.shift().getFileName();
            while (err.stack.length) {
                // @ts-ignore
                callerfile = err.stack.shift().getFileName();
                if (currentfile !== callerfile) {
                    var file = callerfile.split("\\");
                    return file[file.length - 1];
                }
            }
        }
        catch (err) { }
        return "undefined";
    };
    createline(length) {
        var line = "";
        // @ts-ignore
        for (var i = 0; i < Math.floor(Config.lineBreak / 2) - length / 2; i++) {
            line += Config.lineBreakChar;
        }
        return line;
    }
    space = " ";
    async addinfomessage(message) {
        var length = message.length;
        var data = `${this.createline(length)} ${message} ${this.createline(length)}`;
        console.log(data);
    }
    async createlog(level, message, obj) {
        var data = `${this.dateFormat()} | ${level} | ${this._getCallerFile()} | ${message} | `;
        if (obj) {
            try {
                data += `data: ${JSON.stringify(obj)} |`;
            }
            catch (e) {
                this.createlog("ERROR", e);
            }
        }
        console.log(data);
    }
    dateFormat() {
        return new Date(Date.now()).toUTCString();
    }
    info(message, obj) {
        this.createlog("INFO", message, obj);
    }
    debug(message, obj) {
        this.createlog("DEBUG", message, obj);
    }
    error(message, obj) {
        this.createlog("ERROR", message, obj);
    }
}
// Extra
process.env.root = __dirname;
const log = new Logger();
var child_process = require('child_process');
child_process.exec(`start ./database/surreal.exe start --log debug --user root --pass root "file:${path.join(__dirname, "database/DB")}"`);
process.on('uncaughtException', function (err) {
    // log.error('Caught exception: ' + err);
});
let interval;
process.on('exit', function () {
    console.log("bye");
    clearInterval(interval);
    child_process.exec("taskkill /F /im surreal.exe");
    child_process.exec("taskkill /F /im node.exe");
    child_process.exec("taskkill /F /im OpenConsole.exe");
});
process.on('SIGINT', function () {
    console.log("bye");
    clearInterval(interval);
    child_process.exec("taskkill /F /im surreal.exe");
    child_process.exec("taskkill /F /im node.exe");
    child_process.exec("taskkill /F /im OpenConsole.exe");
});
log.addinfomessage("STARTING");
log.addinfomessage(log.dateFormat());
log.addinfomessage(`Version: ${Config.version}`);
log.info(`Starting AQ!`);
// Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { config } = require('dotenv');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use((req, res, next) => {
    log.debug(`Method: ${req.method} | Path: ${req.path}`);
    res.setHeader("X-Powered-By", "simple express app");
    next();
});
app.post("/query", async (req, res) => {
    try {
        const body = req.body;
        log.debug(JSON.stringify(body));
        var result = await Database.query(body.query);
        if (result) {
            res.json(result);
        }
        res.json({ "error": "unknown" });
    }
    catch (error) {
        log.error(error);
        res.json({ "error": `${error}` });
    }
});
app.post("/version", async (req, res) => {
    res.json({ "version": Config.version });
});
app.use("/", express.static("./www"));
app.get("*", (req, res) => {
    res.status(404).render(path.join(__dirname, "view/404.ejs"), {
        path: req.path
    });
});
app.listen(Config.port, () => log.info(`Http Server listening on port ${Config.port}!`));
const Surreal = require('surrealdb.js');
// @ts-ignore
log.info("Connecting to databse");
let Database;
(async () => {
    interval = setInterval(async () => {
        try {
            log.info("connecting to DB");
            Database = new Surreal.default('http://127.0.0.1:8000/rpc');
            // Signin as a namespace, database, or root user
            await Database.signin({
                user: Config.DBUsername,
                pass: Config.DBPassword,
            });
            // Select a specific namespace / database
            await Database.use(Config.DBNamespace, Config.DBDataBase);
            log.info("Connected to databse");
            clearInterval(interval);
        }
        catch (e) {
            log.error(`Database Login: ${e}`);
        }
    }, 2000);
})();
