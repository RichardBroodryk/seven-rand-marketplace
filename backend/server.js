require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log("====================================");
  console.log(" Seven Rand Marketplace API Running");
  console.log("====================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log("");
});