const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);

    let requestPath = req.url.split("?")[0];

    // Remove trailing slash except for /
    if (requestPath.length > 1 && requestPath.endsWith("/")) {
        requestPath = requestPath.slice(0, -1);
    }

    // Routes
    if (requestPath === "/") {
        requestPath = "/Project/Sign_Up/index.html";
    } 
    else if (
        requestPath.toLowerCase() === "/sign_in" ||
        requestPath.toLowerCase() === "/signin"
    ) {
        requestPath = "/Project/Sign_In/index.html";
    } 
    else if (
        requestPath.toLowerCase() === "/sign_up" ||
        requestPath.toLowerCase() === "/signup"
    ) {
        requestPath = "/Project/Sign_Up/index.html";
    }
    else {
        // Files such as:
        // /Project/Sign_In/style.css
        // /Project/images/background.png
        // etc.
        requestPath = requestPath;
    }

    const filePath = path.join(__dirname, requestPath);

    // Security: prevent accessing files outside the project
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, {
            "Content-Type": "text/plain"
        });
        res.end("403 - Forbidden");
        return;
    }

    fs.readFile(filePath, (error, data) => {

        if (error) {
            console.log("File not found:", filePath);

            res.writeHead(404, {
                "Content-Type": "text/html"
            });

            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - File Not Found</title>
                </head>
                <body>
                    <h1>404 - File Not Found</h1>
                    <p>The page you requested could not be found.</p>
                </body>
                </html>
            `);

            return;
        }

        const extension = path.extname(filePath).toLowerCase();

        const contentTypes = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "application/javascript",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
            ".webp": "image/webp"
        };

        const contentType =
            contentTypes[extension] || "application/octet-stream";

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
