const path = require("path");
const fs = require("fs");
const indexDir = path.join(__dirname, "/../../dist/wishlist/browser/index.html");
const pageDir = path.join(__dirname, "/../../dist/wishlist/browser/404.html");
fs.copyFileSync(indexDir, pageDir);
