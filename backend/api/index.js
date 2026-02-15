const connectDb = require("../src/config/db");
const createApp = require("../src/app");

let cachedApp;
let cachedDb;

module.exports = async (req, res) => {
  if (!cachedDb) {
    cachedDb = connectDb();
  }

  await cachedDb;

  if (!cachedApp) {
    cachedApp = createApp();
  }

  return cachedApp(req, res);
};
