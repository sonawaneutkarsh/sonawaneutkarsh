import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { marked } from "marked";

const README_PATH = "README.md";

function renderPage() {
  const markdown = readFileSync(README_PATH, "utf8");
  const body = marked.parse(markdown);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>sonawaneutkarsh — GitHub Profile README</title>
<style>
  :root {
    color-scheme: dark;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #0d1117;
    color: #e6edf3;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    line-height: 1.6;
  }
  .banner {
    background: #161b22;
    border-bottom: 1px solid #30363d;
    padding: 10px 24px;
    font-size: 13px;
    color: #8b949e;
  }
  .banner a { color: #58a6ff; text-decoration: none; }
  .banner a:hover { text-decoration: underline; }
  .container {
    max-width: 920px;
    margin: 0 auto;
    padding: 32px 24px 64px;
  }
  h1, h2, h3, h4 { border-bottom: 1px solid #21262d; padding-bottom: 0.3em; margin-top: 1.5em; }
  h1:first-child { margin-top: 0; }
  a { color: #58a6ff; }
  img { max-width: 100%; }
  code {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 0.2em 0.4em;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    font-size: 0.9em;
  }
  pre {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
  }
  pre code { background: none; border: none; padding: 0; }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  th, td {
    border: 1px solid #30363d;
    padding: 8px 12px;
    text-align: left;
    vertical-align: top;
  }
  th { background: #161b22; }
  blockquote {
    border-left: 4px solid #30363d;
    margin: 1em 0;
    padding: 0 1em;
    color: #8b949e;
  }
  hr { border: none; border-top: 1px solid #21262d; margin: 2em 0; }
</style>
</head>
<body>
  <div class="banner">Previewing <strong>README.md</strong> of <a href="https://github.com/sonawaneutkarsh/sonawaneutkarsh">sonawaneutkarsh/sonawaneutkarsh</a></div>
  <main class="container">
${body}
  </main>
</body>
</html>
`;
}

if (process.argv.includes("--build")) {
  mkdirSync("dist", { recursive: true });
  writeFileSync("dist/index.html", renderPage());
  console.log("Built dist/index.html");
} else {
  const port = Number(process.env.PORT) || 3000;
  const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderPage());
  });
  const host = process.env.HOST || "127.0.0.1";
  server.listen(port, host, () => {
    console.log(`Serving README preview on http://${host}:${port}`);
  });
}
