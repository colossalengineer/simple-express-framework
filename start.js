console.log("start")
const path = require("path")
var child_process = require('child_process');

child_process.exec(`start cmd.exe /K cd database && start surreal.exe start --log debug --user root --pass root "file:${path.join(__dirname,"database/DB")}"`);


child_process.exec(`start cmd.exe /K node index.js`);