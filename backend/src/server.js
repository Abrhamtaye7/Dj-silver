require("dotenv").config();

const connectDb = require("./config/db");
const createApp = require("./app");

const PORT = process.env.PORT || 5000;
const app = createApp();

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
