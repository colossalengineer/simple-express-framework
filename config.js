// Config.js
const dotenv = require('dotenv');
dotenv.config();
const fs = require("fs")

// Version
let package = JSON.parse(fs.readFileSync("./package.json",{encoding: "utf8"}))

module.exports = {
    version: package.version,
    port: process.env.PORT,
    lineBreak: process.env.BREAK,
    lineBreakChar: process.env.BREAKCHAR,
    appPath: __dirname,
    DBNamespace: process.env.DBNAMESPACE,
    DBDataBase: process.env.DBDATABASE,
    DBUsername: process.env.DBUSERNAME,
    DBPassword: process.env.DBPASSWORD,
}