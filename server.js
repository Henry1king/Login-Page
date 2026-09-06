const http = require('http');
const fs = require('fs');
const path = require('path');

// Recursively list files under a directory (for debugging deployment issues)
function listFilesRecursive(dir, base = dir) {
    let results = [];
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        return [`ERROR reading ${dir}: ${e.message}`];
    }
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(base, fullPath);
        if (entry.isDirectory()) {
            results.push(relPath + '/');
            results = results.concat(listFilesRecursive(fullPath, base));
        } else {
            results.push(relPath);
        }
    }
    return results;
}

const handler = (req, res) => {
    console.log(`User requested the URL: ${req.url} using method: ${req.method}`);

    const urlPath = req.url.split('?')[0];

    // TEMPORARY DEBUG ROUTE — visit /debug to see what files actually exist
    if (urlPath === '/debug') {
        const info = {
            __dirname: __dirname,
            filesUnderDirname: listFilesRecursive(__dirname),
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(info, null, 2));
        return;
    }

    let targetFile;

    // Home page / Sign Up page
    if (urlPath === '/' || urlPath === '/signup') {
        targetFile = 'Sign_Up/index.html';
    }

    // Sign In page — matches /sign_in, /signin, and /login
    else if (urlPath === '/signin' || urlPath === '/login' || urlPath === '/sign_in') {
        targetFile = 'Sign_In/index.html';
    }

    // Other files such as CSS, images, etc.
    else {
        targetFile = urlPath;
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

            if (err.code === 'ENOENT') {
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                });

                res.end('<h1>404 - File Not Found</h1>');
            }
            else {
                res.writeHead(500);
                res.end('Server Error');
            }

            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType
        });

        res.end(data);
    });
};

module.exports = handler;
