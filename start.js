console.log("start")
const path = require("path")
var child_process = require('child_process');

process.on('exit', function (){
    console.log("bye")
    child_process.exec("taskkill /F /im surreal.exe")
    child_process.exec("taskkill /F /im node.exe")
    child_process.exec("taskkill /F /im OpenConsole.exe")
});process.on('SIGINT', function (){
    console.log("bye")
    child_process.exec("taskkill /F /im surreal.exe")
    child_process.exec("taskkill /F /im node.exe")
    child_process.exec("taskkill /F /im OpenConsole.exe")
});




child_process.exec(`start cmd.exe /K node index.js`);