const http = require('http');
const fs = require('fs');
const path = require('path');
const handler = (req, res) => {
    console.log(`User requested the URL: ${req.url} using method: ${req.method}`);
    res.setHeader('Content-Type', 'text/html');
    let targetFile = "";
    if (req.url === '/'){
        targetFile = '../Project/Sign_Up/index.html';
    }
    else if (req.url === '/about'){
        targetFile = '../Project/Sign_In/index.html';
    }
    else{
        targetFile = req.url;
    }

    let filePath = path.join(__dirname, 'Project', targetFile);
    let extname = path.extname(filePath);
    let contentType = 'text/html';
    if (extname === '.css'){
        contentType = 'text/css';
    }
    else if (extname === '.js'){
        contentType = 'text/javascript';
    }
    else if (extname === '.json')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              {
        contentType = 'application/json';
    }
    else if (extname === '.png'){
        contentType = 'image/png';
    }
    else if (extname === '.jpg'){
        contentType = 'image/jpg';
    }   
    else if (extname === '.jpeg'){
        contentType = 'image/jpeg';
    }
    fs.readFile(filePath, (err, data) => {
        if (err){
            if (err.code === 'ENOENT'){
                fs.readFile(path.join(__dirname, 'Project', '404.html'), (err, errContent) => {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(errContent, 'utf8');
             })       
            }
            else{
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }

        }
        else{
            res.writeHead(200, {'Content-Type': contentType});
            res.end(data, 'utf8');
        }
})
};

const server = http.createServer(handler);

// server.listen(8081, () => {
//     console.log('Server is alive and listening on http://localhost:8081');
// });

module.exports = handler;





