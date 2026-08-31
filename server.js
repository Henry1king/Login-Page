const http = require('http');
const fs = require('fs');
const path = require('path');

const handler = (req, res) => {
    console.log(`User requested the URL: ${req.url} using method: ${req.method}`);

    let targetFile;

    // Home page
    if (req.url === '/') {
        targetFile = 'Sign_Up/index.html';
    }

    // Sign In page
    else if (req.url === '/about' || req.url === '/Sign_In') {
        targetFile = 'Sign_In/index.html';
    }

    // Other files such as CSS, images, etc.
    else {
        targetFile = req.url;
    }

    const filePath = path.join(__dirname, 'Project', targetFile);

    const extname = path.extname(filePath);

    let contentType = 'text/html';

    if (extname === '.css') {
        contentType = 'text/css';
    }
    else if (extname === '.js') {
        contentType = 'text/javascript';
    }
    else if (extname === '.json') {
        contentType = 'application/json';
    }
    else if (extname === '.png') {
        contentType = 'image/png';
    }
    else if (extname === '.jpg') {
        contentType = 'image/jpeg';
    }
    else if (extname === '.jpeg') {
        contentType = 'image/jpeg';
    }

     fs.readFile(filePath, (err, data) => {

        if (err) {
            console.error(err);

            if (err.codent-Type: 'text/html'
                });

                res.end('<h1>404 - File Not Found</h1>');
            }
            else {
                res.writeHead(500);
                res.end === 'ENOENT') {
                res.writeHead(404, {
                    'Conte('Server Error');
            }

            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType
        });

        res.end(data);


};

module.exports = handler;
