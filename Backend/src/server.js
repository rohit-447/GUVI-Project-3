const app = require("./app");
const config = require("./config/config");
require("dotenv").config();
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
