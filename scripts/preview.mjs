/**
 * Serves `build/client` the way GitHub Pages does, so the deployed behaviour can be checked locally:
 * the site lives under its base path, directory URLs redirect to the trailing-slash form,
 * and unknown addresses answer with `404.html` and a 404 status.
 *
 *   BASE_PATH=<repository> npm run preview            (default port 4173)
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { siteConfig } from "../site.config.mjs";
import { OUTPUT_DIR } from "./build-output.mjs";

const PORT = Number(process.env.PORT ?? 4173);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function send(response, status, file) {
  response.writeHead(status, { "content-type": MIME_TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const prefix = siteConfig.basePath;
  const notFound = () => send(response, 404, join(OUTPUT_DIR, "404.html"));

  if (!pathname.startsWith(prefix)) {
    // GitHub Pages serves the repository under its path only; the site root is the user's own site.
    if (`${pathname}/` === prefix) {
      response.writeHead(301, { location: prefix + url.search });
      response.end();
      return;
    }
    notFound();
    return;
  }

  const relativePath = normalize(pathname.slice(prefix.length)).replace(/^([/\\])+/, "");
  const target = join(OUTPUT_DIR, relativePath);
  if (!target.startsWith(OUTPUT_DIR.replace(/[/\\]$/, "") + sep) && target !== OUTPUT_DIR) {
    notFound();
    return;
  }

  if (existsSync(target) && statSync(target).isDirectory()) {
    if (!pathname.endsWith("/")) {
      response.writeHead(301, { location: `${pathname}/${url.search}` });
      response.end();
      return;
    }
    const index = join(target, "index.html");
    if (existsSync(index)) {
      send(response, 200, index);
      return;
    }
  } else if (existsSync(target)) {
    send(response, 200, target);
    return;
  }
  notFound();
});

server.listen(PORT, () => {
  console.log(`Serving ${OUTPUT_DIR}\n  http://localhost:${PORT}${siteConfig.basePath}`);
});
