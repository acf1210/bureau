#!/usr/bin/env node
/* @bureau-internal — excluded from design audits */
/** Tiny static server for dist/ or a given directory. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || "dist");
const port = Number(process.env.PORT || process.argv[3] || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let file = path.join(root, urlPath);
  if (!file.startsWith(root)) { res.writeHead(403); res.end("Forbidden"); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    const notFound = path.join(root, "404.html");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    if (fs.existsSync(notFound)) fs.createReadStream(notFound).pipe(res);
    else res.end("Not found");
    return;
  }
  res.writeHead(200, {
    "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`BUREAU site → http://localhost:${port}/ (${root})`);
});
