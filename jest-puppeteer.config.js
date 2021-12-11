const path = require("path");

const BUILD_PATH = path.resolve(__dirname, process.env.BUILD_PATH || "dist");

module.exports = {
  launch: {
    // @link https://github.com/mujo-code/puppeteer-headful
    executablePath: process.env.PUPPETEER_EXEC_PATH,
    headless: false,
    args: [`--disable-extensions-except=${BUILD_PATH}`, `--load-extension=${BUILD_PATH}`]
  }
};
