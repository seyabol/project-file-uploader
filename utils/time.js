const ms = require("ms");

function parseDuration(durationString) {
  const milliseconds = ms(durationString);
  if (!milliseconds) {
    throw new Error("Invalid duration format");
  }
  return new Date(Date.now() + milliseconds);
}

module.exports = { parseDuration };
