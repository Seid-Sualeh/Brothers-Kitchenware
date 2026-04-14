const conn = require("../config/db.config");
const fs = require("fs");
const path = require("path");

console.log("Install service loaded from:", __filename);

async function install() {
  const queryfile = path.join(__dirname, "..", "sql", "initial-queries.sql");
  console.log("Install service reading file:", queryfile);
  let queries = [];
  let finalMessage = {};
  let templine = "";

  await conn.ensureDatabase();

  const lines = fs.readFileSync(queryfile, "utf-8").split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("--") || trimmed === "") {
      return;
    }
    templine += `${line}\n`;
    if (trimmed.endsWith(";")) {
      queries.push(templine.trim());
      templine = "";
    }
  });

  for (let i = 0; i < queries.length; i++) {
    try {
      await conn.query(queries[i]);
    } catch (err) {
      finalMessage.message = "Not all tables are created";
    }
  }

  if (!finalMessage.message) {
    finalMessage.message = "All tables are created";
    finalMessage.status = 200;
  } else {
    finalMessage.status = 500;
  }

  return finalMessage;
}

module.exports = { install };
