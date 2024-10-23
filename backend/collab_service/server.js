const app = require("./app");

const port = 5004;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})