"use strict";
const path = require("path");
const fs = require("fs");

fs.rmdirSync(path.join(__dirname, "docs"), { recursive: true });
fs.renameSync(path.join(__dirname, "public"), path.join(__dirname, "docs"));
