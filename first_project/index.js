import { createServer } from 'node:http';
import {URL} from "node:url"
import { readFileSync } from "node:fs";

const inhtml = readFileSync("public/index.html")
const icon = readFileSync("public/favicon.ico")
const server = createServer((req, res) => {

  const url = new URL(`http://${host}${req.url}`);
  const pa = url.pathname;
  console.log(`Request: ${req.method} ${pa}`);


  if(pa === "/" && req.method=== "GET"){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(inhtml);
  }

  if(req.url === '/favicon.ico' && req.method=== "GET"){

  res.writeHead(200, { 'Content-Type': 'image/x-icon' });

    res.end(icon);
  }

  if (!res.writableEnded) {

    res.writeHead(404, { 'Content-Type': 'text/plain' });

    res.end('Site not found!\n');

  }
});
  const port = 8000;

const host = "localhost";


// Start the server

server.listen(port, host, () => {

    console.log(`Server listening on http://${host}:${port}`);
  
});

