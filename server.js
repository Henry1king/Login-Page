const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Map clean URL paths to actual files on disk.
// Add every "page route" your site needs here.
const ROUTES = {
    '/': 'Sign_Up/index.html',
    '/signup': 'Sign_Up/index.html',
    '/signin': 'Sign_In/index.html',
    '/login': 'Sign_In/index.html'
};

const handler = (req, res) => {
    console.log(`User requested the URL: ${req.url} using method: ${req.method}`);

    // Strip query string (e.g. /signin?ref=home) before matching
    const urlPath = req.url.split('?')[0];

    let targetFile;

    if (ROUTES[urlPath]) {
        targetFile = ROUTES[urlPath];
    } else {
        // Anything else: treat as a static asset (css, js, images, etc.)
        // Strip leading slash so path.join doesn't escape the Project folder
        targetFile = urlPath.replace(/^\/+/, '');
    }

    const filePath = path.join(__dirname, 'Project', targetFile);

    // Safety check: make sure resolved path is still inside Project/
    const projectRoot = path.join(__dirname, 'Project');
    if (!filePath.startsWith(projectRoot)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);

            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
};

module.exports = handler;
