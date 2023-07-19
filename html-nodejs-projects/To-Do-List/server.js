const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Handle GET request to fetch tasks
    if (parsedUrl.pathname === '/tasks' && req.method === 'GET') {
        fs.readFile('tasks.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    }

    // Handle POST request to add a new task
    else if (parsedUrl.pathname === '/tasks' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            fs.readFile('tasks.json', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    const tasks = JSON.parse(data);
                    const newTask = JSON.parse(body);
                    newTask.id = tasks.length + 1;
                    tasks.push(newTask);

                    fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Internal Server Error');
                        } else {
                            res.writeHead(201, { 'Content-Type': 'text/plain' });
                            res.end('Task added successfully');
                        }
                    });
                }
            });
        });
    }

    // Add additional handlers for updating and deleting tasks

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
