const http = require('http');

const port = 3000;

// Helper function to parse the request body
function parseBody(request, callback) {
  let body = '';
  request.on('data', chunk => {
    body += chunk.toString();
  });
  request.on('end', () => {
    callback(JSON.parse(body));
  });
}

// CORS middleware
function enableCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Calculator API endpoint
function calculate(req, res) {
  // Enable CORS for all routes by calling the middleware
  enableCors(req, res);

  // Rest of the existing 'calculate' function code (unchanged)
  parseBody(req, ({ operator, num1, num2 }) => {
    let result;

    switch (operator) {
      case 'add':
        result = num1 + num2;
        break;
      case 'subtract':
        result = num1 - num2;
        break;
      case 'multiply':
        result = num1 * num2;
        break;
      case 'divide':
        result = num1 / num2;
        break;
      default:
        return res.writeHead(400).end(JSON.stringify({ error: 'Invalid operator' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result }));
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    // Handle pre-flight requests (for CORS support)
    enableCors(req, res);
    res.writeHead(200);
    res.end();
  } else if (req.method === 'POST' && req.url === '/api/calculate') {
    calculate(req, res);
  } else {
    res.writeHead(404).end();
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
