# simple-express-framework

simple express framework

## Web stuff

Put all files in the www folder

urls work by / will get the index.html file in the www folder

/hello will get the index.html file in a folder call hello inside the www

/example.html with get the example.html file in the www folder

## start

double click the start.bat file to start the server

## UI for DB

https://github.com/StarlaneStudios/Surrealist/releases/download/v1.7.0/surrealist-v1.7.0-windows.msi

username = root

password = root

namespace = web

database = web

## database querys

create a post request using jquery

Add these two files to the head of you HTMl page:
```html
    <script src="/javascript/jquery.js"></script>
    <script src="/javascript/database.js"></script>
```

In you own javascript file call this function to make a database query:
```js
    await query("your query string");
```