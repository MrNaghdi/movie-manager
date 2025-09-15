
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// Read .env
dotenv.config({ path: "./config.env" });

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

// Turn on server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
